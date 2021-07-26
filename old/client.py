import socket
import errno
import sys
from old import pgp

HEADER_LENGTH = 10

#ip = input("IP: ")
#port = int(input("Port: "))
ip = "127.0.0.1"
port = 8080

my_username = input("Username: ")
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((ip, port))
client_socket.setblocking(False)


username = my_username.encode('utf-8')
username_header = f"{len(username):<{HEADER_LENGTH}}".encode('utf-8')
client_socket.send(username_header + username)

first_loop = True
public_key = ""
message_pgp = None
while True:
    message = input(f"{my_username} > ")
    if message:
        if not first_loop:
            new_private_key, new_public_key = pgp.make_new_key_pair()
            message_pgp = pgp.PGP(new_private_key, new_public_key)

        if public_key != "":
            message = message_pgp.encrypt_message(public_key, message)
            message += new_public_key
            message_key = message.encode('utf-8')
            message_header = f"{len(message):<{HEADER_LENGTH}}".encode('utf-8')
            client_socket.send(message_header + message_key)

        else:
            new_private_key, new_public_key = pgp.make_new_key_pair()
            message += new_public_key
            message_key = message.encode('utf-8')
            message_header = f"{len(message):<{HEADER_LENGTH}}".encode('utf-8')
            client_socket.send(message_header + message_key)
    try:
        while True:
            # receive things
            username_header = client_socket.recv(HEADER_LENGTH)
            if not len(username_header):
                print("connection closed by the server")
                sys.exit()

            username_length = int(username_header.decode('utf-8').strip())
            username = client_socket.recv(username_length).decode('utf-8')

            message_header = client_socket.recv(HEADER_LENGTH)
            message_length = int(message_header.decode('utf-8').strip())
            message_key = client_socket.recv(message_length)

            public_key = message_key[-1599:].decode('utf-8')
            message = message_key[:-1599].decode('utf-8')
            if message_pgp is not None:
                message = message_pgp.decrypt_message(str(message))

            print(f"{username} > {message}")

            first_loop = False

    except IOError as e:
        if e.errno != errno.EAGAIN and e.errno != errno.EWOULDBLOCK:
            print('Reading error', str(e))
            sys.exit()
        continue

    except Exception as e:
        print('General error', str(e))
        sys.exit()

