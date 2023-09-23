import fs from "fs";
import { google } from "googleapis";

const KEYFILEPATH = './credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});

const driveService = google.drive({ version: 'v3', auth });

async function uploadFile(fileName, urlFile) {
    return new Promise(async (resolve, reject) => {
        try {
            const fileMetadata = {
                name: fileName,
                parents: ['190-uiAk6L0RZAuQaOJv8b1nn9TkrD2zr']
            };

            const media = {
                mimeType: 'application/pdf',
                body: fs.createReadStream(urlFile)
            };

            const response = await driveService.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, webViewLink' 
            });

            const fileId = response.data.id;
            const webViewLink = response.data.webViewLink;

            // Устанавливаем доступ "для всех" к файлу
            await driveService.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            resolve(webViewLink);
        } catch (error) {
            reject(error);
        }
    });
}

export { uploadFile };
