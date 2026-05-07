from typing import Iterator

import soundfile as sf
import numpy as np
from io import BytesIO
from .crypto_marker import add_marker, remove_marker

import struct

def split_wav(wav_bytes: bytes) -> tuple[bytes, bytes]:
    """
    Разделяет WAV-файл на заголовок (всё до блока data)
    и сами аудиоданные (содержимое блока data).
    """
    i = 12  # пропускаем 'RIFF' (4) + размер (4) + 'WAVE' (4)
    while i < len(wav_bytes) - 8:
        chunk_id = wav_bytes[i:i+4]
        chunk_size = struct.unpack_from('<I', wav_bytes, i + 4)[0]
        if chunk_id == b'data':
            header = wav_bytes[:i + 8]       # всё включая 'data' + размер
            audio_data = wav_bytes[i + 8: i + 8 + chunk_size]
            return header, audio_data
        i += 8 + chunk_size
    raise ValueError("WAV: блок 'data' не найден")


def build_wav(header: bytes, audio_data: bytes) -> bytes:
    """
    Собирает WAV обратно, обновляя размеры в заголовке.
    """
    data_size = len(audio_data)
    riff_size = len(header) - 8 + data_size  # минус 'RIFF' и размер самого поля

    result = bytearray(header + audio_data)
    # Обновляем поле размера RIFF (байты 4–7)
    struct.pack_into('<I', result, 4, riff_size)
    # Обновляем размер блока data (последние 4 байта заголовка)
    struct.pack_into('<I', result, len(header) - 4, data_size)
    return bytes(result)
# Загружаем файл

def xor_elements(raw,cipher_sequence):
    result = (np.frombuffer(raw, dtype=np.uint8) ^ np.frombuffer(cipher_sequence, dtype=np.uint8)).tobytes()
    #result = bytes(raw[i] ^ cipher_sequence[i] for i in range(len(raw)))
    return result

def encrypt_auido(original_file, gen):
    buf = BytesIO(original_file)
    data, sr = sf.read(buf, dtype="int16", always_2d=True)
    buf_wav = BytesIO()
    sf.write(buf_wav, data, sr, format="WAV", subtype="PCM_16")
    wav_bytes = buf_wav.getvalue()
    header, audio_data = split_wav(wav_bytes)
    #raw = data.view(np.uint8).tobytes()
    general_number_element = len(audio_data)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    encrypted_audio_data = xor_elements(audio_data, generated_sequence_string)
    encrypted_wav = build_wav(header, encrypted_audio_data)
    return add_marker(encrypted_wav, "")
    

def decrypt_auido(original_file, gen):
    clean_data, meta = remove_marker(original_file)
    header, encrypted_data = split_wav(clean_data)
    general_number_element = len(encrypted_data)
    generated_sequence = gen.get_sequence(general_number_element)
    generated_sequence_string = b"".join(generated_sequence)
    decrypted_audio_data = xor_elements(encrypted_data, generated_sequence_string)
    return build_wav(header, decrypted_audio_data)









    """clean_data, meta = remove_marker(original_file)
    buf = BytesIO(clean_data)
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
    """
"""
import numpy as np
from io import BytesIO
FRAME_CHUNK = 8192  # фреймов за раз
def encrypt_audio_stream(input_buf: BytesIO, gen) -> Iterator[bytes]:
    with sf.SoundFile(input_buf, mode='r') as f:
        sr = f.samplerate
        channels = f.channels
        
        # Предварительно создаём WAV-заголовок
        # ... (записать заголовок)
        
        while True:
            frames = f.read(FRAME_CHUNK, dtype='int16')
            if len(frames) == 0:
                break
            raw = frames.view(np.uint8).tobytes()
            seq = gen.get_sequence(len(raw))
            key = b"".join(seq)
            encrypted = (
                np.frombuffer(raw, dtype=np.uint8)
                ^ np.frombuffer(key, dtype=np.uint8)
            ).tobytes()
            yield encrypted  # или писать в SoundFile
def decrypt_audio_stream(input_buf: BytesIO, gen) -> Iterator[bytes]:
    with sf.SoundFile(input_buf, mode='r') as f:
        sr = f.samplerate
        channels = f.channels

        # Предварительно создаём WAV-заголовок
        # ... (записать заголовок)

        while True:
            frames = f.read(FRAME_CHUNK, dtype='int16')
            if len(frames) == 0:
                break
            raw = frames.view(np.uint8).tobytes()
            seq = gen.get_sequence(len(raw))
            key = b"".join(seq)
            encrypted = (
                    np.frombuffer(raw, dtype=np.uint8)
                    ^ np.frombuffer(key, dtype=np.uint8)
            ).tobytes()
            yield encrypted  # или писать в SoundFile
"""