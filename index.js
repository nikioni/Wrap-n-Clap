'use strict';

const fs      = require('fs');
const Clapp   = require('./modules/clapp-discord');
const cfg     = require('./config.js');
const pkg     = require('./package.json');
const Discord = require('discord.js');
const bot     = new Discord.Client();

var app = new Clapp.App({
  name: cfg.name,
  desc: pkg.description,
  prefix: cfg.prefix,
  version: pkg.version,
  onReply: (msg, context) => {
    // Fired when input is needed to be shown to the user.

    context.msg.reply('\n' + msg).then(bot_response => {
      if (cfg.deleteAfterReply.enabled) {
        context.msg.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
        bot_response.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
      }
    });
  }
});

// Load every command in the commands folder
fs.readdirSync('./commands/').forEach(file => {
  app.addCommand(require("./commands/" + file));
});

bot.on('message', msg => {
  // Fired when someone sends a message

  if (app.isCliSentence(msg.content)) {
    app.parseInput(msg.content, {
      msg: msg
      // Keep adding properties to the context as you need them
    });
  }
});


// bot.on('voiceStateUpdate', (oldMember, newMember) => {

//   var oldName = newMember.user.username;
//   if(newMember.selfDeaf === true || newMember.serverDeaf) {
// 		//channel.sendMessage(newMember.user.username + ' has joined ' + newMember.voiceChannel);
// 		newMember.setNickname("Ralph").catch(function() {
// 		console.log("Error");
// 		});
// 	}
// 	else if(newMember.selfDeaf === false || newMember.serverDeaf === false) {
// 		newMember.setNickname(oldName).catch(function() {
// 			console.log("Error");
// 		});
// 	}
// });

bot.login(cfg.token).then(() => {
  console.log('Running!');
});