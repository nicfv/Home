import threading
from server.setup import makeFiles
from server.server import startServer
from server.collect import routine, readConfig
from server.validator import checkJSON

makeFiles()
if checkJSON('config.json'):
    readConfig()
    threading.Thread(target=startServer).start()
    threading.Thread(target=routine).start()
