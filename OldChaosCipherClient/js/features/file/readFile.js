import { MAX_BYTES } from "../../config.js";
import { revokeObjectUrl } from "../dropzone/revokeObjectUrl.js";
import { setError, setProgressBar } from "../dropzone/setProgAndErrDrZone.js";
import { blockUnblockHeaderElements } from "../header/headerBlock.js";
import {setProgressBarInDataBlock,setErrorInDataBlock} from "../dataBlock/setProgressAndErrorBlock.js";
import { populatePreview } from "../dataBlock/populatePreview.js";

export  function resetFileSelection(zone){
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

export function bindProcessedFile(file){
        if(!file) return
        const operationBlocks = document.querySelectorAll(".operation");
        operationBlocks.forEach(el =>{
            if(el.style.display=="flex"){
                if(el.id==="encrypt-image"){
                    el.__fileBuffer=file;
                    el.__objectUrl=URL.createObjectURL(file);
                    const url=el.__objectUrl;
                    const img=document.getElementById("processed-image-content");
                    
                     if(img){
                        img.src = url;
                        img.style.display="block";

                     }   
                     
                }
                
                if(el.id==="encrypt-audio"){
                    el.__fileBuffer=file;
                    el.__objectUrl=URL.createObjectURL(file);
                    const url=el.__objectUrl;
                    const audioTrack=document.getElementById("processed-audio-content");
                     if(audioTrack){
                        audioTrack.src = url;
                    }   
                     
                }
                if(el.id==="encrypt-file"){
                    el.__fileBuffer=file;
                    el.__objectUrl=URL.createObjectURL(file);
                    const url=el.__objectUrl;
                    const a=document.getElementById("link-download-processed")
                    if (a) { a.href = url; a.download = file.name;}
                     
                }




            }

        })
        

}
export function readFile(zone, file){
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
                setProgressBar(zone, pct, true);
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