

export class Request{
    constructor(){
        console.log("Request constructor");
      this.url = 'https://api.openai.com/v1/chat/completions';
      this.OPENAI_API_KEY=

       
    }
    async post(data){
        console.log("asking GPT");

        

        const headers = {
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          };

        try{
            const response = await fetch(this.url,{
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: data }],
                  }),
            });
            const g = await response.json();
            console.log("Response: ",g.choices[0].message.content);
        }catch (error) {
                 console.error(error);
        }
    }
     
}