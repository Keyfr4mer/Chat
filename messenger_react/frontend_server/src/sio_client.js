
import { io } from "socket.io-client";


export const socket = io("http://127.0.0.1:8000", {
    transports: ['websocket', 'polling', 'flashsocket'],
    transportOptions: {
        polling: {
            extraHeaders: {
                'X-Username': window.location.hash.substring(1)
            }
        }
    }
});

export function do_setup(){
    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('connect_error', (e) => {
        console.log((e.message));
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    socket.on('client_count', (count) => {
        console.log('There are ' + count + ' connected clients.')
    })

    socket.on('room_count', (count) => {
        console.log('There are ' + count + ' clients in my room.')
    });

    socket.on('user_joined', (username) => {
        console.log('User ' + username + ' has joined.')
    });

    socket.on('user_left', (username) => {
        console.log('User ' + username + ' has left.')
    });

    socket.on('message', (message) => {
        console.log('Message: ' + message)
    });
}