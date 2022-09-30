# pip install -r requirements.txt

import socket
import json
from _thread import *
from mediapipeController import *

client_sockets = [] # 서버에 접속한 클라이언트 목록

def openServer():
    global client_sockets

    # 서버 IP 및 열어줄 포트
    HOST = '127.0.0.1'
    PORT = 1881

    try : 
        startMediaPipe()
    except e:
        print("MediaPipe Start Failed.", e)
        return

    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((HOST, PORT))
        server_socket.listen()
        print("The server was successfully started.")


        print('>> Wait')
        client_socket, addr = server_socket.accept()

        # Connection is estblished
        client_sockets.append(client_socket)
        print("connection Success", len(client_sockets))
        dataCommunication(client_socket, addr)

        # connection is closed.
        closeServer()
            
    except Exception as e :
        print('Exception : ',e)

    finally:
        print('MediaPipe Server Closed.')
        server_socket.close()

def closeServer():
    try:
        global client_sockets
        for server_socket in client_sockets:
            server_socket.close()
        endMediaPipe()
        print("The server was successfully shut down.")
    except:
        pass


# When Connection is estblished.
def dataCommunication(client_socket, addr):
    global client_sockets
    print('>> Connected by :', addr[0], ':', addr[1])

    # Repeat until the client disconnects.
    while True:
        try:

            # Wait for data to be received
            data = client_socket.recv(100000)
            # receive empty data when client is destroyed
            if not data:
                print('>> Disconnected by ' + addr[0], ':', addr[1])
                break

            data = data.decode()
            data = json.loads(data)
            
            # data
            # {
            #   command : "open/close/holistic",(one of the three)
            #   path : "" (only holistic),
            #   result : "array"
            # }
            #

            if data["command"] == "open" : 
                client_socket.send("MediaPipe Server(v0.1) is started successfully".encode('ascii'))
            elif data["command"] == "close":
                closeServer()
                break
            elif data["command"] == "holistic":
                result = predict(data["path"])
                client_socket.send(result.encode('ascii'))
            else : 
                client_socket.send("invalid request.".encode('ascii'))

        except ConnectionResetError as e:
            print('>> Disconnected by ' + addr[0], ':', addr[1])
            break

        except Exception as e :
            print('>> Exception : ', e)
            client_socket.send(str(e).encode('ascii'))

    if client_socket in client_sockets :
        client_sockets.remove(client_socket)
        print('remove client list : ',len(client_sockets))

    client_socket.close()

openServer()