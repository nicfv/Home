import os

TARGET_DIR = 'data'
TARGET_FILES = ['shop.json', 'todo.json', 'room.json']


def makeFiles():
    os.makedirs(TARGET_DIR, exist_ok=True)
    for file in TARGET_FILES:
        path = os.path.join(TARGET_DIR, file)
        if not os.path.exists(path):
            with open(path, 'w') as f:
                f.write('{ "$schema": "../schemas/' + file + '" }')
