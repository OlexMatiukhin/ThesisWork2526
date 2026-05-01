export function revokeObjectUrl (zone){
        if (zone.__objectUrl){
            try{URL.revokeObjectURL(zone.__objectUrl);} catch{}
        }
        zone.__objectUrl=null;
}