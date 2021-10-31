import { useForm } from 'react-hook-form';

function Texteingabe({onText, socket}) {
    const {register, handleSubmit} = useForm();

    const onSubmit = (data) => {
        console.log(data)
        onText(data.text, true)

        socket.emit('message', data.text, (result) => {
            console.log(result)
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('text', { required: true })} />
            <input type="submit" value="Submit" />
        </form>
    )
}

export default Texteingabe
