require('dotenv').config();
const readline = require('readline').promises; // this to take input from the CLI .

const { GoogleGenAI } = require("@google/genai");
const { text } = require('stream/consumers');
const { type } = require('os');
const { exit } = require('process');

const ai = new GoogleGenAI({ apiKey: process.env.YOUR_API_KEY });

// Basically will hold all the past interactions with the user . 
/* It is a empty array of objects of the past chat !!  */
let chatHistory = []

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


async function chat() {

  const question = await rl.question('You: ')

  if(question.toLowerCase() == 'exit'){
    console.log("🤖 AI:👋 Bye !! Have a nice day !!");
      rl.close();
      return
      
  }

  chatHistory.push({
    role : "user",
    parts : [
      {
        text : question,
        type:"text"
      }
    ]
  })


/* 
response type object 

keys :
model : model-name ,
content : which is from the user end 


*/
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chatHistory,
  });

  // response.candidates[0].content.parts[0].text) -- to access the data given by the AI !! 
  const aiText = response.candidates[0].content.parts[0].text


  console.log("🤖 AI:",aiText);

  chatHistory = [...chatHistory, {
      role : "Model",
      parts : [
        {
          text : aiText,
          type : "text"
        }
      ]
  }]


  chat()
  
}

chat()