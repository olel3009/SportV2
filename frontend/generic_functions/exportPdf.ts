import path from 'path';
type pdfReturn ={
    message:string,
    path:string
}
export async function createPdf(ids:number[]): Promise<string> {
    let res:Response;
    if(ids.length==0){
        console.log("no input...");
        return '';
    }else if(ids.length==1){
            res = await fetch("http://127.0.0.1:5000/athletes/"+ids[0]+"/export/pdf?year=2025", {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error(`API call failed: ${res.status}`);
        }
    }else{
        let appendage="?ids=";
        appendage+=ids.join(',');
        let fetchlink="http://127.0.0.1:5000/gruppen/export/pdf"+appendage;
        console.log(fetchlink);
        res = await fetch(fetchlink, {
            cache: "no-store"
        });
        if (!res.ok) {
            throw new Error(`API call failed: ${res.status}`);
        }

    }

    const data: pdfReturn = await res.json();

    //Mapping
    let location= data.path;

    console.log(location);
    return location;
}

export async function downloadPdf(ids:number[]): Promise <boolean>{
    let filePath = await createPdf(ids);
    const link = document.createElement('a');
    link.href = filePath;  // matches your express.static mount
    console.log(link.href)
    link.download = path.basename(filePath);;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
}