from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import re
from server.setup import DIR_CLIENT, FILE_CONFIG, ABS_FILE_CONFIG, FILE_ROOM, ABS_FILE_ROOM, FILE_LOCAL, ABS_FILE_LOCAL, FILE_NATIONAL, ABS_FILE_NATIONAL, FILE_WEATHER, ABS_FILE_WEATHER, FILE_TRAFFIC, ABS_FILE_TRAFFIC, FILE_CUSTOM, ABS_FILE_CUSTOM, ABS_FILE_CHANGE

PASSWORD = ''

SERVED_FILES = {
    FILE_LOCAL: ABS_FILE_LOCAL,
    FILE_NATIONAL: ABS_FILE_NATIONAL,
    FILE_WEATHER: ABS_FILE_WEATHER,
    FILE_ROOM: ABS_FILE_ROOM,
    FILE_TRAFFIC: ABS_FILE_TRAFFIC,
    FILE_CUSTOM: ABS_FILE_CUSTOM
}


class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR_CLIENT, **kwargs)

    def do_GET(self) -> None:
        if self.path[1:] == FILE_CONFIG:
            if self.check_password():
                with open(ABS_FILE_CONFIG) as f:
                    config_data = json.load(f)
                config_data.pop('password', None)
                config_data.pop('api', None)
                config_data.pop('coordinates', None)
                config_data.pop('custom', None)
                with open(ABS_FILE_CHANGE) as f:
                    version = re.search(
                        '[0-9]+\.[0-9]+\.[0-9]+', f.read()).group()
                config_data['version'] = version
                self.send_text(json.dumps(config_data))
            else:
                self.send_status(401)
        elif self.path[1:] in SERVED_FILES:
            if self.check_password():
                with open(SERVED_FILES[self.path[1:]]) as f:
                    self.send_text(f.read())
            else:
                self.send_status(401)
        elif self.path[1:] == 'locked':
            self.send_text(str(bool(PASSWORD)).lower())
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self) -> None:
        if self.check_password():
            if self.path[1:] == FILE_ROOM:
                payload = json.loads(self.rfile.read(
                    int(self.headers.get('Content-Length'))))
                with open(ABS_FILE_ROOM, 'w') as f:
                    json.dump(payload, f)
                self.send_status(200, True)
            else:
                self.send_status(400, True)
        else:
            self.send_status(401, True)

    def check_password(self) -> bool:
        return (not bool(PASSWORD)) or self.headers.get('Authorization') == PASSWORD

    def send_status(self, status: int, returnStatus: bool = False) -> None:
        self.send_response(status)
        self.end_headers()
        if returnStatus:
            self.wfile.write(('{"status": ' + str(status) + '}').encode())

    def send_text(self, text: str) -> None:
        self.send_response(200)
        self.end_headers()
        self.wfile.write(text.encode())


def startServer(port: int = 8000) -> None:
    global PASSWORD
    with open(ABS_FILE_CONFIG) as f:
        PASSWORD = json.load(f).get('password')
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()
