const request = require("request");
const TelegramBot = require('node-telegram-bot-api');
const token = '453636052:AAGSXobmAtsZH8bi2UpfsPA-KJaea3Fq6dE';
var apiai = require('apiai');

var app = apiai("33fbd700276b4bd98afed317698de423");

const bot = new TelegramBot(token, {polling: true});
const taking_test = {};

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // sendquestion(chatId, 'M1', '0');
    console.log(taking_test)
    if (taking_test.hasOwnProperty(chatId)) {
        if (taking_test[chatId].hasOwnProperty("sub") === false) {
            taking_test[chatId]['sub'] = msg.text;
        } else {

            if (msg.text === taking_test[chatId]['answer']) {
                bot.sendMessage(chatId, 'Correct Answer')
                taking_test[chatId]['score']++
                bot.sendMessage(chatId, 'score is ' + taking_test[chatId].score)
            }
            else {
                bot.sendMessage(chatId, 'Wrong Answer')
                bot.sendMessage(chatId, 'Correct Answer is ' + taking_test[chatId]['answer'])
            }
            taking_test[chatId].question++
        }

        sendquestion(chatId, '' + taking_test[chatId].sub, taking_test[chatId].question)
    } else {
        var request = app.textRequest(msg.text, {
            sessionId: chatId
        });

        request.on('response', function (response) {
            console.log(response);
            if (response.result.fulfillment.speech === "/test") {
                taking_test[chatId] = {
                    'id': chatId,
                    'question': 0,
                    'score': 0
                };
                var options = [["M1"]];
                bot.sendMessage(chatId, "Select Subject", {
                    "reply_markup": {
                        "keyboard": options,
                        "one_time_keyboard": true
                    }
                });
            }
            else {
                bot.sendMessage(chatId, response.result.fulfillment.speech);
            }
        });

        request.on('error', function (error) {
            console.log(error);
        });

        request.end();
    }
});

function sendquestion(chatId, sub, id) {
    const options = {
        method: 'GET',
        url: 'http://localhost:3000/data/question/get',
        qs: {sub: sub, id: id}

    };
    console.log(options);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        try {
            body = JSON.parse(body);
            var reply = body.question;
            var options = [];
            for (var op in body.options) {
                options.push([body.options[op]]);
            }
            bot.sendMessage(chatId, reply, {
                "reply_markup": {
                    "keyboard": options,
                    "one_time_keyboard": true
                }
            });
            taking_test[chatId]['answer'] = body.options[body.correct - 1]
        } catch (err) {
            bot.sendMessage(chatId, "Thank you for taking test")
            delete taking_test[chatId]
        }
    });
}

module.exports = bot
