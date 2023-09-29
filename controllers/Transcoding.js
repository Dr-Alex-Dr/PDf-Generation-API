import axios from "axios";
import fs from "fs";
import { createPdf } from "./CreatePdf.js";
import { uploadFile } from "./UploadFile.js";
import { deleteFile } from "./DeleteFile.js";

const forbiddenWords = ['война', 'сво', 'украина', 'украин', 'ukraine', 'конкурс', 'игил', 'порно']

async function downloadFile(url, localPath) { 
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(localPath, response.data); 
    }
    catch(error) {
        console.error(error);
    }
}

async function readFile(localPath) {
    try {
      const data = await fs.promises.readFile(localPath, { encoding: 'utf8' });
      return data;
    } catch (error) {
      console.error(error);
    }
}


async function parseHashtags(url, fileName) {
    const englishHashtags = []
    const russiansHashtags = []

    try {
        await downloadFile(url, `./Files/${fileName}.txt`);
        let data = await readFile(`./Files/${fileName}.txt`);

        let lines = data.split('\n');

        for (let line of lines) {
            let arrayWordsInLine = line.match(/#(?:\w|[\u0400-\u04FF])+/g);

            if (arrayWordsInLine) {
                for (let word of arrayWordsInLine ) {
                    if (filterHashtagsForbiddenWords(word)) {
                        if (/^#[а-яА-Я0-9_]+$/.test(word)) {
                            russiansHashtags.push(word);
                        }
                        if (/^#[a-zA-Z0-9_]+$/.test(word)) {
                            englishHashtags.push(word)
                        }
                    }   
                }
            }   
        }

        const filteredRussianHashtags  = filterHashtagsLength(russiansHashtags);
        const filteredEnglishHashtags  = filterHashtagsLength(englishHashtags);

        shuffleArray(filteredRussianHashtags);     
        shuffleArray(filteredEnglishHashtags);

        if (filteredRussianHashtags.length === 0 || filteredEnglishHashtags.length === 0) {
            deleteFile(`./Files/${fileName}.txt`);
            return {
                fileUrl: false,
                error: 'В файле отсутствуют подходящие хэштеги'
            }
        }

        
        await createPdf(filteredRussianHashtags, filteredEnglishHashtags, `./Files/${fileName}.pdf`);

        const linkFileGoogleDrive = await uploadFile(`${fileName}.pdf`, `./Files/${fileName}.pdf`);

        deleteFile(`./Files/${fileName}.pdf`);
        deleteFile(`./Files/${fileName}.txt`);

        return {
            fileUrl: linkFileGoogleDrive,
            error: false
        }
    }
    catch(error) {
        console.error(error);
      
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


export { parseHashtags }


