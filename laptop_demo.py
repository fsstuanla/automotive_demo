#!/usr/bin/python
import json
import os

import websocket
import socket
import sys, getopt
import ssl
import threading
# WebSocket server library
from simple_websocket_server import WebSocketServer, WebSocket

class SocketListen(threading.Thread):
    def __init__(self, name, ws, socket):
        threading.Thread.__init__(self)
        self.name = name
        self.ws = ws
        self.socket = socket

    def run(self):
        print ("Starting receive packets" + self.name)
        # print_time(self.name, 1)
        BUFFER_SIZE = 65535
        #
        while 1:
            data = self.socket.recv(BUFFER_SIZE)
            if not data: break
            # print ('s<', data, self.socket.getpeername())
            if not ("- connected" in data.decode('utf-8') or "- disconnected" in data.decode('utf-8')):
                ws_message_string = self.get_ws_message_to_send(data, "message")
            else:
                ws_message_string = self.get_ws_message_to_send(data, "log")
            print (ws_message_string)
            self.ws.send(ws_message_string.encode('utf-8'))
            print ('ws>', ws_message_string)
        print ("Exiting " + self.name)

    def get_ws_message_to_send(self, data, type):
        ws_message = {"info": self.socket.getpeername(), "type": type, "data": data.decode('utf-8')}
        ws_message_string = json.dumps(ws_message)
        return ws_message_string


class WebSocketListen(threading.Thread):
    def __init__(self, name, ws, socket):
        threading.Thread.__init__(self)
        self.name = name
        self.ws = ws
        self.socket = socket

    def run(self):
        print ("Starting receive packets" + self.name)
        while 1:
            msg = self.ws.recv()
            print('ws_client recv: ' , msg)

            self.socket.send(msg.encode())
            print('socket send: ' + msg)
        print ("Exiting " + self.name)


class ClientThread(threading.Thread):

    def __init__(self, socket, websocketsurl, proxyaddr, proxyport):
        threading.Thread.__init__(self)
        # self.ip = ip
        # self.port = port
        self.socket = socket
        self.websocketsurl = websocketsurl
        self.proxyaddr = proxyaddr
        self.proxyport = proxyport

    def run(self):
        ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})
        ws.connect(self.websocketsurl)
        thread1 = SocketListen("[Socket]", ws, self.socket)
        thread2 = WebSocketListen("[WebSocket]", ws, self.socket)

        # Start new Threads
        thread1.start()
        thread2.start()
        print ("\nCompleted setup system, start to check the tunnel!\n")


def start_websocket_server(listenaddr, listenport):
    proxyaddr = None
    proxyport = 8001
    websocketsurl = 'ws://localhost:8001'
    ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})

    # s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    # s.bind((listenaddr, int(listenport)))
    clientsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    clientsock.connect((listenaddr, int(listenport)))
    print ('2 - socket client connected')
    newthread = ClientThread(clientsock, websocketsurl, proxyaddr, proxyport)
    newthread.start()
    threads = []
    # while True:
    #     s.listen(4)
    #     (clientsock, (ip, port)) = s.accept()
    #     newthread = ClientThread(ip, port, clientsock, websocketsurl, proxyaddr, proxyport)
    #     newthread.start()
    #     threads.append(newthread)
    for t in threads:
        t.join()





class ServerHandler(WebSocket):
    def get_ws_message_to_send(self, data, type):
        ws_message = {"info": "system", "type": type, "data": data.decode('utf-8')}
        ws_message_string = json.dumps(ws_message)
        return ws_message_string

    def handle(self):
        print ('[ws_server]<<<', self.data)
        isConfig = True
        try:
            json_message = json.loads(self.data)
            type = json_message['type']
            data = json_message['data']
        except Exception as ex:
            print (ex.__str__())
            isConfig = False
        # Start websocket server
        if (isConfig and type == 'config'):
            # thread.start_new_thread(start_websocket_server, (data['ip'], data['port']))
            thread = threading.Thread(target=start_websocket_server, args=(data['ip'], data['port']))
            thread.start()
        # Never happen in socket client mode
        else:
            for client in clients:
                if client != self:
                    client.send_message(self.data)
                    print ('[ws_server broadcast]>>>', self.address[0] + u' - ' + self.data)

    def connected(self):
        print(self.address, 'connected')
        for client in clients:
            client.send_message(self.address[0] + u' - connected')
        clients.append(self)

    def handle_close(self):
        clients.remove(self)
        print(self.address, 'ServerHandler closed')
        for client in clients:
            client.send_message(self.address[0] + u' - disconnected')


clients = []


def ws_listen():
    server = WebSocketServer('', 8001, ServerHandler)
    print ("Websocket server is waiting for setup environment")
    print ("1 - Open web browse to activate!")
    server.serve_forever()


def main(argv):
    ws_server_thread = threading.Thread(target=ws_listen, args=())
    ws_server_thread.start()


if __name__ == "__main__":
    print("(setup) -   Browse to http://localhost:8889/webdemo/laptop.html and click on 'Listen' button to start socket server")

    main(sys.argv[1:])
    os.system("python -m http.server 8889")
