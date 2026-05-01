  export function resetTextSelection(){    
        const textBlock = document.getElementById("encrypt-text");
        const originalTextArea= textBlock.getElementsByClassName("original-text-content")[0];
        const processedTextArea= textBlock.getElementsByClassName("processed-text-content")[0];
        textBlock.style.display="none";  
        originalTextArea.value="";
        processedTextArea.value="";
            
        
    }
