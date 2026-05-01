from abc import ABC, abstractmethod
from io import BytesIO
from typing import Any
import PIL.Image as Image
from enum import Enum

from encrypt_alg.audio_encrypt import encrypt_auido, decrypt_auido
from encrypt_alg.file_encrypt import encrypt_file, decrypt_file
from encrypt_alg.image_encrypt_server import encrypt_image, decrypt_image
from encrypt_alg.text_encrypt import encrypt_text, decrypt_text

class ProcessType(Enum):
    ENCRYPT = "encrypt"
    DECRYPT = "decrypt"
 




class ICryptoStrategy(ABC):
    @abstractmethod
    def process(self, data: any, generator:any, process_type:str,mode:str = None) -> Any:
        pass
class TextCryptor(ICryptoStrategy):
    def process(self, data: any, generator: any, process_type: str, mode:str) -> Any:
        if process_type == ProcessType.ENCRYPT.value:
            return encrypt_text(data, generator, mode)
        elif process_type == ProcessType.DECRYPT.value:
            return decrypt_text(data, generator, mode)
        else:
            raise ValueError(f"Invalid process type: {process_type}")
class ImageCryptor(ICryptoStrategy):
    def process(self, data: any, generator:any, process_type:str, mode) -> Any:
        if process_type == ProcessType.ENCRYPT.value:
            return encrypt_image(data, generator)
        elif process_type == ProcessType.DECRYPT.value:
            return decrypt_image(data, generator)
        else:
            raise ValueError(f"Invalid process type: {process_type}")
class AudioCryptor(ICryptoStrategy):
    def process(self, data: any, generator: any, process_type: str, mode) -> Any:
        if process_type == ProcessType.ENCRYPT.value:
            return encrypt_auido(data, generator)
        elif process_type == ProcessType.DECRYPT.value:
            return decrypt_auido(data, generator)
        else:
            raise ValueError(f"Invalid process type: {process_type}")
class FileCryptor(ICryptoStrategy):
    def process(self, data: any, generator:any, process_type:str, mode) -> Any:
        if process_type == ProcessType.ENCRYPT.value:
            return encrypt_file(data, generator)
        elif process_type == ProcessType.DECRYPT.value:
            return decrypt_file(data, generator)
        else:
            raise ValueError(f"Invalid process type: {process_type}")
