"use strict"
const Discord = require("discord.js");
const discord = new Discord.Client();
const MessageHandler = require("./libs/handler/messagehandler");
const messagehandler = new MessageHandler();
const TranslatorHandler = require("./libs/handler/translatorhandler");
const translatorhandler = new TranslatorHandler();
const token = process.env.DISCORD_TOKEN;

console.log("Running banterbot.js");

discord.on("message", function(msg) {
  if(msg.author.bot) { return; };
  translatorhandler.translate(discord, msg, {"development": "Spanish", "serbia": "English"});
  //messagehandler.handleMessage(msg, discord);
});

//translatorhandler.bridgeChannels(discord, {"development": "Spanish", "serbia": "English"});

discord.loginWithToken(token);
