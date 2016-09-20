"use strict"
require("./libs/util")
const Discord = require("discord.js")
const discord = new Discord.Client()
const fs = require("fs")
const MessageHandler = require("./libs/handler/messagehandler")
const messagehandler = new MessageHandler()
const token = process.env.DISCORD_TOKEN
const winston = require("winston")

winston.info("Running banterbot.js")

discord.on("error", (e) => {
  winston.error(e)
})

discord.on("ready", () => {
  discord.user.setUsername("Banter Bot")
  discord.user.setAvatar(fs.readFileSync("./images/LUL.png"))
    .catch(winston.error)
})

discord.on("message", (msg) => {
  if(msg.author.bot) { return }
  messagehandler.handleMessage(msg)
})

discord.login(token)
