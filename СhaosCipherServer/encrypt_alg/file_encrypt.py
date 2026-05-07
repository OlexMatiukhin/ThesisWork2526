from io import BytesIO
from typing import Iterator
from .crypto_marker import add_marker, remove_marker
import numpy as np


def xor_elements(raw,cipher_sequence,):
    #result = bytes(raw[i] ^ chipher_sequence[i] for i in range(len(raw)))
    result = (np.frombuffer(raw, dtype=np.uint8) ^ np.frombuffer(cipher_sequence, dtype=np.uint8)).tobytes()
    return result
def encrypt_file(original_file, gen, filename: str = ""):
    general_number_element = len(original_file)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    encrypted_file = xor_elements(original_file, generated_sequence_string)
    encrypted_file_with_marker=add_marker(encrypted_file, filename)
    return encrypted_file_with_marker

def decrypt_file(original_file, gen):
    clean_data, meta = remove_marker(original_file)
    if meta is None:
        raise ValueError("Файл не містить маркера шифрування CHAOSENC")
    general_number_element = len(clean_data)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    decrypted_file = xor_elements(clean_data, generated_sequence_string)
    return decrypted_file

"""
CHUNK_SIZE = 64 * 1024
def encrypt_file_stream(data_stream: Iterator[bytes], gen) -> Iterator[bytes]:
    for chunk in data_stream:
        seq = gen.get_sequence(len(chunk))
        key = b"".join(seq)
        encrypted = (
            np.frombuffer(chunk, dtype=np.uint8)
            ^ np.frombuffer(key, dtype=np.uint8)
        ).tobytes()
        yield encrypted
def decrypt_file_stream(data_stream: Iterator[bytes], gen) -> Iterator[bytes]:
    for chunk in data_stream:
        seq = gen.get_sequence(len(chunk))
        key = b"".join(seq)
        encrypted = (
            np.frombuffer(chunk, dtype=np.uint8)
            ^ np.frombuffer(key, dtype=np.uint8)
        ).tobytes()
        yield encrypted
"""
