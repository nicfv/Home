import threading
from server.setup import makeFiles
from server.server import startServer, shutdownServer
from server.collect import routine, readConfig, stopCollecting
from server.validator import checkJSON

print('Type `exit` at any time to stop the program.')
makeFiles()
if checkJSON('config.json'):
    readConfig()
    threading.Thread(target=startServer).start()
    threading.Thread(target=routine).start()
    while True:
        if input() == 'exit':
            print('Shutting down...')
            shutdownServer()
            stopCollecting()
            exit()
