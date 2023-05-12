import threading
from python.setup import makeFiles
from python.server import startServer
from python.collect import routine

makeFiles()
t_server = threading.Thread(target=startServer)
t_server.start()
t_collect = threading.Thread(target=routine)
t_collect.start()
