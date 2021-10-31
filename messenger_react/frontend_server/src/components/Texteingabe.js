import { useForm } from 'react-hook-form';
import { Encryption_Functions } from '../encryption_functions';
import { useState, useEffect } from 'react';

function Texteingabe({onText, onKeys, socket}) {
    const {register, handleSubmit} = useForm();

    const pgpstuff = new Encryption_Functions();

    const onSubmit = async (data) => {
        console.log(data)
        onText(data.text, true)

        const keys = await pgpstuff.make_key_pair();
        onKeys(keys)

        const encrypted = await pgpstuff.encrypt_message(keys[0], keys[1], data.text)

        socket.emit('message', encrypted, (result) => {
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
