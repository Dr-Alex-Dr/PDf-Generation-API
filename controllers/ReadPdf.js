import { PdfReader } from "pdfreader";
import axios from "axios";
import fs from "fs";
import { createPdf } from "./CreatePdf.js";
import { uploadFile } from "./UploadFile.js";
import { deleteFile } from "./DeleteFile.js";

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
    const englishHashtags = []
    const russiansHashtags = []

    try {
        await downloadFile(url, `./Files/${fileName}.pdf`);
        let data = await readPdf(`./Files/${fileName}.pdf`);
        deleteFile(`./Files/${fileName}.pdf`);

        shuffleArray(data);

        for(let word of data) {
            if (/^#[а-яА-Я0-9_]+$/.test(word)) {
                russiansHashtags.push(word);
            }
            if (/^#[a-zA-Z0-9_]+$/.test(word)) {
                englishHashtags.push(word);
            }
        }
        
        if (russiansHashtags.length === 0 || englishHashtags.length === 0) {
            deleteFile(`./Files/${fileName}.pdf`);
            return 'Ой, Кажется что-то пошло не так';
        }
        
        await createPdf(russiansHashtags, englishHashtags, `./Files/${fileName}.pdf`);

        const linkFileGoogleDrive = await uploadFile(`${fileName}.pdf`, `./Files/${fileName}.pdf`);

        deleteFile(`./Files/${fileName}.pdf`);

        return linkFileGoogleDrive;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

export { mixerHashtags }






