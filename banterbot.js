//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
//require("./libs/util")
//const constants = require("./libs/util/constants")
//const Discord = require("discord.js")
//const discord = new Discord.Client()
//const fs = require("fs")
//const MessageHandler = require("./libs/handler/messagehandler")
//const messagehandler = new MessageHandler()
const token = process.env.DISCORD_TOKEN
const winston = require("winston")
require("./libs/util")
const path = require("path")
const commando = require("discord.js-commando")
const client = new commando.Client({
  owner: "109067752286715904"
})

client.on("error", winston.error)
  .on("warn", winston.warn)
  .on("debug", winston.debug)
  .on("ready", () => {
    winston.info(`Client ready, logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
  })
  .on("disconnect", () => { winston.warn("Disconnected") })
  .on("reconnect", () => { winston.warn("Reconnecting") })
  .on("commandError", (cmd, e) => {
    if(e instanceof commando.FriendlyError) return
    winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, e)
  })
  .on("commandBlocked", (msg, reason) => {
    winston.info(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""} blocked; ${reason}`)
  })
  .on("commandPrefixChange", (guild, prefix) => {
    winston.info(`Prefix changed to ${prefix || "the default"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}`)
  })
  .on("commandStatusChange", (guild, command, enabled) => {
    winston.info(`Command ${command.groupID}:${command.memberName} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}`)
  })
  .on("groupStatusChange", (guild, group, enabled) => {
    winston.info(`Group ${group.id} ${enabled ? "enabled" : "disabled"} ${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}`)
  })

client.registry
  .registerGroup("misc", "Misc")
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "libs/commands"))

client.login(token)

// winston.info("Running banterbot.js")

// discord.on("error", (e) => {
//   winston.error(e)
// })
//
// discord.on("ready", () => {
//   discord.user.setUsername(constants.defaultoptions.name)
//   discord.user.setAvatar(fs.readFileSync(constants.defaultoptions.avatar))
//     .catch(winston.error)
// })
//
// discord.on("message", (msg) => {
//   if(msg.author.bot) { return }
//   messagehandler.handleMessage(msg)
// })
//
// client.login(token)
