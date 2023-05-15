from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import re
from server.setup import DIR_CLIENT, FILE_CONFIG, ABS_FILE_CONFIG, FILE_ROOM, ABS_FILE_ROOM, FILE_LOCAL, ABS_FILE_LOCAL, FILE_NATIONAL, ABS_FILE_NATIONAL, FILE_WEATHER, ABS_FILE_WEATHER, FILE_CUSTOM, ABS_FILE_CUSTOM, ABS_FILE_CHANGE

PASSWORD = ''

SERVED_FILES = {
    FILE_LOCAL: ABS_FILE_LOCAL,
    FILE_NATIONAL: ABS_FILE_NATIONAL,
    FILE_WEATHER: ABS_FILE_WEATHER,
    FILE_ROOM: ABS_FILE_ROOM,
    FILE_CUSTOM: ABS_FILE_CUSTOM
}


class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR_CLIENT, **kwargs)

    def do_GET(self):
        if self.path[1:] == FILE_CONFIG:
            with open(ABS_FILE_CONFIG) as f:
                config_data = json.load(f)
            del config_data['password']
            del config_data['api']
            with open(ABS_FILE_CHANGE) as f:
                version = re.search('[0-9]+\.[0-9]+\.[0-9]+', f.read()).group()
            config_data['version'] = version
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(config_data).encode())
        elif self.path[1:] in SERVED_FILES:
            self.send_response(200)
            self.end_headers()
            with open(SERVED_FILES[self.path[1:]]) as f:
                self.wfile.write(f.read().encode())
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.headers.get('password') == PASSWORD:
            if self.path[1:] == FILE_ROOM:
                payload = json.loads(self.rfile.read(
                    int(self.headers.get('Content-Length'))))
                with open(ABS_FILE_ROOM, 'w') as f:
                    json.dump(payload, f)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'{"status":200}')
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"status":400}')
        else:
            self.send_response(401)
            self.end_headers()
            self.wfile.write(b'{"status":401}')


def startServer(port: int = 8000):
    global PASSWORD
    with open(ABS_FILE_CONFIG) as f:
        PASSWORD = json.load(f).get('password')
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()
