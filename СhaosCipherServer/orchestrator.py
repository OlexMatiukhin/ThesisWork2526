from typing import Dict, Any

from generators import ChaosFactory
from strategies import TextCryptor, FileCryptor, ImageCryptor, AudioCryptor

class CryptoOrchestrator:
    def __init__(self):
        self._factory = ChaosFactory()
        self._strategies = {
            "text": TextCryptor(),
            "image": ImageCryptor(),
            "file": FileCryptor(),
            "audio": AudioCryptor(),
        }
    def execute_request(self, system_type:str, system_params: Dict,
                        crypt_method:str, mode:str, content: Any, process_type:str) -> Any:
        strategy = self._strategies.get(crypt_method)
        generator_factory = self._factory
        generator= generator_factory.create_generator(system_type, system_params, mode)
        if not strategy:
            raise ValueError(f"Unknown crypt_method {crypt_method}")
        result = strategy.process(content, generator, process_type, mode)
        return result
