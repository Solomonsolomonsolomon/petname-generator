require('dotenv').config()
const app=require('express')();
const express=require('express');
const port=1284;
const path=require('path');
const morgan=require('morgan');
const cors=require('cors');


app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'views')))
app.use(express.static(path.join(__dirname,'..')))
app.use(express.static(__dirname))

app.set('view engine','ejs').set('views','views')

let result;

 //routes
app.route('/')
.get((req,res)=>{
  res.render('index',{result})
})
.post(async(req,res)=>{
    console.log(req.body)
    const { Configuration, OpenAIApi }=require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createCompletion({
  model: "text-davinci-002",
  prompt: generatePrompt(req.body.animal),
  temperature: 0.6,
});
//res.status(200).json({ result: completion.data.choices[0].text });

  result= completion.data.choices[0].text

console.log(result)
res.redirect('/')
//
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `${req.body.query}.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}


//

})
app.get('/help',(req,res)=>{
  res.sendFile(path.join(__dirname,'404','help.html'))
})
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,'404','404.html'))
})
app.listen(port,()=>{console.log('started')})