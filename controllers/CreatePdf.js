import { createWriteStream } from 'node:fs';
import PDFDocument from 'pdfkit';


async function createPdf(words, filePath) {
    const doc = new PDFDocument();

    doc.pipe(createWriteStream(filePath));

    const countWordInColumn = 30;
    const indentBetweenColumns = 170;
    const lineHeight = 11;

    const x = 80;
    const y = 40;

    let index = 0;
    let initialStep = 0;
    let countPages = Math.ceil(words.length / (countWordInColumn * 6))

    for (let page = 0; page < countPages; page++) {
        for (let row = 0; row < 2; row++) {
            for (let column = 0; column < 3; column++) {
                for (let i = index; i < words.length + 1; i++) {             
                    doc
                    .fontSize(8)
                    .font('./Fonts/Roboto-Regular.ttf')
                    .text(words[i], (x + (column * indentBetweenColumns)), y + (initialStep * lineHeight) + row * (countWordInColumn * lineHeight + 20))
                    
                    initialStep++;
                    if (initialStep === countWordInColumn) {
                        index = i;
                        initialStep = 0;
                        break;
                    }

                    if (i === words.length) {
                        return new Promise((resolve, reject) => { 
                            doc.end();
                            setTimeout(() => {
                                resolve()
                            }, 3000)       
                        })
                    }
                }
            }
        }       
        doc.addPage()
    }
}

// await createPdf('https://files.salebot.pro//uploads//message_files//7027f254-f565-409e-84e6-94588a5fbff3.txt', 'test.pdf')
// console.log('end')

export { createPdf }






