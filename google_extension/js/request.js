

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
        console.log("post")
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
            return "error"
        }
    }

    /*async getEmailBody(account_id,message_id,token){
        try{
            const response = await fetch(
                'https://gmail.googleapis.com/gmail/v1/users/'+account_id+'/messages/'+message_id+'?key='+this.API_KEY,
                {headers: new Headers({
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json','content-type': 'application/json'}),
                    compressed : true,} )
        }catch(error){
            console.error(error);
        }
    }*/

     
}