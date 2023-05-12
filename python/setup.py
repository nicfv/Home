import os

TARGET_DIR = 'data'
TARGET_FILE = 'room.json'


def makeFiles():
    os.makedirs(TARGET_DIR, exist_ok=True)
    path = os.path.join(TARGET_DIR, TARGET_FILE)
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write('{ "$schema": "../schemas/' + TARGET_FILE + '" }')
