"use strict"
const Discord = require("discord.js");
const discord = new Discord.Client();
const express = require("express");
const app = express();
const MessageHandler = require("./libs/handler/messagehandler");
const messagehandler = new MessageHandler();
const port = process.env.PORT || 3000;
const token = process.env.DISCORD_TOKEN;

app.listen(port, function() {
  console.log("Running banterbot.js");
});

discord.on("message", function(msg) {
  messagehandler.handleMessage(msg);
});

discord.loginWithToken(token);
