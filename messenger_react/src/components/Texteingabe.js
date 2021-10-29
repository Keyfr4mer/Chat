import { useForm } from 'react-hook-form';

function Texteingabe({onText}) {
    const {register, handleSubmit} = useForm();

    const onSubmit = (data) => {
        console.log(data)
        onText(data.text, true)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('text', { required: true })} />
            <input type="submit" value="Submit" />
        </form>
    )
}

export default Texteingabe
