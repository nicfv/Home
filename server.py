from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import os

ALLOWED_POST = ['/test.json', '/test2.json']


class RequestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path in ALLOWED_POST:
            payload = json.loads(self.rfile.read(
                int(self.headers.get('Content-Length'))))
            with open(os.path.basename(self.path), 'w') as f:
                json.dump(payload, f)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":200}')
        else:
            pass
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":400}')


server = HTTPServer(('', 5500), RequestHandler)
server.serve_forever()
