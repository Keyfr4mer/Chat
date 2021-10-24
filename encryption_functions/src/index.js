import * as openpgp from 'openpgp';


async function make_key_pair () {
    const {privateKey, publicKey, revocationCertificate} = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        //passphrase: 'super long and hard to guess secret', // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    return {privateKey, publicKey};
};


async function encrypt_message (privKey, pubKey) {
    const publicKey = await openpgp.readKey({ armoredKey: pubKey });
    console.log(publicKey);

    const privateKey = await openpgp.readPrivateKey({ armoredKey: privKey });
    console.log(privateKey);

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: 'Hello, World!' }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });
    return encrypted;
};

async function decrypt_message (privKey, pubKey, encrypted) {
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


async function main () {
    const {privateKey, publicKey} = await make_key_pair();
    console.log(privateKey);
    console.log(publicKey);

    const encrypted = await encrypt_message(privateKey, publicKey);
    console.log(encrypted);

    const x = await decrypt_message(privateKey, publicKey, encrypted);
    console.log(x);

};

main();
  