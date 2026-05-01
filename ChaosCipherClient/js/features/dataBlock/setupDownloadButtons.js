export function setupDownloadButtons() {
    const operationBlocks = document.querySelectorAll(".operation");

    operationBlocks.forEach((block) => {
        const downloadBtn = block.querySelector(".download-btn");
        if (!downloadBtn) return;

        downloadBtn.addEventListener("click", () => {
            try {
                downloadResultFromBlock(block);
            } catch (err) {
                console.error("Download error:", err);
                alert("Не вдалося завантажити файл");
            }
        });
    });
}

function downloadResultFromBlock(block) {
    const blockId = (block.id || "").toLowerCase();
    if (blockId.includes("image")) {
        const img = block.querySelector(".processed-image-content");
        downloadFromMediaSrc(img, makeDownloadFileName(block, "image"));
        return;
    }
    if (blockId.includes("audio")) {
        const audio = block.querySelector(".processed-audio-content");
        downloadFromMediaSrc(audio, makeDownloadFileName(block, "audio"));
        return;
    }   
    if (blockId.includes("file")) {
        const fileLink = block.querySelector(".link-download-processed");
        if (!fileLink || !fileLink.href) {
            alert("Немає файлу для завантаження");
            return;
        }

        triggerUrlDownload(fileLink.href, makeDownloadFileName(block, "file"));
        return;
    }
    alert("Немає результату для завантаження");
}

function downloadFromMediaSrc(mediaEl, fileName) {
    if (!mediaEl) {
        alert("Елемент результату не знайдено");
        return;
    }

    /*if (mediaEl.tagName.toLowerCase() === "audio" && (!mediaEl.currentSrc || mediaEl.currentSrc=="")) {
        alert("Немає аудіо для завантаження");
        return;
    }*/
    /*if (mediaEl.tagName.toLowerCase() === "img" && mediaEl.style.display === "none") {
        alert("Немає зображення для завантаження");
        return;
    }*/         

        
    const src = mediaEl.currentSrc || mediaEl.getAttribute("src") || "";
    if (!src) {
        alert("Немає результату для завантаження");
        return;
    }
    
    triggerUrlDownload(src, fileName);
}

function triggerUrlDownload(url, fileName) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function makeDownloadFileName(block, type) {
    const blockId = (block.id || "").toLowerCase();
    let base = "processed-result";
    if (blockId =="encrypt-image") base = "processed-image";
    else  if (blockId =="encrypt-audio") base = "processed-audio";
    else if (blockId =="encrypt-file") base = "processed-file";
    let ext = "bin";
    if (type === "image") ext = "png";
    else if (type === "audio") ext = "wav";  
    else if (type === "file") {
        const filename = block.dataset.originalFilename; 
        ext = filename?.split(".")?.pop().toLowerCase() || "";
    }
    return `${base}-${Date.now()}.${ext}`;
}  
