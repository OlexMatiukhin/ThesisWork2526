export function blockUnblockHeaderElements(block){
              const headerSelects = document.querySelectorAll('header select');
             headerSelects.forEach(el =>{
                if(block){
                    el.disabled=true;
                }
                else{
                    el.disabled=false;
                }

             })

        
}