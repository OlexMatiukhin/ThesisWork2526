 import { API } from "../../config.js";

 export function getUrlByBlockIdAndProcessType(id, operation){
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
}