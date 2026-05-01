import { detectKind } from "./detectKind.js";
import { blockUnblockHeaderElements } from "../header/headerBlock.js";

export function populatePreview(zone)
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
                     if (a) { 
                        a.href = url; 
                        a.download = file.name;
                    
                    }         
                    block.dataset.originalFilename = file.name;                  
                }
                else {
                       block.style.display="none";
                }

            }             
        });   
        blockUnblockHeaderElements(false);    
        
    }