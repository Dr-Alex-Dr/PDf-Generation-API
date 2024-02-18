import express from "express";
import { parseHashtags } from "./controllers/Transcoding.js";
import { mixerHashtags } from "./controllers/ReadPdf.js";
import { pool } from './db.js';
import { Telegraf } from 'telegraf';
import 'dotenv/config';
import { AuthenticationMiddleware } from "./middlewares/AuthenticationMiddleware.js"; 
import { SubscriptionMiddleware } from "./middlewares/SubscriptionMiddleware.js";
import { welcomMessage, SumMessage } from "./componets/Messages.js";
import { dowsloadFileButton, createSubButton } from "./componets/Buttons.js";


const globalStateMessage = new Map()


const app = express();
const port = 3000;
const bot = new Telegraf(process.env.BOT_TOKEN)

app.use(express.json());

bot.use(AuthenticationMiddleware)
bot.use(SubscriptionMiddleware)

bot.command('start', (ctx) => {
    if (ctx.customData === true) {
        ctx.reply(welcomMessage)
    } else {
        ctx.reply(welcomMessage, createSubButton('https://payform.ru/'));
    }
})

bot.command('create', async (ctx) => {
    if (ctx.customData === true) {
        ctx.reply('Отправьте текстовый файл с хештегами');

        globalStateMessage.set(ctx.from.id, 'txt')
    } else {
        ctx.reply(SumMessage, createSubButton('https://payform.ru/'));
    }
})

bot.command('mix', async (ctx) => {
    if (ctx.customData === true) {
        ctx.reply('Отправьте pdf файл с хештегами для перемешивания');

        globalStateMessage.set(ctx.from.id, 'pdf')
    } else {
        ctx.reply(SumMessage, createSubButton('https://payform.ru/'));
    }
})

bot.on('message', async (ctx) => {
    if (globalStateMessage.get(ctx.from.id) === 'txt') {    
      if (ctx.message.document) {
        ctx.reply('Ваш запрос обрабатывается⏳')

        const fileId = ctx.message.document.file_id;
        let urlFile = await ctx.telegram.getFileLink(fileId)
        
        if (urlFile) {
            let gooleDiriveFileLink = await parseHashtags(urlFile, Math.floor(Math.random() * 100000))
            console.log(gooleDiriveFileLink)

            ctx.reply('✅PDF файл с хештегами готов!', dowsloadFileButton(gooleDiriveFileLink.fileUrl));                
        } 

        globalStateMessage.set(ctx.from.id, false)
        
      } else {       
        ctx.reply('Пожалуйста, отправьте файл.');
      }
    }

    if (globalStateMessage.get(ctx.from.id) === 'pdf') {    
        if (ctx.message.document) {
          ctx.reply('Ваш запрос обрабатывается⏳')
  
          const fileId = ctx.message.document.file_id;
          let urlFile = await ctx.telegram.getFileLink(fileId)
          
          if (urlFile) {
            let gooleDiriveFileLink = await mixerHashtags(urlFile, Math.floor(Math.random() * 100000))
            
            ctx.reply('✅PDF файл с хештегами готов!', dowsloadFileButton(gooleDiriveFileLink.fileUrl));                
          } 
  
          globalStateMessage.set(ctx.from.id, false)
          
        } else {       
          ctx.reply('Пожалуйста, отправьте файл.');
        }
      }
  });

app.listen(port, "localhost", () => {
    console.log(`Сервер запущен на порту ${port}`);
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

