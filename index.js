import express from "express";
import { parseHashtags } from "./controllers/Transcoding.js";
import { mixerHashtags } from "./controllers/ReadPdf.js";
import { Telegraf } from 'telegraf';
import 'dotenv/config';
import { AuthenticationMiddleware } from "./middlewares/AuthenticationMiddleware.js"; 
import { SubscriptionMiddleware } from "./middlewares/SubscriptionMiddleware.js";
import { SaveMessages } from "./controllers/SaveMessages.js";
import { welcomMessage, SumMessage } from "./componets/Messages.js";
import { downloadFileButton, createSubButton } from "./componets/Buttons.js";
import { CreatingPaymentLink } from "./controllers/CreatingPaymentLink.js";
import { MakingSubscription } from "./controllers/MakingSubscription.js";

const globalStateMessage = new Map()

const app = express();
const port = 3000;
const bot = new Telegraf(process.env.BOT_TOKEN)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

bot.use(AuthenticationMiddleware)
bot.use(SubscriptionMiddleware)


bot.command('start', async (ctx) => {
    if (ctx.customData === true) {
        ctx.replyWithMarkdown(welcomMessage)

        SaveMessages(welcomMessage, ctx.from.id)
    } else {
        let paymentLink = await CreatingPaymentLink(ctx);
        ctx.replyWithMarkdown(welcomMessage, createSubButton(paymentLink));
        SaveMessages(welcomMessage, ctx.from.id)
    }
})

bot.command('create', async (ctx) => {
    if (ctx.customData === true) {
        ctx.reply('Отправьте текстовый файл с хештегами');
        SaveMessages('Отправьте текстовый файл с хештегами', ctx.from.id)

        globalStateMessage.set(ctx.from.id, 'txt')
    } else {
        let paymentLink = await CreatingPaymentLink(ctx);
        ctx.reply(SumMessage, createSubButton(paymentLink));
        SaveMessages(SumMessage, ctx.from.id)
    }
})

bot.command('mix', async (ctx) => {
    if (ctx.customData === true) {
        ctx.reply('Отправьте pdf файл с хештегами для перемешивания');

        SaveMessages('Отправьте pdf файл с хештегами для перемешивания', ctx.from.id)
        globalStateMessage.set(ctx.from.id, 'pdf')
    } else {
        let paymentLink = await CreatingPaymentLink(ctx);
        ctx.reply(SumMessage, createSubButton(paymentLink));
        SaveMessages(SumMessage, ctx.from.id)
    }
});

bot.command('support', (ctx) => {
  ctx.reply(`
Расскажите, в чем у вас вопрос/сложность

https://t.me/Not_t_Boring`)
})

bot.on('message', async (ctx) => {
  if (globalStateMessage.get(ctx.from.id) === 'txt') {   
    processesRequests(ctx, parseHashtags)
  }

  if (globalStateMessage.get(ctx.from.id) === 'pdf') {    
    processesRequests(ctx, mixerHashtags)
  }
});


async function processesRequests(ctx, processingFuntion) {
  if (ctx.message.document) {
    ctx.reply('Ваш запрос обрабатывается⏳')

    const fileId = ctx.message.document.file_id;
    let urlFile = await ctx.telegram.getFileLink(fileId)

    SaveMessages(urlFile, ctx.from.id)
    SaveMessages('Ваш запрос обрабатывается⏳', ctx.from.id)

    if (urlFile) {    
        let gooleDiriveFileLink =  await processingFuntion(urlFile, Math.floor(Math.random() * 100000)) 
        console.log(gooleDiriveFileLink)

        ctx.reply('✅PDF файл с хештегами готов!', downloadFileButton(gooleDiriveFileLink.fileUrl));       
        SaveMessages(`✅PDF файл с хештегами готов! ${gooleDiriveFileLink.fileUrl}`, ctx.from.id)
    } else {
      ctx.reply('В файле отсутствуют подходящие хэштеги', ctx.from.id);       
      SaveMessages('В файле отсутствуют подходящие хэштеги', ctx.from.id)
    }

    globalStateMessage.set(ctx.from.id, false) 
  } 
}

app.post('/payments', async (req, res) => {
  console.log(req.body)
  try {
    if (req.body['products[0][name]'] === 'Сервис по автоматизации подбора хештегов' && req.body.payment_status === 'success') {
    
      const telegram_id = req.body.order_num.split('-')[0]
      
      await MakingSubscription(telegram_id)
      await bot.telegram.sendMessage(telegram_id, '🥳 Поздравляем! Ваша подписка оформлена! 🚀')
      
      console.log('Оплата прошла успешно');
      res.sendStatus(200)
    } else {
      console.log('Оплата не прошла');
      res.sendStatus(400)
    }
  }
  catch {

  }
})



app.listen(port, "localhost", () => {
    console.log(`Сервер запущен на порту ${port}`);
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

