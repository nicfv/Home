from jsonschema import validate
import json


def checkJSON(path: str) -> bool:
    try:
        with open(path) as f:
            content = json.load(f)
        schemaPath = content.get('$schema')
        with open(schemaPath) as f:
            schema = json.load(f)
        validate(content, schema)
    except Exception as e:
        print('Error in ' + path + ': ' + e.message)
        return False
    return True
