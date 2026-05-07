export function setInputTextError(errorMessage,status) {
    if(status){
        const textArea = document.getElementById("original-text-content");
        textArea.classList.add("error");
        textArea.value = errorMessage
    }
    else{
        const textArea = document.getElementById("original-text-content");
        textArea.classList.remove("error");
        textArea.value = "";
    }
   
}  
export function setResultInputError(errorMessage, status) {
    const textArea = document.getElementById("processed-text-content");
    if (status){
    textArea.classList.add("error");
    textArea.value = errorMessage
    }
    else{
      textArea.classList.remove("error");
      textArea.value = "";
    }
  
}  