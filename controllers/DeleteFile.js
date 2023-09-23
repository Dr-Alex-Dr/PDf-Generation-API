import fs from "fs"

export async function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            resolve('Файл удален');
            reject(err)
        })
    })
}