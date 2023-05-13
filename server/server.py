from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
from server.setup import DIR_CLIENT, REL_FILE_ROOM, ABS_FILE_CONFIG, ABS_FILE_ROOM

PASSWORD = ''

class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR_CLIENT, **kwargs)

    def do_POST(self):
        if self.headers.get('password') == PASSWORD:
            if self.path[1:] == REL_FILE_ROOM:
                payload = json.loads(self.rfile.read(
                    int(self.headers.get('Content-Length'))))
                with open(ABS_FILE_ROOM, 'w') as f:
                    json.dump(payload, f)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":200}')
            elif self.path[1:] == 'config':
                with open(ABS_FILE_CONFIG) as f:
                    config_data = json.load(f)
                del config_data['password']
                del config_data['api']
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(config_data).encode('utf-8'))
            else:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":400}')
        else:
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":401}')


def startServer(port: int = 8000):
    global PASSWORD
    with open(ABS_FILE_CONFIG) as f:
        PASSWORD = json.load(f).get('password')
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()
