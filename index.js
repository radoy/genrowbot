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
// db.defaults({feed: []}).write();

bot.on('start', function () {
    bot.postMessageToChannel('general', 'please stay at home!');
});

bot.on("message", msg => {
    if (msg.type === "message") {

        //Direct Message
        if (msg.channel[0] === "D") {

            if (msg.text == "rss") {
                let item = db.get('feed')
                    .filter(feed => feed.title !== 'No title')
                    .orderBy(['pubdatetime'], ['desc'])
                    .take(5)
                    .value();

                if (item.length < 1) {
                    bot.postMessage(msg.user, 'there is no rss feed, please try again in a minute.', {as_user: true});
                }

                for (let i of item) {
                    bot.postMessage(msg.user, i.title + ": " + i.pubdate + "\n" + i.link, {as_user: true});
                }
            } else {
                bot.postMessage(msg.user, "Hello. I wish you are at your home right now. \n To see rss feed from topcoder please type: rss \n Thank you", {as_user: true});
            }
        }
    }
});

reader.on('item', (item) => {
    try {
        const itemInDb = db.get('feed').find({link: item.link}).value();
        if (!itemInDb) {
            item.pubdatetime = new Date(item.pubdate).getTime();

            db.get('feed').push(item).write();
        }

    } catch (err) {
        console.log(err);
    }
});

reader.on('error', (err) => {
    // restart service if something wrong happen
    console.log(err);
    reader.start();
});

reader.start();
