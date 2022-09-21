# pip install -r requirements.txt

import socket
import sys
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
        print("Server Open Failed.", e)
        return

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen()
    print("The server was successfully started.")
    try:
        while True:
            print('>> Wait')

            client_socket, addr = server_socket.accept()
            client_sockets.append(client_socket)
            start_new_thread(threaded, (client_socket, addr))
            print("참가자 수 : ", len(client_sockets))
            
    except Exception as e :
        print('에러는? : ',e)

    finally:
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


# 쓰레드에서 실행되는 코드입니다.
# 접속한 클라이언트마다 새로운 쓰레드가 생성되어 통신을 하게 됩니다.
def threaded(client_socket, addr):
    global client_sockets
    print('>> Connected by :', addr[0], ':', addr[1])

    # 클라이언트가 접속을 끊을 때 까지 반복합니다.
    while True:
        try:

            # 데이터가 수신될 때 까지 대기
            data = client_socket.recv(10000000)
            # receive empty data when client is destroyed
            if not data:
                print('>> Disconnected by ' + addr[0], ':', addr[1])
                break
            
            if len(data) <= 10 :
                data = data.decode()
                print('>> Received from ' + addr[0], ':', addr[1], data)
                if data == "sendTest":
                    client_socket.send("success".encode('ascii'))
                elif data == "close" :
                    closeServer()
                    break
            else :
                # 클라이언트에게 실행 결과 보내기
                result = predict(data)
                client_socket.send(result.encode('ascii'))

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