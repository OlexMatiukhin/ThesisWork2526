    export function detectKind (file){
        const type = (file.type || "").toLowerCase();
        //#if (type.startsWith("image/")) return "image";
        //if (type.startsWith("audio/")) return "audio";
        const name = file.name.toLowerCase() || "";
        if (name.match(/\.(png|jpeg|gif|bmp|webp|svg|tiff?)$/)) return 'image'
        if (name.match(/\.(wav?)$/)) return 'audio'
        return "other"
    }