export function setProgressBarInDataBlock(zone,value, show){
        const progressBlock = zone.getElementsByClassName("encrypt-progress")[0];
        const progressBar = zone.getElementsByClassName("encrypt-progress-bar")[0];
        if (!progressBlock || !progressBar) return;

        if(show){
            progressBlock.style.display="block";
            progressBar.style.display="block";
            let v=Math.max(0, Math.min(100, value));
            progressBar.style.width=`${v}%`
            /*progressBar.setAttribute('aria-valuenow', String(Math.round(widht)));*/

        }
        else{
            progressBlock.style.display="none";
            progressBar.style.display="none";
        }
    }

export function setErrorInDataBlock(zone,value, show){
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
