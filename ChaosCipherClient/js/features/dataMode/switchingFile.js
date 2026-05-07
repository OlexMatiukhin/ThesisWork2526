import { resetTextSelection } from "../dataBlock/resetTextSelection.js";
import { resetFileSelection } from "../file/readFile.js";
import { setProgressBarInDataBlock, setErrorInDataBlock } from "../dataBlock/setProgressAndErrorBlock.js";
import { setResultInputError, setInputTextError } from "../text/setTextError.js";
export function initDataModeSwitcher() {
const typeInfoSelect = document.getElementById('data');
        const operationBlocks = document.querySelectorAll('.operation');
        const modeSelect = document.getElementById('mode');
        function updateDataVisibility() {
        const selectedValue = typeInfoSelect.value;
        operationBlocks.forEach(block => {
           if (`${selectedValue}`==="text") {
               modeSelect.disabled=false;
                if(block.id==="encrypt-text"){
                     const dropZone=document.getElementById("drop-zone");
                     resetFileSelection(dropZone);
                     block.style.display="block";

                }
                else {
                       block.style.display="none";
                       resetFileSelection(dropZone);
                      
                   
                }
            } 
            else if (`${selectedValue}`==="file"){
                resetTextSelection();
               modeSelect.disabled=true;
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

     updateDataVisibility()
}
