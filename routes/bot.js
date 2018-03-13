const request = require("request");
const TelegramBot = require('node-telegram-bot-api');
const token = '453636052:AAGSXobmAtsZH8bi2UpfsPA-KJaea3Fq6dE';
var apiai = require('apiai');

var app = apiai("33fbd700276b4bd98afed317698de423");

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    sendquestion(chatId, 'M1', '0');
    var request = app.textRequest(message.text, {
        sessionId: chatId
    });

    request.on('response', function(response) {
        console.log(response);
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
});

function sendquestion(chatId, sub, id) {
    const options = {
        method: 'GET',
        url: 'http://localhost:3000/data/question/get',
        qs: {sub: sub, id: id}

    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        body = JSON.parse(body);
        var reply = body.question;
        var options=[];
        for (var op in body.options){
            options.push([body.options[op]]);
        }
        bot.sendMessage(chatId, reply, {
            "reply_markup": {
                "keyboard": options,
                "one_time_keyboard": true
            }
        });
        console.log(body);
    });
}

module.exports = bot;



