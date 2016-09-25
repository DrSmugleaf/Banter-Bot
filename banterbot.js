//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
require("./libs/util")
const constants = require("./libs/util/constants")
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
  discord.user.setUsername(constants.defaultoptions.name)
  discord.user.setAvatar(fs.readFileSync(constants.defaultoptions.avatar))
    .catch(winston.error)
})

discord.on("message", (msg) => {
  if(msg.author.bot) { return }
  messagehandler.handleMessage(msg)
})

discord.login(token)
