import os


DIR_CLIENT = 'client'
DIR_SERVER = 'server'
DIR_DATA = 'data'
FILE_SCHEMA = 'schema.json'
FILE_CONFIG = 'config.json'
FILE_ROOM = 'room.json'
FILE_LOCAL = 'news-local.json'
FILE_NATIONAL = 'news-national.json'
FILE_WEATHER = 'weather.json'
FILE_CUSTOM = 'custom.json'


ABS_FILE_SCHEMA = os.path.join(DIR_SERVER, FILE_SCHEMA)
ABS_DIR_DATA = os.path.join(DIR_SERVER, DIR_DATA)
ABS_FILE_CONFIG = os.path.join(FILE_CONFIG)
ABS_FILE_ROOM = os.path.join(ABS_DIR_DATA, FILE_ROOM)
ABS_FILE_LOCAL = os.path.join(ABS_DIR_DATA, FILE_LOCAL)
ABS_FILE_NATIONAL = os.path.join(ABS_DIR_DATA, FILE_NATIONAL)
ABS_FILE_WEATHER = os.path.join(ABS_DIR_DATA, FILE_WEATHER)
ABS_FILE_CUSTOM = os.path.join(ABS_DIR_DATA, FILE_CUSTOM)


def makeFiles():
    os.makedirs(ABS_DIR_DATA, exist_ok=True)
    if not os.path.exists(ABS_FILE_ROOM):
        with open(ABS_FILE_ROOM, 'w') as f:
            f.write('{ }')
    if not os.path.exists(ABS_FILE_CUSTOM):
        with open(ABS_FILE_CUSTOM, 'w') as f:
            f.write('{ }')
    if not os.path.exists(ABS_FILE_CONFIG):
        with open(ABS_FILE_CONFIG, 'w') as f:
            f.write('{ "$schema": "' + ABS_FILE_SCHEMA + '" }')
