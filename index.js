import express from "express";
import { parseHashtags } from "./controllers/Transcoding.js";
import { mixerHashtags } from "./controllers/ReadPdf.js";

const app = express();
const port = 3000;

app.use(express.json());


app.post('/api/transcoding', async (req, res) => {
    const { urlFile } = req.body;

    let gooleDiriveFileLink = await parseHashtags(urlFile, Math.floor(Math.random() * 100000))
    
    console.log(gooleDiriveFileLink)
    res.json({ urlFile: gooleDiriveFileLink });
});

app.post('/api/mixer', async (req, res) => {
    const { urlFile } = req.body;

    let gooleDiriveFileLink = await mixerHashtags(urlFile, Math.floor(Math.random() * 100000))
    
    console.log(gooleDiriveFileLink)
    res.json({ urlFile: gooleDiriveFileLink });
});
  
app.listen(port, "localhost", () => {
    console.log(`Сервер запущен на порту ${port}`);
});