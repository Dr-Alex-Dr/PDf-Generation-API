import express from "express";
import { parseHashtags } from "./controllers/Transcoding.js";
import { mixerHashtags } from "./controllers/ReadPdf.js";
import { authentication } from "./controllers/Authentication.js";
import { pool } from './db.js';

const app = express();
const port = 3000;
const conn = pool.promise();

app.use(express.json());


app.post('/api/transcoding', async (req, res) => {
    
    const { urlFile } = req.body;

    if (urlFile) {
        let gooleDiriveFileLink = await parseHashtags(urlFile, Math.floor(Math.random() * 100000))
        console.log(gooleDiriveFileLink)
        res.json(gooleDiriveFileLink);    
    } else {
        res.json( {
            fileUrl: false,
            error: 'Невозможно обработать файл. Пожалуйста, проверьте его размер'
        })
    }
});

app.post('/api/mixer', async (req, res) => {
    const { urlFile } = req.body;
    console.log(urlFile)

    if (urlFile) {
        let gooleDiriveFileLink = await mixerHashtags(urlFile, Math.floor(Math.random() * 100000))
        res.json(gooleDiriveFileLink);
    } else {
        res.json( {
            fileUrl: false,
            error: 'Невозможно обработать файл. Пожалуйста, проверьте его размер'
        })
    }
});

app.post('/api/authentication', (req, res) => {
    const { userId } = req.body;
    console.log(userId, authFlag)

    let authFlag = authentication(userId);
    res.json({authFlag})
})


app.listen(port, "localhost", () => {
    console.log(`Сервер запущен на порту ${port}`);
});