# Changelog

## 1.1.0

- First minor update, backend
- Add command line input, when the user types `exit` in the terminal, the server and data collector are shutdown and the program exits
- Wrap data collection in `try...except` blocks so that a faulty `GET` request doesn't hault the data collection
    - Error reports are still shown in the terminal

## 1.0.1

- Fix bug where article would not render properly when no description or content is present

## 1.0.0

- First release