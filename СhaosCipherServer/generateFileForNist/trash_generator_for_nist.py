import os
import struct
from math import floor
from pathlib import Path
import struct


import numpy as np

from encrypt_alg.test import generator_factory
params = {
    "logisticXLorenz": 0.01,
    "lorenzX": -20,
    "lorenzY": -20,
    "lorenzZ": 0,
}

#Treshold bit generation
"""
def from_number_to_bits_arr(arr):
    changed_array=[0 if (x - floor(x)) < 0.5 else 1 for x in arr]
    return changed_array
def from_bits_to_byte_arr(bits_arr):
    byte_arr = bytearray()
    for i in range(0, len(bits_arr)-7, 8):
        byte=0
        for b in bits_arr[i:i+8]:
            byte=(byte <<1) | b
        byte_arr.append(byte)
    return byte_arr
def generate_bins_files(sytem_type, generator, first_system_iter, second_system_iter):
    for i in range(0, 30):
        sequence = generator.get_sequence(1048576)
        bits_arr_sequence = from_number_to_bits_arr(sequence)
        byte_arr_sequence = from_bits_to_byte_arr(bits_arr_sequence)
        generator.update_increment(first_system_iter, second_system_iter)
        output_dir = Path("../dataNist")
        output_dir.mkdir(parents=True, exist_ok=True)
        filename = output_dir / f"{sytem_type}_data{i+1}.bin"
        print(filename)
        with open(filename, "wb") as f:
            f.write(byte_arr_sequence)
#gen= generator_factory.create_generator("lorenz", params, "chars" )
#generate_bins_files("logistic_lorenz",gen, 0.01, 0.5);
def generate_bins_one_file(sytem_type, generator, first_system_iter, second_system_iter):
    for i in range(0, 50):
        sequence = generator.get_sequence(1048576)
        bits_arr_sequence = from_number_to_bits_arr(sequence)
        byte_arr_sequence = from_bits_to_byte_arr(bits_arr_sequence)
        generator.update_increment(first_system_iter, second_system_iter)
        output_dir = Path("../dataNist")
        output_dir.mkdir(parents=True, exist_ok=True)
        filename = output_dir / f"{sytem_type}_data.bin"
        print(filename)
        with open(filename, "ab") as f:
            f.write(byte_arr_sequence)

#gen= generator_factory.create_generator("lorenz", params, "chars" )
#generate_bins_one_file("logistic_lorenz",gen, 0.01, 0.5);
"""
def generate_bin_from_multiple_seeds(sytem_type, generator, first_system_iter, second_system_iter):
    for i in range(0, 50):
        sequence = generator.get_sequence(15626)
        generator.update_increment(first_system_iter, second_system_iter)
        byte_arr_sequence = struct.pack(f">{len(sequence)}d", *sequence)
        output_dir = Path("../dataNist")
        output_dir.mkdir(parents=True, exist_ok=True)
        filename = output_dir / f"{sytem_type}_multiple_seeds_data.bin"
        with open(filename, "ab") as f:
            f.write(byte_arr_sequence)
def generate_bin_from_multiple_seeds_SHA(sytem_type, generator, first_system_iter, second_system_iter):
    output_dir = Path("../dataNist")
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = output_dir / f"{sytem_type}_sha_multiple_seeds_data.bin"
    file_path = Path(filename)
    if file_path.exists():
         os.remove(filename)
    for i in range(0, 50):
        sequence = generator.get_sequence(131072)
        generated_sequence_string = b"".join(sequence)
        generator.update_increment(first_system_iter, second_system_iter)
        with open(filename, "ab") as f:
            f.write(generated_sequence_string)
gen1= generator_factory.create_generator("lorenz", params, "chars" )
generate_bin_from_multiple_seeds("logistic_lorenz", gen1, 0.01, 0.5);
gen2= generator_factory.create_generator("lorenz", params, "bits" )
generate_bin_from_multiple_seeds_SHA("logistic_lorenz",gen2, 0.01, 0.5);

def generate_bin_from_one_seed(sytem_type, generator):
        sequence = generator.get_sequence(781300)
        byte_arr_sequence = struct.pack(f">{len(sequence)}d", *sequence)
        output_dir = Path("../dataNist")
        output_dir.mkdir(parents=True, exist_ok=True)
        filename = output_dir / f"{sytem_type}_one_seed.bin"
        with open(filename, "ab") as f:
            f.write(byte_arr_sequence)
gen3= generator_factory.create_generator("lorenz", params, "chars" )
generate_bin_from_one_seed("logistic_lorenz", gen3);


def generate_bin_from_one_seed_SHA(sytem_type, generator):
    output_dir = Path("../dataNist")
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = output_dir / f"{sytem_type}_sha_one_seed.bin"
    sequence = generator.get_sequence(6553600)
    generated_sequence_string = b"".join(sequence)
    with open(filename, "ab") as f:
        f.write(generated_sequence_string)
gen4 = generator_factory.create_generator("lorenz", params, "bits")
generate_bin_from_one_seed_SHA("logistic_lorenz", gen4);





"""def generate_bin_from_multiple_seeds_mantisa(system_type, generator, first_system_iter, second_system_iter):
    output_dir = Path("../dataNist")
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = output_dir / f"{system_type}_multiple_seeds_mantissa_data.bin"

    with open(filename, "ab") as f:
        for i in range(50):
            sequence = generator.get_sequence(19231)
            generator.update_increment(first_system_iter, second_system_iter)

            arr = np.array(sequence, dtype=np.float64)
            int_arr = arr.view(np.uint64)
            mantissas = int_arr & np.uint64(0x000FFFFFFFFFFFFF)
            packed_bits = _pack_mantissas(mantissas)
            f.write(packed_bits)
def _pack_mantissas(mantissas: np.ndarray) -> bytes:
    bit_positions = np.arange(51, -1, -1, dtype=np.uint64)  # [51, 50, ..., 0]
    bits_matrix = ((mantissas[:, None] >> bit_positions) & np.uint64(1)).astype(np.uint8)

    flat_bits = bits_matrix.ravel()
    remainder = len(flat_bits) % 8
    if remainder:
        flat_bits = np.concatenate([flat_bits, np.zeros(8 - remainder, dtype=np.uint8)])

    return np.packbits(flat_bits).tobytes()



gen5 = generator_factory.create_generator("lorenz", params, "chars")
generate_bin_from_multiple_seeds_mantisa("logistic_lorenz", gen5, 0.01, 0.5)
"""