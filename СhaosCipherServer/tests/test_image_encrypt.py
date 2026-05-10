"""
Рівень 3B — Тести шифрування зображень (encrypt_alg/image_encrypt_server.py).
"""
import pytest
import numpy as np
from io import BytesIO
import PIL.Image as Image
from generators import ChaosFactory
from encrypt_alg.image_encrypt_server import (
    encrypt_image, decrypt_image,
    scrambling, scrambling_decryp,
    diffusion, diffusion_decrypt,
    make_header, parse_header,
    embed_header_rgb_in_padding, extract_header,
    rank, get_FSM, log_integer_exponent,
    get_number_iterations_and_size_by_power,
    add_element_to_pixels_matrix, remove_additional_elements_from_matrix,
)
from conftest import LORENZ_PARAMS

FACTORY = ChaosFactory()


def _make_gen(mode="chars"):
    return FACTORY.create_generator("lorenz", LORENZ_PARAMS, mode)


class TestImageRoundtrip:

    def test_roundtrip_3x5(self, test_image_bytes):
        """Шифрування - дешифрування 3×5 PNG зображення."""
        gen_enc = _make_gen()
        gen_dec = _make_gen()
        encrypted = encrypt_image(test_image_bytes, gen_enc)
        decrypted = decrypt_image(encrypted, gen_dec)
        # Порівнюємо пікселі
        orig = np.array(Image.open(BytesIO(test_image_bytes)).convert("RGB"))
        rest = np.array(Image.open(BytesIO(decrypted)).convert("RGB"))
        np.testing.assert_array_equal(orig, rest)

    def test_encrypted_differs_from_original(self, test_image_bytes):
        encrypted = encrypt_image(test_image_bytes, _make_gen())
        assert encrypted != test_image_bytes

    def test_invalid_data_enc(self):
        with pytest.raises((ValueError, Exception)):
            decrypt_image(None, _make_gen())
    def test_invalid_data_dec(self):
        with pytest.raises((ValueError, Exception)):
            decrypt_image(test_image_bytes, _make_gen())

"""
class TestHeader:

    @pytest.mark.parametrize("M, N", [(3, 5), (100, 200), (1, 1), (1024, 768)])
    def test_make_parse_header(self, M, N):
        hdr = make_header(M, N)
        result = parse_header(hdr)
        assert result == (M, N)

    def test_corrupted_header_returns_none(self):
        hdr = bytearray(make_header(10, 20))
        hdr[5] ^= 0xFF  # псуємо один байт
        assert parse_header(bytes(hdr)) is None

    def test_wrong_magic_returns_none(self):
        assert parse_header(b"\x00" * 16) is None

    def test_embed_extract_header(self):
        pixels = np.random.randint(0, 256, (4, 4, 3), dtype=np.uint8)
        embedded = embed_header_rgb_in_padding(pixels.copy(), 3, 5)
        result = extract_header(embedded)
        assert result == (3, 5)

class TestScrambling:

    def test_scrambling_descrambling_roundtrip(self):
        side = 4
        base_matrix = np.array([[4, 3], [2, 1]], dtype=np.float64)
        pixels = np.random.randint(0, 256, (side, side, 3), dtype=np.uint8)
        C1 = np.random.rand(side * side).tolist()
        iterations = 1
        scrambled = scrambling(C1, side, iterations, pixels, base_matrix)
        restored = scrambling_decryp(C1, side, iterations, scrambled, base_matrix)
        np.testing.assert_array_equal(pixels, restored)


class TestDiffusion:

    def test_diffusion_roundtrip(self):
        side = 4
        size = side * side * 3
        pixels = np.random.randint(0, 256, (side, side, 3), dtype=np.uint8)
        C2 = np.random.rand(size).tolist()
        C3 = np.random.rand(size).tolist()
        diffused = diffusion(C2, C3, pixels)
        restored = diffusion_decrypt(C2, C3, diffused)
        np.testing.assert_array_equal(pixels, restored)


class TestHelpers:

    def test_rank_permutation(self):
        matrix = np.array([[4, 3], [2, 1]], dtype=np.float64)
        r = rank(matrix)
        values = sorted(r.ravel().tolist())
        assert values == [1, 2, 3, 4]

    @pytest.mark.parametrize("N, m, expected", [
        (16, 2, 4), (8, 2, 3), (27, 3, 3), (1, 2, 0),
    ])
    def test_log_integer_exponent(self, N, m, expected):
        assert log_integer_exponent(N, m) == expected

    def test_log_integer_exponent_not_power(self):
        assert log_integer_exponent(10, 2) is None

    def test_square_image_padding(self):
        pixels = np.random.randint(0, 256, (3, 5, 3), dtype=np.uint8)
        sq = add_element_to_pixels_matrix(8, 3, 5, pixels)
        assert sq.shape == (8, 8, 3)

    def test_remove_padding(self):
        full = np.random.randint(0, 256, (8, 8, 3), dtype=np.uint8)
        cropped = remove_additional_elements_from_matrix(3, 5, full)
        assert cropped.shape == (3, 5, 3)
"""
