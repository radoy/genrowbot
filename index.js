require('dotenv').config();

const SlackBot = require('slackbots');
const bot = new SlackBot({
    token: process.env.slackbot_token,
    name: 'GenrowBot'
});

bot.on('start', function () {
    let params = {
        icon_emoji: ':cat:'
    };

    bot.postMessageToChannel('general', 'meow!', params);
    bot.postMessageToUser('user_name', 'meow!', params);
    bot.postMessageToUser('user_name', 'meow!', {'slackbot': true, icon_emoji: ':cat:'});
    bot.postMessageToGroup('private_group', 'meow!', params);


});
