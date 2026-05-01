from io import BytesIO
import numpy as np
def xor_elements(raw,cipher_sequence,):
    #result = bytes(raw[i] ^ chipher_sequence[i] for i in range(len(raw)))
    result = (np.frombuffer(raw, dtype=np.uint8) ^ np.frombuffer(cipher_sequence, dtype=np.uint8)).tobytes()
    return result
def encrypt_file(original_file, gen):
    general_number_element = len(original_file)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    encrypt_file = xor_elements(original_file, generated_sequence_string)
    return encrypt_file

def decrypt_file(original_file, gen):
    general_number_element = len(original_file)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    encrypt_file = xor_elements(original_file, generated_sequence_string)
    return encrypt_file

