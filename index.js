require('dotenv').config();

// Slackbot
const SlackBot = require('slackbots');
const bot = new SlackBot({
    token: process.env.slackbot_token,
    name: 'GenrowBot'
});

// RSS Feed
const FeedSub = require('feedsub');
const reader = new FeedSub(process.env.rss_feed, {
    interval: 1
});

// Low DB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Create db
db.defaults({feed: []}).write();

bot.on('start', function () {
    bot.postMessageToChannel('general', 'please stay at home!');
});

bot.on("message", msg => {
    if (msg.type === "message") {
        if (msg.channel[0] === "D" && msg.bot_id === undefined) {
            bot.postMessage(msg.user, "hi", {as_user: true});

            let item = db.get('feed')
                .filter({published: true})
                .sortBy('views')
                .take(5)
                .value();

            for (let i of item) {
                bot.postMessage(msg.user, i.title, {as_user: true});
            }
        }
    }
});

reader.on('item', (item) => {
    console.log(item.title);

    const itemInDb = db.get('feed').find({link: item.link}).value();
    if (!itemInDb) {
        if (item.title !== 'No title') {
            db.get('feed').push(item).write();
        }
    }
});

reader.start();
