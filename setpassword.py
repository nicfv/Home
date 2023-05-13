from sys import argv

if len(argv) == 2:
    with open('server/password.txt', 'w') as f:
        f.write(argv[1])
    print('Password reset successful!')
else:
    print('Unsuccessful. Usage: python ' + argv[0] + ' [password]')
