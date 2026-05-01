import soundfile as sf
import numpy as np
from io import BytesIO


# Загружаем файл

def xor_elements(raw,cipher_sequence):
    result = (np.frombuffer(raw, dtype=np.uint8) ^ np.frombuffer(cipher_sequence, dtype=np.uint8)).tobytes()
    #result = bytes(raw[i] ^ cipher_sequence[i] for i in range(len(raw)))
    return result

def encrypt_auido(original_file, gen):
    buf = BytesIO(original_file)
    data, sr = sf.read(buf, dtype="int16", always_2d=True)
    raw = data.view(np.uint8).tobytes()
    general_number_element = len(raw)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    encrypt_audio_bytes = xor_elements(raw, generated_sequence_string)
    encrypted_matrix_audio=np.frombuffer(encrypt_audio_bytes, dtype=np.uint8).view(np.int16).reshape(data.shape)
    buf_result = BytesIO()
    sf.write(buf_result, encrypted_matrix_audio, sr, format="WAV", subtype="PCM_16")
    return buf_result.getvalue()

def decrypt_auido(original_file, gen):
    buf = BytesIO(original_file)
    data, sr = sf.read(buf, dtype="int16", always_2d=True)
    raw = data.view(np.uint8).tobytes()
    general_number_element = len(raw)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    encrypt_audio_bytes = xor_elements(raw, generated_sequence_string)
    encrypted_matrix_audio=np.frombuffer(encrypt_audio_bytes, dtype=np.uint8).view(np.int16).reshape(data.shape)
    buf_result = BytesIO()
    sf.write(buf_result, encrypted_matrix_audio, sr, format="WAV", subtype="PCM_16")
    return buf_result.getvalue()