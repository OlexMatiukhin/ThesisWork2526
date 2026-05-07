import {setErrorInDataBlock, setProgressBarInDataBlock} from "../dataBlock/setProgressAndErrorBlock.js";
import { cancelUpload } from "./cancelUpload.js";
export function resetTextSelection(){    
      const textBlock = document.getElementById("encrypt-text");
      cancelUpload(textBlock); 
      setErrorInDataBlock(textBlock,"",false);
      setProgressBarInDataBlock(textBlock,0,false);
      const originalTextArea= textBlock.getElementsByClassName("original-text-content")[0];
      const processedTextArea= textBlock.getElementsByClassName("processed-text-content")[0];
      textBlock.style.display="none";  
      originalTextArea.value="";
      processedTextArea.value="";
  
      
  }
