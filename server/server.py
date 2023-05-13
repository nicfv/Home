from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
from server.setup import DIR_CLIENT, REL_FILE_ROOM, PASSWORD


class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR_CLIENT, **kwargs)

    def do_POST(self):
        if self.headers.get('password') == PASSWORD:
            if self.path[1:] in REL_FILE_ROOM:
                payload = json.loads(self.rfile.read(
                    int(self.headers.get('Content-Length'))))
                with open(self.path[1:], 'w') as f:
                    json.dump(payload, f)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":200}')
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
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()
