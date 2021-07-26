import pgpy
from pgpy.constants import PubKeyAlgorithm, KeyFlags, HashAlgorithm, SymmetricKeyAlgorithm, CompressionAlgorithm


class PGP:
    def __init__(self, private_key, public_key):
        self.private_key, _ = pgpy.PGPKey.from_blob(private_key)
        self.public_key, _ = pgpy.PGPKey.from_blob(public_key)

    def encrypt_message(self, target_public_key, message):
        pubkey, _ = pgpy.PGPKey.from_blob(target_public_key)
        message = pgpy.PGPMessage.new(message)

        encrypted_message = pubkey.encrypt(message)
        return str(encrypted_message)

    def decrypt_message(self, message):
        message = pgpy.PGPMessage.from_blob(message)
        decrypted_message = self.private_key.decrypt(message)
        message_text = decrypted_message.message
        return str(message_text)

    def make_public_key_message(self):
        public_key_string = str(self.public_key)
        message = pgpy.PGPMessage.new(public_key_string)
        return message


def make_new_key_pair():
    key = pgpy.PGPKey.new(PubKeyAlgorithm.RSAEncryptOrSign, 4096)

    uid = pgpy.PGPUID.new('key')

    key.add_uid(uid, usage={KeyFlags.Sign, KeyFlags.EncryptCommunications, KeyFlags.EncryptStorage},
                hashes=[HashAlgorithm.SHA256, HashAlgorithm.SHA384, HashAlgorithm.SHA512, HashAlgorithm.SHA224],
                ciphers=[SymmetricKeyAlgorithm.AES256, SymmetricKeyAlgorithm.AES192, SymmetricKeyAlgorithm.AES128],
                compression=[CompressionAlgorithm.ZLIB, CompressionAlgorithm.BZ2, CompressionAlgorithm.ZIP,
                             CompressionAlgorithm.Uncompressed])

    new_private_key = str(key)
    new_public_key = str(key.pubkey)

    return new_private_key, new_public_key
