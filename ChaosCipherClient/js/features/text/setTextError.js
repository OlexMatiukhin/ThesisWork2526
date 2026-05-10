export function setInputTextError(errorMessage,status) {
    const textArea = document.getElementById("original-text-content");
    if(status){      
        textArea.classList.add("textarea-error");
        textArea.value = errorMessage
    }
    else{
        textArea.classList.remove("textarea-error");
        textArea.value = "";
    }
   
}  
export function setResultInputError(errorMessage, status) {
    const textArea = document.getElementById("processed-text-content");
    if (status){
    textArea.classList.add("textarea-error");
    textArea.value = errorMessage
    }
    else{
      textArea.classList.remove("textarea-error");
      textArea.value = "";
    }
  
}  