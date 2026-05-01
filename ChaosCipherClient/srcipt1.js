document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("dragover",(e)=>{e.preventDefault()}, {passive:false});
    window.addEventListener("drop",(e)=>{
        const insideZone = e.target && (e.target.clossest? e.target.clossest('[data-dropzone]'):null)
        if (!insideZone) e.preventDefault()
    }, {passive:false})
   /*Server URL*/
    const ENCRYPT_URL = 'http://127.0.0.1:8000/encrypt/file';
    const DECRYPT_URL = 'http://127.0.0.1:8000/decrypt/file';
    const ENCRYPT_FILE_URL = 'http://127.0.0.1:8000/encrypt/file';
    const DECRYPT_FILE_URL = 'http://127.0.0.1:8000/decrypt/file';
    const ENCRYPT_IMAGE_URL = 'http://127.0.0.1:8000/encrypt/image';
    const DECRYPT_IMAGE_URL = 'http://127.0.0.1:8000/decrypt/image';
    const ENCRYPT_AUDIO_URL = 'http://127.0.0.1:8000/encrypt/audio';
    const DECRYPT_AUDIO_URL = 'http://127.0.0.1:8000/decrypt/audio';
    const ENCRYPT_TEXT_URL = 'http://127.0.0.1:8000/encrypt/text';
    const DECRYPT_TEXT_URL = 'http://127.0.0.1:8000/decrypt/text';

//------------------------------Max size of byte-------------------------------------------------------
    const MAX_BYTES = 1024 * 1024 * 1024;

   

//-------------------------------Main Event Listener-------------------------------------------------------------


    input= document.getElementsByClassName("file-input")[0];
    dropzone= document.getElementsByClassName("dropzone-inner")[0];
    cancelDownloadButton= document.getElementsByClassName("dz-clear")[0];
    removeButtons=document.querySelectorAll(".remove-btn");
    encryptButtons=document.querySelectorAll(".encrypt-btn");
    decryptButtons= document.querySelectorAll(".decrypt-btn");
    dropzone.addEventListener("click", (e)=>{
       input.click();

    }); 
    input.addEventListener('change', () => {
        const f = input.files && input.files.length ? input.files[0] : null;
        if (f) {
            readFile(dropzone, f);
            input.value = '';
        }
    }); 
    dropzone.addEventListener("drop", (e)=>{
        e.preventDefault();
        const files = e.dataTransfer && e.dataTransfer.files? e.dataTransfer.files : null;
        if(! files || files.length==0) return
        f= files[0]
        console.log(f.name);
        readFile(dropzone, f);
           

    });
    //Cancel button
    cancelDownloadButton.addEventListener("click", (e)=>{
        abortDownload(dropzone);
    })
    //Button Remove Event Listener
    removeButtons.forEach(button=>{
        button.addEventListener("click",()=>{
            resetFileSelection(dropzone);
            dropZone=document.getElementById("drop-zone");
            dropZone.style.display = "flex";
        })
    })
    //Button Ecnrypt/Decrypt Event Listener
    encryptButtons.forEach(btn=>btn.addEventListener("click", () =>uploadStoredFile(dropzone,"Encrypt")));
       
    decryptButtons.forEach(btn=>btn.addEventListener("click", () =>uploadStoredFile(dropzone,"Decrypt")));

    encryptTextBtn=document.querySelectorAll(".encrypt-text-btn")[0];
    decryptTextBtn=document.querySelectorAll(".decrypt-text-btn")[0];
    encryptTextBtn.addEventListener("click", ()=> uploadText(dropzone,"Encrypt"));
       
    decryptTextBtn.addEventListener("click", ()=> uploadText(dropzone,"Decrypt"));
    setupDownloadButtons()
    //Download buttons
    




});


