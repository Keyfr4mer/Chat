import Nachricht from './Nachricht'

function Nachrichtenfenster({ texts }) {
    return (
        <div>
            {texts.map((text) => (<Nachricht text={text}/>))}
        </div>
    )
}

export default Nachrichtenfenster
