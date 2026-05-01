import timeit
import numpy as np
import os

SIZE = 1_000_000  # 1 MB
raw = os.urandom(SIZE)
cipher = os.urandom(SIZE)

def xor_current():
    return bytes(raw[i] ^ cipher[i] for i in range(len(raw)))

def xor_zip():
    return bytes(a ^ b for a, b in zip(raw, cipher))

def xor_int():
    a = int.from_bytes(raw, 'big')
    b = int.from_bytes(cipher, 'big')
    return (a ^ b).to_bytes(len(raw), 'big')

def xor_numpy():
    return (np.frombuffer(raw, dtype=np.uint8) ^ np.frombuffer(cipher, dtype=np.uint8)).tobytes()

for name, func in [("current (index)", xor_current), ("zip", xor_zip), ("int.from_bytes", xor_int), ("numpy", xor_numpy)]:
    t = timeit.timeit(func, number=5)
    print(f"{name:20s}: {t:.4f}s  (5 runs, {SIZE/1e6:.0f} MB)")
