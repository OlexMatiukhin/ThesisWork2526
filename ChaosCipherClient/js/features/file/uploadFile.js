//-------------------------------Upload File on Server--------------------------------------------------
import { getDataFromActiveParametersFormANDHeader } from "../formData/getFromData.js";
import { getVisibleBlock } from "../dataBlock/getVisibleBlock.js";
import { getUrlByBlockIdAndProcessType } from "./getUrlByBlockIdAndProcessType.js";
import { setErrorInDataBlock, setProgressBarInDataBlock } from "../dataBlock/setProgressAndErrorBlock.js";
import { bindProcessedFile } from "./readFile.js";    
import { blockUnblockHeaderElements } from "../header/headerBlock.js";   
export function uploadStoredFile(zone, operation){
        const file = zone.selectedFile;
        if (!file){
            setErrorInDataBlock(zone, "Оберіть файл перед відправкою", true)
            return;
        }

        const formData = getDataFromActiveParametersFormANDHeader();
        if(!formData) return
        const dataBlock = getVisibleBlock();
        let chosen_URL = "";
        let data_type = "";
        if (!dataBlock) return     
        setErrorInDataBlock(dataBlock, "", false);
        //formData.append("operation", operation);
        let result =getUrlByBlockIdAndProcessType(dataBlock.id, operation)
        chosen_URL = result.chosen_URL;
        data_type = result.data_type
        formData.append("data_type", data_type) 
        formData.append("file", file)

        const xhr=new XMLHttpRequest();
        zone.__xhr=xhr;   
         xhr.open("POST", chosen_URL, true);
        blockUnblockHeaderElements(true);
        xhr.responseType = 'blob';
        xhr.upload.addEventListener("progress", (e)=>{
            if(!e.lengthComputable) return
            let pct = Math.round((e.loaded/e.total)*100)
            setProgressBarInDataBlock(dataBlock, pct, true);
        })
        xhr.addEventListener("load", ()=>{
            if(xhr.status >= 200 && xhr.status < 300){
                const blob = xhr.response;
                // Extract extension from Content-Disposition: filename="processed.docx"
                const disposition = xhr.getResponseHeader("Content-Disposition") || "";
                const match = disposition.match(/filename[^;=\n]*=["']?[^.]+\.([^"';\n]+)/);
                const ext = match ? match[1] : null;
                bindProcessedFile(blob, ext);
                setProgressBarInDataBlock(dataBlock, 100, true);
                setTimeout(()=>{ setProgressBarInDataBlock(dataBlock, 0, false)}, 500);

            }
            else{
                blockUnblockHeaderElements(false);
                setProgressBarInDataBlock(dataBlock, 0, false)
                setErrorInDataBlock(dataBlock,"Помилка при завнтаженні даних на сервер.", true);
            }
        })

        xhr.addEventListener("error", ()=>{
            blockUnblockHeaderElements(false);
            setProgressBarInDataBlock(dataBlock, 0, false)
            setErrorInDataBlock(dataBlock,"Помилка при відправці даних на сервер.", true);
        })
        xhr.addEventListener("abort", () => {
        blockUnblockHeaderElements(false);
        setProgressBarInDataBlock(dataBlock, 0, false);
        setErrorInDataBlock(dataBlock, "", false);
        });
        xhr.send(formData);
        
       

}     
    