import ast
import base64
import math

"""import numpy as np
text = "How tried to eat an elephant?"
data = text.encode("utf-8")
lst = [b"\x01", b"\x02", b"\x03", b"\x04", b"\x05", b"\x06"]
bytes1 = b"".join(lst)
print(bytes)
cipher = bytes(data[i] ^ bytes1[i] for i in range(len(data)))
print(cipher)
text = cipher.decode("utf-8")
print(text)
text2 = text.encode("utf-8")
decipher = bytes(text2[i] ^ bytes1[i] for i in range(len(data)))
print(decipher)
text3 = decipher.decode("utf-8")
print(text3)
"""

def linear_range_transition(value, maximum):
    return maximum*value
def encrypt_text_bytes(content, gen):
    initial_data = content.encode("utf-8")
    generating_sequence_length = len(initial_data)
    generated_sequence = gen.get_sequence(generating_sequence_length)
    generated_sequence_string = b"".join(generated_sequence)
    ciphered_bits = bytes(initial_data[i] ^ generated_sequence_string[i] for i in range(len(initial_data)))
    ciphered_text = f"{ciphered_bits}"
    return ciphered_text
def decrypt_text_bytes(content, gen):
    initial_data = ast.literal_eval(content)
    generating_sequence_length = len(initial_data)
    generated_sequence = gen.get_sequence(generating_sequence_length)
    generated_sequence_string = b"".join(generated_sequence)
    decrypt_text_bytes = bytes(initial_data[i] ^ generated_sequence_string[i] for i in range(len(initial_data)))
    decrypt_text = decrypt_text_bytes.decode("utf-8")
    return decrypt_text
def fract (x):
    return abs(x) %1
def normalize(x, N):
    return int(N * (fract(x)))
def normalize_odd(x, N):
    v= normalize(x, N)
    while math.gcd(v, N) != 1:
        v = (v + 2) % N
        if v == 0:
            v = 1
    return v
def bytes_per_value(N: int) -> int:
    return ((N - 1).bit_length() + 7) // 8
def transform_ch(ch:str, gen1, gen2, N):
    code = ((gen1*ord(ch)) + gen2) % N
    return code
def transform_ch_back(encrypted_code, gen1, gen2, N):
    gen1_ch = ( encrypted_code - gen2) % N
    invert_gen1=  pow(gen1, -1, N)
    decrypted_code = (gen1_ch * invert_gen1) % N
    return decrypted_code
def encrypt_text_chars(content, gen):
    N = 0x110000
    B = bytes_per_value(N)
    result = bytearray()
    generated_sequence = gen.get_sequence(length=2*len(content))
    #N = 1114112
    generated_sequence_norm=[]
    for i in range(0,len(generated_sequence), 2):
        normalized_a_i = normalize_odd(generated_sequence[i], N)
        normalized_b_i=normalize(generated_sequence[i+1], N)
        generated_sequence_norm.append(normalized_a_i)
        generated_sequence_norm.append(normalized_b_i)

    for i in range(len(content)):
        generated_index = i + i
        generated_a= generated_sequence_norm[generated_index]
        generated_b=generated_sequence_norm[generated_index+1]
        result_i= transform_ch(content[i],generated_a,generated_b, N)
        result += result_i.to_bytes(B, "big")
    return base64.b64encode(result).decode("ascii")
def decrypt_text_chars(cipher_b64: str, gen):
    try:
        N = 0x110000
        B = bytes_per_value(N)
        raw = base64.b64decode(cipher_b64)
        n = len(raw) //B
        result = ""
        generated_sequence = gen.get_sequence(length=2*n)
        #N = 1114112
        generated_sequence_norm=[]
        for i in range(0, len(generated_sequence), 2):
            normalazied_a_i = normalize_odd(generated_sequence[i], N)
            normalazied_b_i = normalize(generated_sequence[i + 1], N)
            generated_sequence_norm.append(normalazied_a_i)
            generated_sequence_norm.append(normalazied_b_i)

        for i in range(n):
            gererated_index = i + i
            generated_a= generated_sequence_norm[gererated_index]
            generated_b=generated_sequence_norm[gererated_index+1]
            elment_i= int.from_bytes(raw[B*i: B*i+B], "big")
            result_i = transform_ch_back(elment_i, generated_a, generated_b, N)
            result += chr(int(result_i))
        return result
    except Exception as e:
        raise RuntimeError(f"Помилка дешуфрування тексту. Неправильно введені параметри або формат даних.: {e}") from e
def encrypt_text(content, gen, mode):
    if len(content) == 0:
        raise ValueError("Помилка шифрування! В шифратор тексту передано пустий рядок!")
    if mode == "bits":
        return encrypt_text_bytes(content, gen)
    else:
        enrypted_text = encrypt_text_chars(content, gen)
        return enrypted_text
def decrypt_text(content, gen, mode):
    if len(content) == 0:
        raise ValueError("Помилка дешифрування! В дешифратор тексту передано пустий рядок!")
    if mode == "bits":
        return decrypt_text_bytes(content, gen)
    else:
        decrypted_text = decrypt_text_chars(content, gen)
        return decrypted_text
