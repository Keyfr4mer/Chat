import logo from './logo.svg';
import './App.css';
import {Encryption_Functions} from "./encryption_functions.js";
import { useState, useEffect } from 'react'


function App() {
  const [keys, setKeys] = useState([]);

  const pgpstuff = new Encryption_Functions();
  
  useEffect(() => {
    async function fetchData() {
      setKeys(await pgpstuff.make_key_pair());
    }
    fetchData();
  }, []);

  console.log('Deine Mudder frisst gerne die Scheisse aus dem After der Kuh heraus mmmmmmh lecker')
  console.log(keys[0]);
  console.log(keys[1]);

  return (
    <div className="App">
      <h1>Dei Mudda</h1>
      <h2>{keys[0]}</h2>
      <h2>{keys[1]}</h2>
      <h1>The name is Shlock and the address is 221222b221 street!</h1>
    </div>
  );
}

export default App;
