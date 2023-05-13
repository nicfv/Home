from server.setup import ABS_FILE_CONFIG, ABS_FILE_ROOM, ABS_FILE_SCHEMA_CONFIG, ABS_FILE_SCHEMA_ROOM
from jsonschema import validate
import json


def checkJSON() -> bool:
    with open(ABS_FILE_CONFIG) as f:
        config = json.load(f)
    with open(ABS_FILE_SCHEMA_CONFIG) as f:
        configschema = json.load(f)
    with open(ABS_FILE_ROOM) as f:
        room = json.load(f)
    with open(ABS_FILE_SCHEMA_ROOM) as f:
        roomschema = json.load(f)
    try:
        validate(config, configschema)
    except Exception as e:
        print('Error in ' + ABS_FILE_CONFIG + ': ' + e.message)
        return False
    try:
        validate(room, roomschema)
    except Exception as e:
        print('Error in ' + ABS_FILE_ROOM + ': ' + e.message)
        return False
    return True
