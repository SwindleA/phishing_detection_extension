

export class Request{
    constructor(){
      this.url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
      this.OPENAI_API_KEY=''
    }
    async post(data){
        const headers = {
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          };
        try{
            const response = await fetch(this.url,{
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            console.log("Response: ",response);
        }catch (error) {
                 console.error(error);
        }
    }
    async post(url, payload) {
    //Example, not actual
        //   try {
    //     const response = await fetch(this.serverURL + url, {
    //       method: 'POST',
    //       headers: new Headers({'content-type': 'application/json'}),
    //       mode: 'cors',
    //       body: JSON.stringify(payload),
    //     });
    //     return response;
    //   } catch (error) {
    //     console.error(error);
    //   }
    }
  
}