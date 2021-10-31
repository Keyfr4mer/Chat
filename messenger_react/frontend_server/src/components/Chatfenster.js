import Texteingabe from "./Texteingabe";
import Nachrichtenfenster from "./Nachrichtenfenster";

function Chatfenster({onText, onKeys, texts, socket}) {
    return (
        <div>
            <Texteingabe onText={onText} onKeys={onKeys} socket={socket}/>
            <Nachrichtenfenster texts={texts}/>
        </div>
    )
}

export default Chatfenster
