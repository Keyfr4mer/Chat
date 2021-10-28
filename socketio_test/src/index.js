import {Encryption_Functions} from "./encryption_functions.js";

const pgp = new Encryption_Functions();
let isFirstSent = true;
let isFirstReceived = true;
const own_username = window.location.hash.substring(1);

let next_public_key;
let privateKey;
let publicKey;


const sio = io({
    transportOptions: {
        polling: {
            extraHeaders: {
                'X-Username': window.location.hash.substring(1)
            }
        }
    }
});

sio.on('connect', () => {
    console.log('connected');
    sio.emit('sum', {numbers: [1, 2]}, (result) => {
        console.log(result)
    });
});

sio.on('connect_error', (e) => {
    console.log((e.message));
});

sio.on('disconnect', () => {
    console.log('disconnected');
});

sio.on('mult', (data, cb) => {
    const result = data.numbers[0] * data.numbers[1];
    cb(result);
});

sio.on('client_count', (count) => {
    console.log('There are ' + count + ' connected clients.')
})

sio.on('room_count', (count) => {
    console.log('There are ' + count + ' clients in my room.')
});

sio.on('user_joined', (username) => {
    console.log('User ' + username + ' has joined.')
});

sio.on('user_left', (username) => {
    console.log('User ' + username + ' has left.')
});

var messages = document.getElementById('messages');
var message_form = document.getElementById("message-form");
var message = document.getElementById("message");
message_form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if (message.value && isFirstSent) {
        ({privateKey, publicKey} = await pgp.make_key_pair());
        sio.emit('message', publicKey + message.value);
        isFirstSent = false;
    }
    else if (message.value && !isFirstSent) {
        ({privateKey, publicKey} = await pgp.make_key_pair());
        const encrypted = await pgp.encrypt_message(privateKey, next_public_key, publicKey + message.value)
        sio.emit('message', encrypted);
        console.log(encrypted);
    }

    var item = document.createElement('li');
    item.textContent =  own_username + " > " + message.value;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight)
    message.value = "";
});

sio.on('message', async function(msg) {
    var username = Object.keys(msg)[0];
    var item = document.createElement('li');
    
    if (isFirstReceived){
        next_public_key = msg[username].slice(0, 627);
        item.textContent =  username + " > " + msg[username].slice(627);
        isFirstReceived = false;
    }
    else{
        const decrypted = await pgp.decrypt_message(privateKey, publicKey, msg[username]);
        console.log(decrypted);
        next_public_key = decrypted.slice(0, 627);
        item.textContent = username + " > " + decrypted.slice(627);
    }
    
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });