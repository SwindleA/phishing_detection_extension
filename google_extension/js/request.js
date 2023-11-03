

export class Request{
    constructor(){
        this.serverURL = 'http://127.0.0.1:5000/';//'https://quickstart-image-hd7m2r3zlq-uc.a.run.app';//;
       
    }
    async get(url){
        
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
    async post(url, payload) {
        try {
            const response = await fetch(this.serverURL + url, {
                method: 'POST',
                headers: new Headers({'content-type': 'application/json'}),
                mode: 'cors',
                body: JSON.stringify(payload),
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    }

     
}