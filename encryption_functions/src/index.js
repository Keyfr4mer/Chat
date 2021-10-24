import * as openpgp from 'openpgp';

class Encryption_Functions {

    async make_key_pair () {
        const {privateKey, publicKey, revocationCertificate} = await openpgp.generateKey({
            type: 'ecc', // Type of the key, defaults to ECC
            curve: 'curve25519', // ECC curve name, defaults to curve25519
            userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
            //passphrase: 'super long and hard to guess secret', // protects the private key
            format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
        });
    
        return {privateKey, publicKey};
    };


    async encrypt_message (privKey, pubKey, text) {
        const publicKey = await openpgp.readKey({ armoredKey: pubKey });
    
        const privateKey = await openpgp.readPrivateKey({ armoredKey: privKey });
    
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: text }), // input as Message object
            encryptionKeys: publicKey,
            signingKeys: privateKey // optional
        });
        return encrypted;
    };


    async decrypt_message (privKey, pubKey, encrypted) {
        const publicKey = await openpgp.readKey({ armoredKey: pubKey });
        console.log(publicKey);
    
        const privateKey = await openpgp.readPrivateKey({ armoredKey: privKey });
        console.log(privateKey);
        
        const message = await openpgp.readMessage({
            armoredMessage: encrypted // parse armored message
        });
        const { data: decrypted, signatures } = await openpgp.decrypt({
            message,
            verificationKeys: publicKey, // optional
            decryptionKeys: privateKey
        });
        return decrypted;
    };
}





  