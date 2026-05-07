document.addEventListener('DOMContentLoaded', () => {

    /*BURGER MENU*
    ***********
    ***********
    */
    const burgerBtn = document.getElementById('burgerBtn');
    const menuContainer = document.getElementById('menuContainer');

    burgerBtn.addEventListener('click', () => {
        // Перемикаємо 'open' у меню
        menuContainer.classList.toggle('open');
        
        // Анімація перетворення полосок у хрестик
        burgerBtn.classList.toggle('active');
    });

    // Закриття меню якщо натиснули поза ним
   /* document.addEventListener('click', (event) => {
        if (!burgerBtn.contains(event.target) && !menuContainer.contains(event.target)) {
            menuContainer.classList.remove('open');
        }
    });*/




    /*SWITCHING SYTEM HAOS SELECT*
    ***********
    ************/

    const systemSelect = document.getElementById('system');
    const paramBlocks = document.querySelectorAll('.parameters');

    function updateVisibility() {
        const selectedValue = systemSelect.value; 
        paramBlocks.forEach(block => {
            if (block.id === `${selectedValue}-params`) {
                block.style.display="block";
            } else {
                block.style.display="none";
            }
        });
    }
    systemSelect.addEventListener('change', updateVisibility);
    updateVisibility();



    /*SWITCHING FILE(Drag zone)/TEXT
    ************
    ************
    */

        
        const typeInfoSelect = document.getElementById('data');
        const operationBlocks = document.querySelectorAll('.operation');
        function updateDataVisibility() {
        const selectedValue = typeInfoSelect.value;
        operationBlocks.forEach(block => {
           if (`${selectedValue}`==="text") {
                if(block.id==="encrypt-text"){
                     dropZone=document.getElementById("drop-zone");
                     resetFileSelection(dropZone);
                     block.style.display="block";
                  
                }
                else {
                       block.style.display="none";
                   
                }
            } 
            else if (`${selectedValue}`==="file"){
                resetTextSelection();
                if(block.id==="drop-zone"){
                      block.style.display="block";
                }
                else {
                     block.style.display="none";
                }
            }
        });
           
    }
     typeInfoSelect.addEventListener('change', updateDataVisibility);
     updateDataVisibility();





       /*Drag N Drop
       ************
       ************/




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

    function blockUnblockHeaderElements(block){
              const headerSelects = document.querySelectorAll('header select');
             headerSelects.forEach(el =>{
                if(block){
                    el.disabled=true;
                }
                else{
                    el.disabled=false;
                }

             })

        
    }

//------------------------------Detect file type--------------------------------------------------------
    function detectKind (file){
        const type = (file.type || "").toLowerCase();
        if (type.startsWith("image/")) return "image";
        if (type.startsWith("audio/")) return "audio";
        const name = file.name.toLowerCase() || "";
        if (name.match(/\.(png|jpeg|gif|bmp|webp|svg|tiff?)$/)) return 'image'
        if (name.match(/\.(mp3|wav|ogg|m4a|acc|wma|opus?)$/)) return 'image'
        return "other"
    }

    


//-----------------------------------Show and hide elements of dropzone--------------------------------

    function setProgressBar(zone,value, show){
        const progressBlock = document.getElementsByClassName("dz-progress")[0];
        const progressBar = document.getElementsByClassName("dz-progress-bar")[0];
        if (!progressBlock || !progressBar) return;

        if(show){
            progressBlock.style.display="block";
            progressBar.style.display="block";
            v=Math.max(0, Math.min(100, value));
            progressBar.style.width=`${v}%`
            console.log("Set value");

            /*progressBar.setAttribute('aria-valuenow', String(Math.round(widht)));*/

        }
        else{
                progressBlock.style.display="none";
            progressBar.style.display="none";
        }
    }

    function setError(zone,value, show){
        let error_block=document.getElementsByClassName('dz-error')[0];
        if(show){
            error_block.style.display="block";
            error_block.textContent=value;
        }
        else{
            error_block.style.display="none";
            error_block.textContent=value;
        }

    }


    
    function revokeObjectUrl (zone){
        if (zone.__objectUrl){
            try{URL.revokeObjectURL(zone.__objectUrl);} catch{}
        }
        zone.__objectUrl=null;
    }

    function resetFileSelection(zone){
        revokeObjectUrl(zone);
        const originalFileLink=document.getElementById("link-download-original");
        const processedFileLink=document.getElementById("link-download-processed");

        if(originalFileLink.hasAttribute("href")){
            originalFileLink.removeAttribute("href");
        }
        if(processedFileLink.hasAttribute("href")){
            processedFileLink.removeAttribute("href");
        }

        const originalImage=document.getElementById("original-image-content");
        const processedImage=document.getElementById("processed-image-content");
        originalImage.src=""
        processedImage.src="";
        processedImage.style.display="none";
        
        const originalAudio=document.getElementById("original-audio-content")
        const processedAudio=document.getElementById("processed-audio-content");
        [originalAudio, processedAudio].forEach(el=>{
        el.pause();
        el.removeAttribute('src');
        el.load();

        })

        
        let operationBlocks = document.querySelectorAll(".operation");
        operationBlocks.forEach(el =>{
            if(el.selectedFile){
                if(el.__objectUrl){
                    revokeObjectUrl(el);
                }
                el.selectedFile=null;
            }
        el.style.display="none";
        })

        


    }

    function bindProcessedFile(file){
        if(!file) return
        const operationBlocks = document.querySelectorAll(".operation");
        operationBlocks.forEach(el =>{
            if(el.style.display=="flex"){
                if(el.id==="encrypt-image"){
                    el.__fileBuffer=file;
                    el.__objectUrl=URL.createObjectURL(file);
                    url=el.__objectUrl;
                    const img=document.getElementById("processed-image-content");
                    
                     if(img){
                        img.src = url;
                        img.style.display="block";

                     }   
                     
                }
                
                if(el.id==="encrypt-audio"){
                    el.__fileBuffer=file;
                    el.__objectUrl=URL.createObjectURL(file);
                    url=el.__objectUrl;
                    const audioTrack=document.getElementById("processed-audio-content");
                     if(audioTrack){
                        audioTrack.src = url;
                    }   
                     
                }
                if(el.id==="encrypt-file"){
                    el.__fileBuffer=file;
                    el.__objectUrl=URL.createObjectURL(file);
                    url=el.__objectUrl;
                    const a=document.getElementById("link-download-processed")
                    if (a) { a.href = url; a.download = file.name;}
                     
                }




            }

        })
        

    }

    function getDataFromActiveParametersFormANDHeader(){
        const formData = new FormData();
        const menuContainer = document.getElementById('menuContainer');
        menuContainerSelects = menuContainer.querySelectorAll("select");
        menuContainerSelects.forEach(select=>{
            formData.append(select.name, select.value);
        })   
        //form
        const systemSelect = document.getElementById('system');
        const activeId = systemSelect.value;
        const activeParamBlock = document.getElementById(`${activeId}-params`);
        const inputs= activeParamBlock.querySelectorAll("input");
        const paramsObj = {};
        inputs.forEach(input=>{
            paramsObj[input.name] = input.value;
            
        })
        console.log(paramsObj)
        formData.append("params", JSON.stringify(paramsObj));
        return formData;
    }


//---------------------------Reset Data Of Text-------------------------
    function resetTextSelection(){    
        const textBlock = document.getElementById("encrypt-text");
        const originalTextArea= textBlock.getElementsByClassName("original-text-content")[0];
        const processedTextArea= textBlock.getElementsByClassName("processed-text-content")[0];
        textBlock.style.display="none";  
        originalTextArea.value="";
        processedTextArea.value="";
            
        
    }

//-----------------------------------Show and hide loader and errror Data Blocks--------------------------------
    function setProgressBarInDataBlock(zone,value, show){
        const progressBlock = zone.getElementsByClassName("encrypt-progress")[0];
        const progressBar = zone.getElementsByClassName("encrypt-progress-bar")[0];
        if (!progressBlock || !progressBar) return;

        if(show){
            progressBlock.style.display="block";
            progressBar.style.display="block";
            v=Math.max(0, Math.min(100, value));
            progressBar.style.width=`${v}%`
            /*progressBar.setAttribute('aria-valuenow', String(Math.round(widht)));*/

        }
        else{
                progressBlock.style.display="none";
            progressBar.style.display="none";
        }
    }

    function setErrorInDataBlock(zone,value, show){
        let error_block=zone.getElementsByClassName('encrypt-error')[0];
        if(show){
            error_block.style.display="block";
            error_block.textContent=value;
        }
        else{
            error_block.style.display="none";
            error_block.textContent=value;
        }

    }
 





//-------------------------------Cancel Download-------------------------------------------------------
    function abortDownload(zone){
        if(zone.__reader){
            zone.__reader.abort(); 
        }
        zone.__objectUrl=null;
    }

//-------------------------------Show operation Blocks-------------------------------------------------
    function populatePreview(zone)
    {   
        const file = zone.selectedFile;
        const url = zone.__objectUrl;
        console.log(url);
        if (!file) return;
        const kind = detectKind(file);
        const operationBlocks = document.querySelectorAll('.operation');
        operationBlocks.forEach(block => {
           if (kind==="image") {
                if(block.id==="encrypt-image"){
                     block.style.display="flex";
                     const img=document.getElementById("original-image-content");
                     if(img){
                        img.src = url;
                    }   
                     
                }
                else {
                       block.style.display="none";
                   
                }
            } 
            else if (kind==="audio"){
                if(block.id==="encrypt-audio"){
                     block.style.display="flex";
                     const audioTrack=document.getElementById("original-audio-content");
                     if(audioTrack){
                        audioTrack.src = url;
                     }
                }
                else {
                       block.style.display="none";
                   
                }
                
            }
            else if (kind==="other"){
                 if(block.id==="encrypt-file"){
                     block.style.display="flex";
                     const a=document.getElementById("link-download-original")
                     if (a) { a.href = url; a.download = file.name;}
                           
                }
                else {
                       block.style.display="none";
                }

            }
             blockUnblockHeaderElements(false);
        });       
        
    }
//-------------------------------Get Current Visible Operation Block-------------------------------------------------
    function getVisibleBlock(){
        const operationBlocks = document.querySelectorAll('.operation');
        for (const block of operationBlocks){
            if(window.getComputedStyle(block).display=="flex"){return block}
        }
      
    }
//-------------------------------Read file-------------------------------------------------------------
    function readFile(zone, file){
        if(file.size > MAX_BYTES){
            setError(zone,"Файл занадто великий за розміром!", true);
            return
        }
        blockUnblockHeaderElements(true);
        revokeObjectUrl(zone)
        zone.selectedFile=file
      
        setError(zone,"",false);
        const reader = new FileReader();
        zone.__reader = reader;
        reader.onload =  () =>{            
            zone.__fileBuffer = reader.result;
            zone.__reader = null;
            zone.__objectUrl = URL.createObjectURL(file);
            console.log("File in Buffer");
            setProgressBar(zone, 100 , true);
            setTimeout(()=>{setProgressBar(zone, 0, false)}, 500);
            populatePreview(zone);
        }
        reader.onprogress = (e) =>{
            if (e.lengthComputable){
                const pct = Math.round((e.loaded/ e.total) * 100);
                setProgressBar(dropzone,pct, true);
            }  
        }
        reader.onabort = (e) =>{
            setProgressBar(zone, 0, false)  
            setError(zone, "Читання файлу скасовано", true);
             blockUnblockHeaderElements(false);
            
        }
        reader.onerror = (e) =>{
            setProgressBar(zone, 0, false)  
            setError(zone, "Помилка при читанні", true);
            blockUnblockHeaderElements(false);
        }
        reader.readAsArrayBuffer(file);
    }
//-------------------------------Upload File on Server--------------------------------------------------
    function getUrlByBlockIdAndProcessType(id, operation){
        let process_type = ""
        let chosen_URL=""
        if(id==="encrypt-image"){
             chosen_URL = (operation == "Encrypt") ? ENCRYPT_IMAGE_URL : DECRYPT_IMAGE_URL;
             process_type ="image"

        }
        else if(id=="encrypt-audio"){
             chosen_URL = (operation == "Encrypt") ? ENCRYPT_AUDIO_URL : DECRYPT_AUDIO_URL;
             process_type = "audio"                
        }
        else{
            chosen_URL = (operation == "Encrypt") ? ENCRYPT_FILE_URL : DECRYPT_FILE_URL;
            process_type ="file"
        }
            return { process_type, chosen_URL };
    }

    function uploadStoredFile(zone, operation){
       
        const file = zone.selectedFile;
        const formData = getDataFromActiveParametersFormANDHeader();
        const dataBlock = getVisibleBlock();
        let chosen_URL = "";
        let process_type = "";
             
        setErrorInDataBlock(dataBlock, "", false);
        formData.append("operation", operation);
        if(file){
            let result =getUrlByBlockIdAndProcessType(dataBlock.id, operation)
            chosen_URL = result.chosen_URL;
            process_type = result.process_type
            formData.append("process_type", process_type) 
            formData.append("file", file)
        }
        const xhr=new XMLHttpRequest();
        zone.__xhr=xhr;   
         xhr.open("POST", chosen_URL, true);
          
        xhr.responseType = 'blob';
        xhr.upload.addEventListener("progress", (e)=>{
            if(!e.lengthComputable) return
            let pct = Math.round((e.loaded/e.total)*100)
            setProgressBarInDataBlock(dataBlock, pct, true);
        })
        xhr.addEventListener("load", ()=>{
            if(xhr.status===300 || xhr.status===200){
                const blob = xhr.response;
                bindProcessedFile(blob);
                setProgressBarInDataBlock(dataBlock, 100, true);
                setTimeout(()=>{ setProgressBarInDataBlock(dataBlock, 0, false)}, 500);

            }
            else{
                setProgressBarInDataBlock(dataBlock, 0, false)
                setErrorInDataBlock(dataBlock,"Помилка при завнтаженні даних на сервер.", true);
            }
        })

        xhr.addEventListener("error", ()=>{
            setErrorInDataBlock(dataBlock,"Помилка при відправці даних на сервер.", true);
        })
        xhr.send(formData);
       

    }     
    
//-------------------------------Upload Text on Server--------------------------------------------------   
    function uploadText(zone, operation){
        const originalText = document.getElementById("original-text-content").value;
        const processedText = document.getElementById("processed-text-content");
        const textBlock = document.getElementById("encrypt-text");
        setErrorInDataBlock(textBlock, "", false);
        const formData = getDataFromActiveParametersFormANDHeader();        
        formData.set("operation", operation);
         formData.append("process_type", "text")  
        if(originalText){
            formData.set("text", originalText)
        }
        const xhr=new XMLHttpRequest();
        zone.__xhr=xhr;   
        if(operation=="Encrypt"){
            xhr.open("POST", ENCRYPT_TEXT_URL, true);
        }
        else if(operation=="Decrypt"){
             xhr.open("POST", DECRYPT_TEXT_URL, true);
        }

        xhr.upload.addEventListener("progress", (e)=>{
            if(!e.lengthComputable) return
            let pct = Math.round((e.loaded / e.total)*100)
            setProgressBarInDataBlock(textBlock, pct, true);
        })
        xhr.addEventListener("load", ()=>{
            if(xhr.status===300 || xhr.status===200){                
                const response=JSON.parse(xhr.responseText);
                processedText.value=response.processed_text;
                setProgressBarInDataBlock(textBlock, 100, true);
                setTimeout(()=>{ setProgressBarInDataBlock(textBlock, 0, false)}, 500);

            }
            else{
                  setErrorInDataBlock(textBlock,"Помилка при завнтаженні даних на сервер.", true);
            }
        })

        xhr.addEventListener("error", ()=>{
              setErrorInDataBlock(textBlock,"Помилка при відправці даних на сервер.", true);
        })
        xhr.send(formData);
        

    }  
//----------------------------Download buttons functions---------------------------------------------------------
function setupDownloadButtons() {
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
    else  if (blockId =="encrypt-image") base = "processed-audio";
    else if (blockId =="encrypt-file") base = "processed-file";
    let ext = "bin";
    if (type === "image") ext = "png";
    else if (type === "audio") ext = "wav";  
    else if (type === "file") ext = "bin";
    return `${base}-${Date.now()}.${ext}`;
}   
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


