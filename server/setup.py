import os


DIR_CLIENT = 'client'
DIR_SERVER = 'server'
DIR_SCHEMA = 'schemas'
DIR_API = 'api'
DIR_DATA = 'data'
FILE_CONFIG = 'config.json'
FILE_ROOM = 'room.json'
FILE_LOCAL = 'news-local.json'
FILE_NATIONAL = 'news-national.json'
FILE_WEATHER = 'weather.json'


REL_FILE_ROOM = os.path.join(DIR_DATA, FILE_ROOM)
ABS_DIR_API = os.path.join(DIR_CLIENT, DIR_API)
ABS_DIR_DATA = os.path.join(DIR_CLIENT, DIR_DATA)
ABS_FILE_CONFIG = os.path.join(FILE_CONFIG)
ABS_FILE_ROOM = os.path.join(ABS_DIR_DATA, FILE_ROOM)
ABS_FILE_LOCAL = os.path.join(DIR_CLIENT, DIR_API, FILE_LOCAL)
ABS_FILE_NATIONAL = os.path.join(DIR_CLIENT, DIR_API, FILE_NATIONAL)
ABS_FILE_WEATHER = os.path.join(DIR_CLIENT, DIR_API, FILE_WEATHER)
ABS_FILE_SCHEMA_ROOM = os.path.join(DIR_SERVER, DIR_SCHEMA, FILE_ROOM)
ABS_FILE_SCHEMA_CONFIG = os.path.join(DIR_SERVER, DIR_SCHEMA, FILE_CONFIG)


def makeFiles():
    os.makedirs(ABS_DIR_API, exist_ok=True)
    os.makedirs(ABS_DIR_DATA, exist_ok=True)
    if not os.path.exists(ABS_FILE_ROOM):
        with open(ABS_FILE_ROOM, 'w') as f:
            f.write('{ "$schema": "../../' + ABS_FILE_SCHEMA_ROOM + '" }')
    if not os.path.exists(ABS_FILE_CONFIG):
        with open(ABS_FILE_CONFIG, 'w') as f:
            f.write('{ "$schema": "' + ABS_FILE_SCHEMA_CONFIG + '" }')
