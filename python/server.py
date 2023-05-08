from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

ALLOWED_POST = ['/data/shop.json', '/data/todo.json']


class RequestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path in ALLOWED_POST:
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


def startServer(port: int = 8000):
    server = HTTPServer(('', port), RequestHandler)
    server.serve_forever()
