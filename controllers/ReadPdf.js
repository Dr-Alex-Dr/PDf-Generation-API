import { PdfReader } from "pdfreader";
import axios from "axios";
import fs from "fs";
import { createPdf } from "./CreatePdf.js";
import { uploadFile } from "./UploadFile.js";
import { deleteFile } from "./DeleteFile.js";

const englishHashtags = []
const russiansHashtags = []

const forbiddenWords = ['война', 'сво', 'украина', 'украин']

async function downloadFile(url, localPath) { 
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(localPath, response.data); 
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

async function readPdf(filePath) {
    return new Promise((resolve, reject) => {
        const words = []
        new PdfReader().parseFileItems(filePath, (err, item) => {
            if (err) console.error("error:", err);
            else if (!item) resolve(words)
            else if (item.text) words.push(item.text)
          });
    })
}


async function mixerHashtags(url, fileName) {
    try {
        await downloadFile(url, `./Files/${fileName}.pdf`);
        let data = await readPdf(`./Files/${fileName}.pdf`);
        deleteFile(`./Files/${fileName}.pdf`);
        
        shuffleArray(data);

        for(let word of data) {
            filterHashtagsLanguage(word)
        }
        
        let allHashtags = [...russiansHashtags, ...englishHashtags];

        if (allHashtags.length === 0) {
            deleteFile(`./Files/${fileName}.pdf`);
            return 'Ой, Кажется что-то пошло не так';
        }
        
        await createPdf(allHashtags, `./Files/${fileName}.pdf`);

        const linkFileGoogleDrive = await uploadFile(`${fileName}.pdf`, `./Files/${fileName}.pdf`);

        deleteFile(`./Files/${fileName}.pdf`);

        return linkFileGoogleDrive;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

function filterHashtagsLanguage(hashtag) {
    if (/^#[а-яА-Я0-9_]+$/.test(hashtag)) {
        russiansHashtags.push(hashtag);
    }
    if (/^#[a-zA-Z0-9_]+$/.test(hashtag)) {
        englishHashtags.push(hashtag);
    }
}

function filterHashtagsLength(array) {
    let quantityEachElement = array.reduce((stack, value) => {
        return stack[value] ? stack[value]++ : stack[value] = 1, stack;
    }, {});
  
    return Object.keys(quantityEachElement).filter(num => quantityEachElement[num] > 9);
}

function filterHashtagsForbiddenWords(hashtag) {
    let word = hashtag.split('#')[1];
    
    for (let item of forbiddenWords) {
        if (item.toLowerCase() === word || word.indexOf(item) !== -1) {
            return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

export { mixerHashtags }






