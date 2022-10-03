# python 3.9.13
# pip install -r requirements.txt

import socket
import json
from _thread import *
from mediapipe_controller import *

client_sockets = [] # 서버에 접속한 클라이언트 목록

def openServer():
    global client_sockets

    # 서버 IP 및 열어줄 포트
    HOST = '127.0.0.1'
    PORT = 1881

    try : 
        startMediaPipe()
    except Exception as e:
        print('MediaPipe Start Failed.', str(e))
        return

    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((HOST, PORT))
        server_socket.listen()
        print('The server was successfully started.')


        print('>> Wait')
        client_socket, addr = server_socket.accept()

        # Connection is estblished
        client_sockets.append(client_socket)
        print('connection Success', len(client_sockets))
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
        print('The server was successfully shut down.')
    except:
        pass


# When Connection is estblished.
def dataCommunication(client_socket, addr):
    global client_sockets

    if len(client_sockets) > 1:
        client_socket.send("Only one connection is allowed.".encode('ascii'))
        client_sockets.remove(client_socket)
        client_socket.close()
        return

    print('>> Connected by :', addr[0], ':', addr[1])

    # Repeat until the client disconnects.
    while True:
        try:

            # Wait for data to be received
            request = client_socket.recv(100000)
            # receive empty data when client is destroyed
            if not request:
                print('>> Disconnected by ' + addr[0], ':', addr[1])
                break

            request = request.decode()
            request = json.loads(request)
            
            # request
            # {
            #   command : 'open/close/holistic',(one of the three)
            #   path : '' (only holistic),
            #   result : 'array'
            # }

            
            response = {
                'command' : request['command'],
                'result' : ''
            }

            if request['command'] == 'open' :
                response['result'] = 'MediaPipe Server(v0.1) is started successfully'
            elif request['command'] == 'close':
                closeServer()
                break
            elif request['command'] == 'holistic':
                response['result'] = predict(request['path'])
            else : 
                response['result'] = 'invalid request.'

            if request['command'] != 'close':
                client_socket.send(json.dumps(response).encode('ascii'))
            
        except ConnectionResetError as e:
            print('>> Disconnected by ' + addr[0], ':', addr[1])
            break

        except Exception as e :
            print('>> Exception : ', e)
            try:
                client_socket.send(str(e).encode('ascii'))
            except:
                pass

    if client_socket in client_sockets :
        client_sockets.remove(client_socket)
        print('remove client list : ',len(client_sockets))

    client_socket.close()

openServer()