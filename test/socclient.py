import socket
import sys

host = sys.argv[1]  # socket.gethostname()
port = int(sys.argv[2])  # The same port as used by the server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((host, port))
print("Connected to {}:{}".format(host, port))
print("Enter messages to send to remote server, type 'stop' to exit.")

while True:
    raw_msg = input()
    if raw_msg == "stop":
        print("Bye!")
        break

    xml_file = "webapp/xml/{}.xml".format(raw_msg)
    with open(xml_file, 'r') as file:
        data = file.read().rstrip()
        d = str.encode(data)
        s.sendall(d)
        data = s.recv(1024)
        print('Received', repr(data))
s.close()
