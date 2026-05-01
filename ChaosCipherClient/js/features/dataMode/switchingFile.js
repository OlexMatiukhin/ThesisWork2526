import { resetTextSelection } from "../dataBlock/resetTextSelection.js";
import { resetFileSelection } from "../file/readFile.js";
export function initDataModeSwitcher() {
const typeInfoSelect = document.getElementById('data');
        const operationBlocks = document.querySelectorAll('.operation');
        function updateDataVisibility() {
        const selectedValue = typeInfoSelect.value;
        operationBlocks.forEach(block => {
           if (`${selectedValue}`==="text") {
                if(block.id==="encrypt-text"){
                     const dropZone=document.getElementById("drop-zone");
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

     updateDataVisibility()
}
