const request = require("request");
const TelegramBot = require('node-telegram-bot-api');
const token = '453636052:AAGSXobmAtsZH8bi2UpfsPA-KJaea3Fq6dE';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    sendquestion(chatId, 'M1', '0');
});
 function sendquestion(chatId, sub, id) {
     const options = {
         method: 'GET',
         url: 'http://localhost:3000/data/question/get',
         qs: {sub: sub, id: id}

     };

     request(options, function (error, response, body) {
         if (error) throw new Error(error);

         body=JSON.parse(body);
         var reply={
             text: body["question"]
         }
         bot.sendMessage(chatId,reply);
         console.log(body);
     });
 }
module.exports = bot;



