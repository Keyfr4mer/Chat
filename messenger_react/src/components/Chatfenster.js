import Texteingabe from "./Texteingabe";
import Nachrichtenfenster from "./Nachrichtenfenster";

function Chatfenster({onText, texts}) {
    return (
        <div>
            <Texteingabe onText={onText}/>
            <Nachrichtenfenster texts={texts}/>
        </div>
    )
}

export default Chatfenster
