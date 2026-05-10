
 import { uploadText } from "./uploadText.js";
 import { setInputTextError, setResultInputError } from "../text/setTextError.js";
 import { resetTextSelection } from "../dataBlock/resetTextSelection.js";
const dropzone = document.querySelector(".dropzone-inner");
 function ifOrinalTextInputHasError(){
    const hasError = document.querySelector('.original-text-content.textarea-error');
    return hasError;
 }
 function ifResultTextInputHasError(){
    const hasError = document.querySelector('.processed-text-content.textarea-error');
    return hasError;
 }
 export function initText(){

 const encryptTextBtn = document.querySelectorAll(".encrypt-text-btn")[0];
    const decryptTextBtn = document.querySelectorAll(".decrypt-text-btn")[0];
   
    encryptTextBtn.addEventListener("click", () => { 

        if (ifOrinalTextInputHasError()) return;

        uploadText(dropzone, "Encrypt");
    });

    decryptTextBtn.addEventListener("click", () => {
        if (ifOrinalTextInputHasError()) return;

        uploadText(dropzone, "Decrypt")
    });
   


    
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
        const hasError = document.querySelectorAll('.textarea-error').length > 0;
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
}