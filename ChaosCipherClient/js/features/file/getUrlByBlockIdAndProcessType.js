import { API } from "../../config.js";

/*export function getUrlByBlockIdAndProcessType(id, operation){
     let data_type = ""
     let chosen_URL=""
     if(id==="encrypt-image"){
          chosen_URL = (operation == "Encrypt") ? API.ENCRYPT_IMAGE_URL : API.DECRYPT_IMAGE_URL;
          data_type ="image"

     }
     else if(id=="encrypt-audio"){
          chosen_URL = (operation == "Encrypt") ? API.ENCRYPT_AUDIO_URL : API.DECRYPT_AUDIO_URL;
          data_type = "audio"                
     }
     else{
          chosen_URL = (operation == "Encrypt") ? API.ENCRYPT_FILE_URL : API.DECRYPT_FILE_URL;
          data_type ="file"
     }
          return { data_type, chosen_URL };
}*/
const URL_MAP = {
    "encrypt-image": { encrypt: API.ENCRYPT_IMAGE_URL, decrypt: API.DECRYPT_IMAGE_URL, type: "image" },
    "encrypt-audio": { encrypt: API.ENCRYPT_AUDIO_URL, decrypt: API.DECRYPT_AUDIO_URL, type: "audio" },
    "encrypt-file":  { encrypt: API.ENCRYPT_FILE_URL,  decrypt: API.DECRYPT_FILE_URL,  type: "file"  },
};

export function getUrlByBlockIdAndProcessType(id, operation) {
    const entry = URL_MAP[id] ?? URL_MAP["encrypt-file"];
    return {
        chosen_URL: operation === "Encrypt" ? entry.encrypt : entry.decrypt,
        data_type: entry.type,
    };
}