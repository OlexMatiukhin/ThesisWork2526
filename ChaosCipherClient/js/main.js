import { initBurgerMenu } from "./features/header/burgerMenu.js";
import { initSystemSwitcher } from "./features/haosSelect/switchingSystemHaos.js";
import { initDataModeSwitcher } from "./features/dataMode/switchingFile.js";

import { readFile, resetFileSelection } from "./features/file/readFile.js";
import { abortDownload } from "./features/dropzone/abortDownload.js";
import { uploadStoredFile } from "./features/file/uploadFile.js";
import { uploadText } from "./features/text/uploadText.js";
import { setupDownloadButtons } from "./features/dataBlock/setupDownloadButtons.js";
import { setInputTextError, setResultInputError } from "./features/text/setTextError.js";
document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener("dragover", (e) => { e.preventDefault() }, { passive: false });
    window.addEventListener("drop", (e) => {
        const insideZone = e.target && (e.target.closest ? e.target.closest('[data-dropzone]') : null)
        if (!insideZone) e.preventDefault()
    }, { passive: false })

    initBurgerMenu();
    initSystemSwitcher();
    initDataModeSwitcher();
    const input = document.getElementsByClassName("file-input")[0];
    const dropzone = document.getElementsByClassName("dropzone-inner")[0];
    const cancelDownloadButton = document.getElementsByClassName("dz-clear")[0];
    const removeButtons = document.querySelectorAll(".remove-btn");
    const encryptButtons = document.querySelectorAll(".encrypt-btn");
    const decryptButtons = document.querySelectorAll(".decrypt-btn");
    dropzone.addEventListener("click", (e) => {
        input.click();

    });
    input.addEventListener('change', () => {
        const f = input.files && input.files.length ? input.files[0] : null;
        if (f) {
            readFile(dropzone, f);
            input.value = '';
        }
    });
    dropzone.addEventListener("drop", (e) => {
        debugger;
        e.preventDefault();
        const files = e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
        if (!files || files.length == 0) return
        const f = files[0]
        console.log(f.name);
        readFile(dropzone, f);


    });


    //Button Remove Event Listener
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            resetFileSelection(dropzone);
            const dropZone = document.getElementById("drop-zone");
            dropZone.style.display = "flex";
        })
    })
    //Button Ecnrypt/Decrypt Event Listener
    encryptButtons.forEach(btn => btn.addEventListener("click", () => uploadStoredFile(dropzone, "Encrypt")));

    decryptButtons.forEach(btn => btn.addEventListener("click", () => uploadStoredFile(dropzone, "Decrypt")));

    const encryptTextBtn = document.querySelectorAll(".encrypt-text-btn")[0];
    const decryptTextBtn = document.querySelectorAll(".decrypt-text-btn")[0];
    encryptTextBtn.addEventListener("click", () => uploadText(dropzone, "Encrypt"));

    decryptTextBtn.addEventListener("click", () => uploadText(dropzone, "Decrypt"));
    //Download buttons
    setupDownloadButtons()

    function updateCharCount(taId, countId) {
        const len = document.getElementById(taId).value.length;
        document.getElementById(countId).textContent = len + ' символів';
    }

    function copyTextArea(taId, btn) {
        const val = document.getElementById(taId).value;
        if (!val) return;
        navigator.clipboard.writeText(val).then(() => {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1500);
        });
    }

    function clearTextArea(taId, countId) {
        document.getElementById(taId).value = '';
        document.getElementById(countId).textContent = '0 символів';
    }

    // Кнопки copy
    document.querySelectorAll('[data-action="copy"]').forEach(btn => {
        btn.addEventListener("click", function () {
            const targetId = this.dataset.target;
            copyTextArea(targetId, this);
        });
    });

    // Кнопки clear
    document.querySelectorAll('[data-action="clear"]').forEach(btn => {
        btn.addEventListener("click", function () {
            const targetId = this.dataset.target;
            const counterId = this.dataset.counter;
            clearTextArea(targetId, counterId);
        });
    });

    document.addEventListener("input", function (e) {
        const area = e.target.closest("textarea");
        if (!area) return;

        const counterEl = area.parentElement.querySelector(".text-char-count");
        if (counterEl) {
            updateCharCount(area.id, counterEl.id);
        }
    });

    // Стрілка — swap тексту між textarea
    document.querySelector('.text-arrow-ring').addEventListener('click', function () {
        const hasError = document.querySelectorAll('.error').length > 0;
        if (hasError) return;
        const original = document.getElementById('original-text-content');
        const processed = document.getElementById('processed-text-content');
        const tmp = original.value;
        original.value = processed.value;
        processed.value = tmp;

        const inCounter = document.getElementById('in-char-count');
        const outCounter = document.getElementById('out-char-count');
        if (inCounter) inCounter.textContent = original.value.length + ' символів';
        if (outCounter) outCounter.textContent = processed.value.length + ' символів';
    });


    document.querySelector('.original-text-content').addEventListener('click', function () {

        setInputTextError("", false);
        setResultInputError("", false);
    });
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function () {
            const group = this.closest('.form-group');
            if (group) {
                const old = group.querySelector('.param-error');
                if (old) old.remove();
            }
            this.classList.remove('input-error');
        });
    })
   




});
