import logo from './logo.svg';
import './App.css';
import {Encryption_Functions} from "./encryption_functions.js";
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Chatfenster from './components/Chatfenster';
import {do_setup, socket} from './sio_client.js';

function App() {
  const [keys, setKeys] = useState([]);

  const pgpstuff = new Encryption_Functions();

  const [texts, setTexts] = useState([]);

  const addText = (text, sent) => {
    const now = new Date().toISOString()
    setTexts(texts.concat({id: texts.length, text: text, date: now, sent: sent}))
  }
  
  useEffect(() => {
    async function fetchData() {
      setKeys(await pgpstuff.make_key_pair());
      console.log('yeet');
      do_setup(); 
    }
    fetchData();
  }, []);

  useEffect(() => {
    socket.on('message', (message) => {
      addText(message, false);
    });
  }, [texts]);

  return (
    <div className="App">
      <Header />
      <Chatfenster onText={addText} texts={texts} socket ={socket}/>
    </div>
  );
}

export default App;
