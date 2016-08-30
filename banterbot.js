"use strict"
const Discord = require("discord.js");
const discord = new Discord.Client();
const fs = require("fs");
const MessageHandler = require("./libs/handler/messagehandler");
const messagehandler = new MessageHandler();
const token = process.env.DISCORD_TOKEN;

console.log("Running banterbot.js");

discord.on("ready", function() {
  discord.setUsername("Banter Bot");
  discord.setAvatar(fs.readFileSync("./public/assets/images/LUL.png"), function(e) {
    if(e) { console.log(e); };
  });
});

discord.on("message", function(msg) {
  if(msg.author.bot) { return; };
  messagehandler.handleMessage(msg, discord);
});

discord.loginWithToken(token);
