//-------------------------------Upload Text on Server--------------------------------------------------   
import { API } from "../../config.js";
import { getDataFromActiveParametersFormANDHeader } from "../formData/getFromData.js";
import { setErrorInDataBlock, setProgressBarInDataBlock } from "../dataBlock/setProgressAndErrorBlock.js";
import { setInputTextError, setResultInputError } from "../text/setTextError.js"
export function uploadText(zone, operation) {
    const originalText = document.getElementById("original-text-content").value;
    const processedText = document.getElementById("processed-text-content");
    const textBlock = document.getElementById("encrypt-text");
    setErrorInDataBlock(textBlock, "", false);
    setResultInputError("", false);

    if (!originalText) {
        setInputTextError("Введіть текст перед відправкою", true)
        return
    }
    const formData = getDataFromActiveParametersFormANDHeader();
    if (!formData) return
    formData.set("operation", operation);
    formData.append("data_type", "text")
    formData.set("text", originalText)
    const xhr = new XMLHttpRequest();
    zone.__xhr = xhr;
    if (operation == "Encrypt") {
        xhr.open("POST", API.ENCRYPT_TEXT_URL, true);
    }
    else if (operation == "Decrypt") {
        xhr.open("POST", API.DECRYPT_TEXT_URL, true);
    }



    xhr.upload.addEventListener("progress", (e) => {
        if (!e.lengthComputable) return
        let pct = Math.round((e.loaded / e.total) * 100)
        setProgressBarInDataBlock(textBlock, pct, true);
    })
    xhr.addEventListener("load", () => {
        if (xhr.status === 300 || xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            processedText.value = response.processed_text;
            setProgressBarInDataBlock(textBlock, 100, true);
            setTimeout(() => { setProgressBarInDataBlock(textBlock, 0, false) }, 500);

        }
        else {

            setProgressBarInDataBlock(textBlock, 0, false)
            setResultInputError("Помилка при завнтаженні даних на сервер.", true);
        }
    })

    xhr.addEventListener("error", () => {
        console.error("Error during text upload:", xhr.statusText);
        setProgressBarInDataBlock(textBlock, 0, false)
        setResultInputError(`${xhr.status} - Помилка при відправці даних на сервер.`, true);
    })
    xhr.addEventListener("abort", () => {
        setProgressBarInDataBlock(textBlock, 0, false);
        setErrorInDataBlock(textBlock, "", false);
    });
    return xhr.send(formData);


}  
