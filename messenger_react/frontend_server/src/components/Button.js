const Button = ({color, textcolor, text}) => {
    const onClick = () => {
        console.log('click')
    }

    return <button onClick={onClick} style={{color: textcolor, backgroundColor: color}} className='btn'>{text}</button>
}

export default Button
