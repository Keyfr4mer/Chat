import Texteingabe from "./Texteingabe";
import Nachrichtenfenster from "./Nachrichtenfenster";

function Chatfenster({onText, texts, socket}) {
    return (
        <div>
            <Texteingabe onText={onText} socket={socket}/>
            <Nachrichtenfenster texts={texts}/>
        </div>
    )
}

export default Chatfenster
