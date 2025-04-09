dotenv.config();
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path'

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const para=
  "Cyber security is like a safety shield for our computers and the internet. Imagine your computer as your house and cyber security as the lock on your front door. It keeps your house safe from thieves, right? Similarly, cyber security keeps your computer safe from bad people, known as hackers, who want to steal important information. This information could be your favorite game’s high score or your parents' bank details. Just like we use keys to unlock our house, we use passwords to unlock our computers or online accounts. But, just as you should not share your house keys with strangers, you should also not share your passwords. Sometimes, hackers can trick you into opening a harmful email or click on a dangerous link. This is why we should be careful about what we click on the internet. Cyber security uses special computer programs that act like super-strong locks and guards, always watching and protecting our information. So remember, cyber security is our friend that helps us use the internet safely and have lots of fun online without worrying about hackers.";

async function contextGenerator() {
  const chatSession = model.startChat();

  const context = await chatSession.sendMessage(`
you are a meme creator , you will be provided context ${para} on which you have to create a meme , you will create meme using imgflip , in order to create meme , i want only 2 values , one is text0 and another one is text1 following is the template id and according meme
217743513 uno rev text0 = written on uno card text1=text written on the guy who draws

129242436 text0 = written on change my mind

6235864(Johnny Depp And Little Kid Crying) text0 = what kid says , text1=what that man says

135256802(Epic Handshake(	arm wrestling, holding hands, grasping hands, epic hand shake, black white arms agreement)) text0=white hand text1=black hand

80707627(sad pablo escobar meme) text0=top pablo image text1=left one pablo image 

WHAT YOU HAVE TO DO : YOU HAVE TO GENERATE THE CONTEXT OF THE MEME , LIKE YOU HAVE TO SELECT ONLY ONE BEST TEMPLATE AND YOU HAVE TO EXPLAIN ABOUT THE MEME IN ONE PARA , AND YOU WILL ALSO TELL WHAT IS text0(it can be a phrase or may be a word) and text1(it can be a phrase or may be a word) ACCORDING TO THAT CONTEXT , AND YOU SHOULD BE FUNNY AF, LIKE THE FUNNIEST YOU CAN BE.


`);

  return context.response.text();
}

const c = await contextGenerator();

export default async function gentext0() {
  const chatSession = model.startChat();

  const result =
    await chatSession.sendMessage(`You will get context ${c}from my meme employee , you have to return me the best text0 from that paragraph , no other word or a phrase. just that text0 phrase or word.
`);

  return result.response.text();
}

const text0 = await gentext0();

async function gentext1() {
  const chatSession = model.startChat();

  const result =
    await chatSession.sendMessage(`You will get context${c} from my meme employee and the best text0 ${text0} as well, you have to return me text1 from that paragraph , no other word or a phrase. just that text1 phrase or word.

`);

  return result.response.text();
}

const text1 = await gentext1();

async function gettempid() {
  const chatSession = model.startChat();

  const result =
    await chatSession.sendMessage(`You will get context ${c} ${text0} ${text1} from my meme employee , you have to return me template id from that paragraph , nothing else than template id (example is template id is 123456) then only write 123456


`);

  return result.response.text();
}

const template_id = await gettempid();

async function generateMeme() {
  const response = await axios.post(
    "https://api.imgflip.com/caption_image",
    null,
    {
      params: {
        template_id: `${template_id}`,
        username: `${process.env.IMGFLIP_USERNAME}`,
        password: `${process.env.IMGFLIP_PASSWORD}`,
        text0: `${text0}`,
        text1: `${text1}`,
      },
    }
  );
  return response.data.data.url;
}

const memeuri = await generateMeme();

const fileName = path.basename(memeuri); 

const savePath = path.resolve('./memes', fileName);

const downloadImage = async (url, filepath) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream' 
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading the image:', error);
    }
};

downloadImage(memeuri, savePath).then(() => {
    console.log('Image downloaded successfully!');
});