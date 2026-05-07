export function abortDownload(zone){
        if(zone.__reader){
            zone.__reader.abort(); 
        }
        zone.__objectUrl=null;
}
