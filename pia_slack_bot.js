if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

if (!process.env.wit) {
    console.log('Error: Specify wit in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['marco'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'polo');
});

var wit = require('botkit-middleware-witai')({
    token: process.env.wit
});

controller.middleware.receive.use(wit.receive);

controller.hears(['*'],'direct_message',wit.hears,function(bot, message) {
    console.log(message.intents);
    bot.reply(message,'aloha');
});

/*
controller.hears(['hello'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hi there.');
        }
    });
});
*/
