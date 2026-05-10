import { MAX_BYTES } from "../../config.js";
import { revokeObjectUrl } from "../dropzone/revokeObjectUrl.js";
import { setError, setProgressBar } from "../dropzone/setProgAndErrDrZone.js";
import { shouldDisableHeaderElements } from "../header/headerBlock.js";
import { setProgressBarInDataBlock, setErrorInDataBlock } from "../dataBlock/setProgressAndErrorBlock.js";
import { populatePreview } from "../dataBlock/populatePreview.js";
import { cancelUpload } from "../dataBlock/cancelUpload.js";

export function resetFileSelection(zone) {
    revokeObjectUrl(zone);
    cancelUpload(zone);

    const originalFileLink = document.getElementById("link-download-original");
    const processedFileLink = document.getElementById("link-download-processed");
    originalFileLink?.removeAttribute("href");
    processedFileLink?.removeAttribute("href");

    const originalImage = document.getElementById("original-image-content");
    const processedImage = document.getElementById("processed-image-content");
    if (originalImage) {
        originalImage.src = "";
        originalImage.style.display = "none";
    }
    if (processedImage) {
        processedImage.src = "";
        processedImage.style.display = "none";
    }

    const audioPending = document.getElementById("audio-result-pending");
    const processedAudioPlayer = document.getElementById("processed-audio-content");
    const audioDlBtn = document.getElementById("audio-dl-btn"); // ← виправте id в HTML
    if (audioPending) audioPending.style.display = "flex";
    if (processedAudioPlayer) processedAudioPlayer.style.display = "none";
    if (audioDlBtn) audioDlBtn.disabled = true;

    document.querySelectorAll(".operation").forEach(el => {
        if (el.selectedFile) {
            el.selectedFile = null; // revokeObjectUrl вже викликано вище
        }
        setProgressBarInDataBlock(el, "", false);
        setErrorInDataBlock(el, "", false);
        el.style.display = "none";
    });
}

export function bindProcessedFile(file, ext = null) {
    if (!file) return;

    const operationBlocks = document.querySelectorAll(".operation");
    operationBlocks.forEach(el => {
        if (window.getComputedStyle(el).display !== "flex") return;
        if (el.__objectUrl) {
            URL.revokeObjectURL(el.__objectUrl);
            el.__objectUrl = null;
        }

        el.__fileBuffer = file;
        el.__objectUrl = URL.createObjectURL(file);
        const url = el.__objectUrl;



        if (el.id === "encrypt-image") {
            const img = document.getElementById("processed-image-content");
            if (img) {
                img.src = url;
                img.style.display = "block";
                document.getElementById("result-img-empty")?.style.setProperty("display", "none");
                const dlBtn = document.getElementById("img-dl-btn");
                if (dlBtn) dlBtn.disabled = false;
            }
        }
        else if (el.id === "encrypt-audio") {
            const audioTrack = document.getElementById("processed-audio-content");
            if (audioTrack) {
                audioTrack.src = url;
                audioTrack.style.display = "block";
                document.getElementById("audio-result-pending")?.style.setProperty("display", "none");
                const dlBtn = document.getElementById("audio-dl-btn"); // ← виправте id в HTML
                if (dlBtn) dlBtn.disabled = false;
            }
        }
        else if (el.id === "encrypt-file") {
            const displayExt = (ext || 'BIN').toUpperCase();
            const downloadName = ext ? `processed.${ext}` : "processed";
            const a = document.getElementById("link-download-processed");
            if (a) { a.href = url; a.download = downloadName; }

            const nameEl = document.getElementById("processed-file-name");
            const metaEl = document.getElementById("processed-file-meta");
            const extEl  = document.getElementById("result-ext");
            const pending = document.getElementById("result-pending");
            const ready   = document.getElementById("result-ready");
            const dlBtn   = document.getElementById("file-dl-btn");

            if (nameEl) nameEl.textContent = downloadName;
            if (metaEl) metaEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + " МБ";
            if (extEl)  extEl.textContent = displayExt;
            if (pending) pending.style.display = "none";
            if (ready)   ready.style.display = "flex";
            if (dlBtn)   dlBtn.disabled = false;

        }
    });
}
export function readFile(zone, file) {
    if (file.size > MAX_BYTES) {
        setError(zone, "Файл занадто великий за розміром!", true);
        return
    }
    shouldDisableHeaderElements(true);
    revokeObjectUrl(zone)
    zone.selectedFile = file

    setError(zone, "", false);
    const reader = new FileReader();
    zone.__reader = reader;
    reader.onload = () => {
        zone.__fileBuffer = reader.result;
        zone.__reader = null;
        zone.__objectUrl = URL.createObjectURL(file);
        console.log("File in Buffer");
        setProgressBar(zone, 100, true);
        setTimeout(() => { setProgressBar(zone, 0, false) }, 500);
        populatePreview(zone);
    }
    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgressBar(zone, pct, true);
        }
    }
    reader.onabort = (e) => {
        setProgressBar(zone, 0, false)
        setError(zone, "Читання файлу скасовано", true);
        shouldDisableHeaderElements(false);

    }
    reader.onerror = (e) => {
        setProgressBar(zone, 0, false)
        setError(zone, "Помилка при читанні", true);
        shouldDisableHeaderElements(false);
    }
    reader.readAsArrayBuffer(file);
}