"use strict"
const Discord = require("discord.js");
const discord = new Discord.Client();
const MessageHandler = require("./libs/handler/messagehandler");
const messagehandler = new MessageHandler();
const token = process.env.DISCORD_TOKEN;

console.log("Running banterbot.js");

discord.on("message", function(msg) {
  console.log("banterbot.js");
  messagehandler.handleMessage(msg);
});

discord.loginWithToken(token);
