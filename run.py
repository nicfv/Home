import threading
from python.server import startServer
from python.collect import routine

t_server = threading.Thread(target=startServer)
t_server.start()
t_collect = threading.Thread(target=routine, args=(0, True))
t_collect.start()
