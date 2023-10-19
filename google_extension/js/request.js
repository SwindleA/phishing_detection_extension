

export class Request{
    constructor(){
        this.serverURL = 'http://127.0.0.1:5000/'//'https://quickstart-image-hd7m2r3zlq-uc.a.run.app';//;
       
    }
    async get(url){
        console.log("asking GPT");
        try {
            const response = await fetch(this.serverURL + url,{
                headers: new Headers({'content-type': 'application/json'}),
                mode: 'cors'
            });
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }
     
}