require('dotenv').config();

// Slackbot
const SlackBot = require('slackbots');
const bot = new SlackBot({
    token: process.env.slackbot_token,
    name: 'GenrowBot'
});

// RSS Feed
let Parser = require('rss-parser');
let parser = new Parser();

bot.on('start', function () {
    // bot.postMessageToChannel('general', 'please stay at home!');
});

bot.on("message", msg => {
    if (msg.type === "message") {

        //Direct Message
        if (msg.channel[0] === "D") {

            if (msg.text === "rss") {
                bot.postMessage(msg.user, 'collecting data...', {as_user: true});

                (async () => {
                    try {
                        let feed = await parser.parseURL(process.env.rss_feed);

                        // Get latest 5 rss
                        feed.items.reverse().slice(-5).forEach(i => {
                            bot.postMessage(msg.user,
                                "*" + i.title + "* on " +
                                "_" + (i.pubDate || '-') + "_ " +
                                "\n\n" +
                                i.contentSnippet +
                                "\n\n" +
                                "*See the challenge: *" + i.link,
                                {as_user: true});
                        });
                    } catch (err) {
                        console.log(err);
                    }
                })();
            } else {
                bot.postMessage(msg.user, "Hello. I wish you are at your home right now. \n To see rss feed from topcoder please type: rss \n Thank you", {as_user: true});
            }
        }
    }
})
