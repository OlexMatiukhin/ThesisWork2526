"""
Бенчмарк швидкодії шифраторів ChaosCipher.

Вимірює час шифрування/дешифрування для:
  - усіх 6 хаотичних систем
  - різних типів даних (текст, зображення, аудіо, файл)
  - різних розмірів вхідних даних

Результати зберігаються в Excel-файл для використання в дипломній роботі.

Запуск:
    cd СhaosCipherServer
    python tests/benchmark_performance.py
"""

import sys
import time
import os
import numpy as np
from pathlib import Path
from io import BytesIO
from dataclasses import dataclass, field
from typing import Callable

# Додаємо кореневу директорію проєкту
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from generators import ChaosFactory
from encrypt_alg.text_encrypt import encrypt_text, decrypt_text
from encrypt_alg.image_encrypt_server import encrypt_image, decrypt_image
from encrypt_alg.audio_encrypt import encrypt_auido, decrypt_auido
from encrypt_alg.file_encrypt import encrypt_file, decrypt_file
import PIL.Image as Image
import soundfile as sf

# ═══════════════════════════════════════════════════════════════════════
#  Конфігурація
# ═══════════════════════════════════════════════════════════════════════

REPEAT = 3  # Кількість повторень для усереднення

SYSTEMS = {
    "Lorenz":   {"logisticXLorenz": 0.3,  "lorenzX": 1.0,  "lorenzY": 1.0,  "lorenzZ": 1.0},
    "Rössler":  {"logisticXRossler": 0.3, "rosslerX": 1.0, "rosslerY": 1.0, "rosslerZ": 1.0},
    "Chua":     {"logisticXChua": 0.3,    "chuaX": 0.1,    "chuaY": 0.0,    "chuaZ": 0.0},
    "Duffing":  {"logisticXDuffing": 0.3, "duffingX": 0.1, "duffingY": 0.0, "duffingT": 0.0},
    "Van der Pol": {"logisticXPol": 0.3,  "polX": 0.1,     "polY": 0.0,     "polT": 0.0},
    "Forced Pendulum": {"logisticXForced": 0.3, "forcedX": 0.1, "forcedY": 0.0, "forcedT": 0.0},
}

SYSTEM_KEYS = {
    "Lorenz": "lorenz", "Rössler": "rossler", "Chua": "chua",
    "Duffing": "duffing", "Van der Pol": "pol", "Forced Pendulum": "forced",
}

FACTORY = ChaosFactory()


# ═══════════════════════════════════════════════════════════════════════
#  Допоміжні функції для генерації тестових даних
# ═══════════════════════════════════════════════════════════════════════

def generate_text(size_chars: int) -> str:
    """Генерує текст заданої довжини."""
    base = "Тестовий текст для бенчмарку шифрування ChaosCipher. "
    return (base * (size_chars // len(base) + 1))[:size_chars]


def generate_image_bytes(width: int, height: int) -> bytes:
    """Генерує випадкове PNG зображення заданого розміру."""
    pixels = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)
    img = Image.fromarray(pixels, "RGB")
    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def generate_wav_bytes(duration_sec: float, sr: int = 44100) -> bytes:
    """Генерує WAV-файл із синусоїдою 440 Hz."""
    samples = int(sr * duration_sec)
    t = np.linspace(0, duration_sec, samples, endpoint=False)
    data = (np.sin(2 * np.pi * 440 * t) * 32767).astype(np.int16)
    buf = BytesIO()
    sf.write(buf, data, sr, format="WAV", subtype="PCM_16")
    return buf.getvalue()


def generate_file_bytes(size_bytes: int) -> bytes:
    """Генерує випадкові байти заданого розміру."""
    return os.urandom(size_bytes)


# ═══════════════════════════════════════════════════════════════════════
#  Клас для результатів
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class BenchmarkResult:
    system: str
    data_type: str
    data_size: str
    encrypt_time_ms: float
    decrypt_time_ms: float
    total_time_ms: float


def measure_time(func: Callable, *args, repeat: int = REPEAT) -> float:
    """Вимірює середній час виконання функції (у мілісекундах)."""
    times = []
    for _ in range(repeat):
        start = time.perf_counter()
        result = func(*args)
        end = time.perf_counter()
        times.append((end - start) * 1000)
    return np.mean(times), result


# ═══════════════════════════════════════════════════════════════════════
#  Бенчмарки
# ═══════════════════════════════════════════════════════════════════════

def benchmark_text(system_name: str, params: dict, text_sizes: list[int]) -> list[BenchmarkResult]:
    """Бенчмарк шифрування тексту (chars режим)."""
    results = []
    sys_key = SYSTEM_KEYS[system_name]

    for size in text_sizes:
        text = generate_text(size)
        gen_enc = FACTORY.create_generator(sys_key, params, "chars")
        enc_time, encrypted = measure_time(encrypt_text, text, gen_enc, "chars")

        gen_dec = FACTORY.create_generator(sys_key, params, "chars")
        dec_time, _ = measure_time(decrypt_text, encrypted, gen_dec, "chars")

        results.append(BenchmarkResult(
            system=system_name, data_type="Текст (chars)",
            data_size=f"{size} символів",
            encrypt_time_ms=round(enc_time, 2),
            decrypt_time_ms=round(dec_time, 2),
            total_time_ms=round(enc_time + dec_time, 2),
        ))
    return results


def benchmark_image(system_name: str, params: dict, image_sizes: list[tuple]) -> list[BenchmarkResult]:
    """Бенчмарк шифрування зображень."""
    results = []
    sys_key = SYSTEM_KEYS[system_name]

    for w, h in image_sizes:
        img_bytes = generate_image_bytes(w, h)
        gen_enc = FACTORY.create_generator(sys_key, params, "chars")
        enc_time, encrypted = measure_time(encrypt_image, img_bytes, gen_enc)

        gen_dec = FACTORY.create_generator(sys_key, params, "chars")
        dec_time, _ = measure_time(decrypt_image, encrypted, gen_dec)

        results.append(BenchmarkResult(
            system=system_name, data_type="Зображення",
            data_size=f"{w}×{h}",
            encrypt_time_ms=round(enc_time, 2),
            decrypt_time_ms=round(dec_time, 2),
            total_time_ms=round(enc_time + dec_time, 2),
        ))
    return results


def benchmark_audio(system_name: str, params: dict, durations: list[float]) -> list[BenchmarkResult]:
    """Бенчмарк шифрування аудіо."""
    results = []
    sys_key = SYSTEM_KEYS[system_name]

    for dur in durations:
        wav_bytes = generate_wav_bytes(dur)
        gen_enc = FACTORY.create_generator(sys_key, params, "bits")
        enc_time, encrypted = measure_time(encrypt_auido, wav_bytes, gen_enc)

        gen_dec = FACTORY.create_generator(sys_key, params, "bits")
        dec_time, _ = measure_time(decrypt_auido, encrypted, gen_dec)

        size_kb = len(wav_bytes) // 1024
        results.append(BenchmarkResult(
            system=system_name, data_type="Аудіо (WAV)",
            data_size=f"{dur}с ({size_kb} КБ)",
            encrypt_time_ms=round(enc_time, 2),
            decrypt_time_ms=round(dec_time, 2),
            total_time_ms=round(enc_time + dec_time, 2),
        ))
    return results


def benchmark_file(system_name: str, params: dict, file_sizes: list[int]) -> list[BenchmarkResult]:
    """Бенчмарк шифрування файлів."""
    results = []
    sys_key = SYSTEM_KEYS[system_name]

    for size in file_sizes:
        file_bytes = generate_file_bytes(size)
        gen_enc = FACTORY.create_generator(sys_key, params, "bits")
        enc_time, encrypted = measure_time(encrypt_file, file_bytes, gen_enc)

        gen_dec = FACTORY.create_generator(sys_key, params, "bits")
        dec_time, _ = measure_time(decrypt_file, encrypted, gen_dec)

        label = f"{size // 1024} КБ" if size >= 1024 else f"{size} Б"
        results.append(BenchmarkResult(
            system=system_name, data_type="Файл (бінарний)",
            data_size=label,
            encrypt_time_ms=round(enc_time, 2),
            decrypt_time_ms=round(dec_time, 2),
            total_time_ms=round(enc_time + dec_time, 2),
        ))
    return results


def benchmark_sequence_generation(length: int = 10000) -> list[dict]:
    """Бенчмарк генерації хаотичних послідовностей (окремо)."""
    results = []
    for name, params in SYSTEMS.items():
        sys_key = SYSTEM_KEYS[name]
        # Float mode
        gen = FACTORY.create_generator(sys_key, params, "chars")
        start = time.perf_counter()
        for _ in range(REPEAT):
            gen_fresh = FACTORY.create_generator(sys_key, params, "chars")
            gen_fresh.get_sequence(length)
        float_time = ((time.perf_counter() - start) / REPEAT) * 1000

        # SHA-256 mode
        start = time.perf_counter()
        for _ in range(REPEAT):
            gen_fresh = FACTORY.create_generator(sys_key, params, "bits")
            gen_fresh.get_sequence(length)
        sha_time = ((time.perf_counter() - start) / REPEAT) * 1000

        results.append({
            "Система": name,
            "Float (мс)": round(float_time, 2),
            "SHA-256 (мс)": round(sha_time, 2),
            "Довжина": length,
        })
    return results


# ═══════════════════════════════════════════════════════════════════════
#  Головна функція
# ═══════════════════════════════════════════════════════════════════════

def print_table(headers: list[str], rows: list[list], title: str = ""):
    """Друкує таблицю в консоль."""
    if title:
        print(f"\n{'='*80}")
        print(f"  {title}")
        print(f"{'='*80}")

    col_widths = [max(len(str(h)), max(len(str(r[i])) for r in rows)) for i, h in enumerate(headers)]
    fmt = " | ".join(f"{{:<{w}}}" for w in col_widths)
    sep = "-+-".join("-" * w for w in col_widths)

    print(fmt.format(*headers))
    print(sep)
    for row in rows:
        print(fmt.format(*[str(c) for c in row]))


def save_to_excel(all_results: list[BenchmarkResult], seq_results: list[dict], filepath: str):
    """Зберігає результати в Excel-файл."""
    try:
        import openpyxl
    except ImportError:
        print("\n⚠ openpyxl не встановлено. Встановіть: pip install openpyxl")
        print("  Результати збережені тільки в консолі.")
        return

    wb = openpyxl.Workbook()

    # Аркуш 1: Шифрування/дешифрування
    ws1 = wb.active
    ws1.title = "Шифрування"
    ws1.append(["Система", "Тип даних", "Розмір", "Шифр. (мс)", "Дешифр. (мс)", "Загалом (мс)"])
    for r in all_results:
        ws1.append([r.system, r.data_type, r.data_size,
                    r.encrypt_time_ms, r.decrypt_time_ms, r.total_time_ms])

    # Аркуш 2: Генерація послідовностей
    ws2 = wb.create_sheet("Генерація послідовностей")
    ws2.append(["Система", "Float (мс)", "SHA-256 (мс)", "Довжина"])
    for r in seq_results:
        ws2.append([r["Система"], r["Float (мс)"], r["SHA-256 (мс)"], r["Довжина"]])

    wb.save(filepath)
    print(f"\n✅ Результати збережено: {filepath}")


def main():
    print("╔══════════════════════════════════════════════════════════╗")
    print("║    Бенчмарк швидкодії шифраторів ChaosCipher           ║")
    print(f"║    Повторень: {REPEAT}                                       ║")
    print("╚══════════════════════════════════════════════════════════╝")

    all_results: list[BenchmarkResult] = []


    # ── 2. Текст ──
    text_sizes = [100, 1000, 5000]
    for sys_name, params in SYSTEMS.items():
        print(f"\n⏳ Текст — {sys_name}...")
        all_results.extend(benchmark_text(sys_name, params, text_sizes))

    text_rows = [[r.system, r.data_size, r.encrypt_time_ms, r.decrypt_time_ms, r.total_time_ms]
                 for r in all_results if r.data_type == "Текст (chars)"]
    print_table(["Система", "Розмір", "Шифр. (мс)", "Дешифр. (мс)", "Загалом (мс)"],
                text_rows, "Шифрування тексту (chars)")

    # ── 3. Зображення ──
    image_sizes = [(32, 32), (64, 48)]
    for sys_name, params in SYSTEMS.items():
        print(f"\n⏳ Зображення — {sys_name}...")
        all_results.extend(benchmark_image(sys_name, params, image_sizes))

    img_rows = [[r.system, r.data_size, r.encrypt_time_ms, r.decrypt_time_ms, r.total_time_ms]
                for r in all_results if r.data_type == "Зображення"]
    print_table(["Система", "Розмір", "Шифр. (мс)", "Дешифр. (мс)", "Загалом (мс)"],
                img_rows, "Шифрування зображень")

    # ── 4. Аудіо ──
    audio_durations = [0.1, 0.5]
    for sys_name, params in SYSTEMS.items():
        print(f"\n⏳ Аудіо — {sys_name}...")
        all_results.extend(benchmark_audio(sys_name, params, audio_durations))

    audio_rows = [[r.system, r.data_size, r.encrypt_time_ms, r.decrypt_time_ms, r.total_time_ms]
                  for r in all_results if r.data_type == "Аудіо (WAV)"]
    print_table(["Система", "Розмір", "Шифр. (мс)", "Дешифр. (мс)", "Загалом (мс)"],
                audio_rows, "Шифрування аудіо")

    # ── 5. Файли ──
    file_sizes = [1024, 10240, 102400]
    for sys_name, params in SYSTEMS.items():
        print(f"\n⏳ Файли — {sys_name}...")
        all_results.extend(benchmark_file(sys_name, params, file_sizes))

    file_rows = [[r.system, r.data_size, r.encrypt_time_ms, r.decrypt_time_ms, r.total_time_ms]
                 for r in all_results if r.data_type == "Файл (бінарний)"]
    print_table(["Система", "Розмір", "Шифр. (мс)", "Дешифр. (мс)", "Загалом (мс)"],
                file_rows, "Шифрування файлів")

    # ── Збереження ──
    output_path = str(PROJECT_ROOT / "tests" / "benchmark_results.xlsx")
    save_to_excel(all_results,  output_path)

    print(f"\n✅ Бенчмарк завершено. Всього тестів: {len(all_results)}")


if __name__ == "__main__":
    main()
