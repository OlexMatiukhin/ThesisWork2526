import { detectKind } from "./detectKind.js";
import { blockUnblockHeaderElements } from "../header/headerBlock.js";
import { checkFileMarker } from "../file/checkFileMarker.js";
function setButtonMaker(block, marker){
    const deryptbtn = block.querySelector(".decrypt-btn")
    const encryptbtn = block.querySelector(".encrypt-btn")
    if(decryptbtn) decryptbtn.disabled = marker;
    if(encryptbtn) encryptbtn.disabled = !marker;
}

export async function populatePreview(zone) {

    const file = zone.selectedFile;
    const url = zone.__objectUrl;
    if (!file) return;
    const kind = detectKind(file);
    const operationBlocks = document.querySelectorAll('.operation');
    let marker = null;
    marker = await checkFileMarker(file);
 

    operationBlocks.forEach(block => {
        if (kind === "image") {
            if (block.id === "encrypt-image") {
                block.style.display = "flex";
                const img = document.getElementById("original-image-content");
                if (img) {
                    img.src = url;
                    setButtonMaker(block, marker);
                    img.style.display = "block";
                    const empty = document.getElementById("orig-img-empty");
                    if (empty) empty.style.display = "none";
                }
                    

            }
            else {
                block.style.display = "none";

            }
        }
        else if (kind === "audio") {
            if (block.id === "encrypt-audio") {
                block.style.display = "flex";
                const audioTrack = document.getElementById("original-audio-content");
                if (audioTrack) {
                    audioTrack.src = url;
                    setButtonMaker(block, marker);
                }
            }
            else {
                block.style.display = "none";
            }

        }
        else if (kind === "other") {
            if (block.id === "encrypt-file") {

                block.style.display = "flex";

                const a = document.getElementById("link-download-original")
                if (a) {
                    a.href = url;
                    setButtonMaker(block, marker);
                    a.download = file.name;
                    const nameEl = document.getElementById("original-file-name");
                    const metaEl = document.getElementById("original-file-meta");
                    const extEl = document.getElementById("orig-ext");
                    if (nameEl) nameEl.textContent = file.name;
                    if (metaEl) metaEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + " МБ";
                    if (extEl) extEl.textContent = file.name.split('.').pop().toUpperCase();

                }
                block.dataset.originalFilename = file.name;
            }
            else {
                block.style.display = "none";
            }

        }
    });
    blockUnblockHeaderElements(false);

}