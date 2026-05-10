"""
Рівень 3C — Тести шифрування аудіо (encrypt_alg/audio_encrypt.py).
"""
import struct
import pytest
import numpy as np
from io import BytesIO
from generators import ChaosFactory
from encrypt_alg.audio_encrypt import (
    encrypt_auido, decrypt_auido,
    split_wav, build_wav, xor_elements,
)
from conftest import LORENZ_PARAMS

FACTORY = ChaosFactory()


def _make_gen():
    return FACTORY.create_generator("lorenz", LORENZ_PARAMS, "bits")


class TestAudioRoundtrip:

    def test_roundtrip_wav(self, test_wav_bytes):
        """Шифрування → дешифрування WAV файлу."""
        gen_enc = _make_gen()
        gen_dec = _make_gen()
        encrypted = encrypt_auido(test_wav_bytes, gen_enc)
        decrypted = decrypt_auido(encrypted, gen_dec)
        # Порівнюємо аудіодані (заголовок + дані)
        _, orig_audio = split_wav(test_wav_bytes)
        _, dec_audio = split_wav(decrypted)
        assert orig_audio == dec_audio

    def test_encrypted_differs(self, test_wav_bytes):
        encrypted = encrypt_auido(test_wav_bytes, _make_gen())
        assert encrypted != test_wav_bytes

    def test_invalid_data_enc(self):
        with pytest.raises((ValueError, Exception)):
            decrypt_auido(None, _make_gen())

    def test_invalid_data_dec(self):
        """Порожні дані → помилка."""
        with pytest.raises((ValueError, Exception)):
            decrypt_auido(test_wav_bytes, _make_gen())



"""class TestWavSplitBuild:

    def test_split_and_rebuild(self, test_wav_bytes):
        header, audio_data = split_wav(test_wav_bytes)
        rebuilt = build_wav(header, audio_data)
        assert rebuilt == test_wav_bytes

    def test_split_finds_data_chunk(self, test_wav_bytes):
        header, audio_data = split_wav(test_wav_bytes)
        assert len(header) > 0
        assert len(audio_data) > 0
        # Заголовок закінчується chunk 'data' + size
        assert header[-8:-4] == b'data'

    def test_invalid_wav_raises(self):
        with pytest.raises(ValueError, match="data"):
            split_wav(b"RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00" + b"\x00" * 16)


class TestXorElements:

    def test_xor_identity(self):
        data = b"\x01\x02\x03\x04\x05"
        key = b"\xAA\xBB\xCC\xDD\xEE"
        encrypted = xor_elements(data, key)
        decrypted = xor_elements(encrypted, key)
        assert decrypted == data

    def test_xor_zeros(self):
        data = b"\xFF\x00\xAB"
        key = b"\x00\x00\x00"
        assert xor_elements(data, key) == data"""
