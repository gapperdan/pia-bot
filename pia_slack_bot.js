if (!process.env.token) {
    console.log('Error: Specify token in environment');
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

controller.hears(['rest'], 'direct_message,direct_mention,mention', function(bot, message) {
  var http = require('http');

  var options = {
    host: 'www.random.org',
    path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
    });
  }

  http.request(options, callback).end();

  bot.reply(message, 'testing');
});

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
