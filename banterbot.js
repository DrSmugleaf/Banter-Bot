"use strict"
const MessageHandler = require("./libs/handler/messagehandler");
const messagehandler = new MessageHandler();
const Discord = require("discord.js");
const discord = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

console.log("Running banterbot.js");

discord.on("message", function(msg) {
  messagehandler.handleMessage(msg);
});

discord.loginWithToken(token);
