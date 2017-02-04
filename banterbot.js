//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const Commando = require("discord.js-commando")
const Discord = require("discord.js")
require("./libs/extensions/guild").applyToClass(Discord.Guild)
require("./libs/extensions/member").applyToClass(Discord.GuildMember)
require("./libs/extensions/message").applyToClass(Discord.Message)
require("./libs/extensions/argument").applyToClass(Commando.CommandArgument)
require("./libs/extensions/message").applyToClass(Commando.CommandMessage)
require("./libs/util")
const client = new Commando.Client({
  commandPrefix: process.env.NODE_ENV === "dev" ? "!!" : "!",
  invite: "https://discord.gg/yyDWNBr",
  owner: "109067752286715904",
  unknownCommandResponse: process.env.NODE_ENV === "dev"
})
const oneLine = require("common-tags").oneLine
const path = require("path")
const PostgreSQLProvider = require("./libs/providers/postgresql")
const Sender = require("./libs/bridge/sender")
const token = process.env.NODE_ENV === "dev" ?
  process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN
const VersionAnnouncer = require("./libs/announcer/version")
// const AutoChannel = require("./libs/autochannel/autochannel")
const winston = require("winston")

client
  .on("error", winston.error)
  .on("warn", winston.warn)
  .on("debug", (string) => {
    if(string === "Provider finished initialisation.") {
      // new AutoChannel(client)
      new Sender(client)
      new VersionAnnouncer(client)
      client.emit("dbReady")
    }
  })
  .on("ready", () => {
    winston.info(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
  })
  .on("disconnect", () => { winston.warn("Disconnected!") })
  .on("reconnect", () => { winston.warn("Reconnecting...") })
  .on("commandError", (cmd, err) => {
    if(err instanceof Commando.FriendlyError) return
    winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
  })
  .on("commandBlocked", (msg, reason) => {
    winston.info(oneLine`
  		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""}
  		blocked; ${reason}
  	`)
  })
  .on("commandPrefixChange", (guild, prefix) => {
    winston.info(oneLine`
  		Prefix ${prefix === "" ? "removed" : `changed to ${prefix || "the default"}`}
  		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
  	`)
  })
  .on("commandStatusChange", (guild, command, enabled) => {
    winston.info(oneLine`
  		Command ${command.groupID}:${command.memberName}
  		${enabled ? "enabled" : "disabled"}
  		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
  	`)
  })
  .on("groupStatusChange", (guild, group, enabled) => {
    winston.info(oneLine`
  		Group ${group.id}
  		${enabled ? "enabled" : "disabled"}
  		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
  	`)
  })

client.setProvider(
  new Commando.SQLiteProvider(new PostgreSQLProvider())
).catch(winston.error)

client.registry
  .registerGroup("bridge", "Bridge")
  .registerGroup("customcommand", "Custom Commands")
  .registerGroup("misc", "Misc")
  .registerGroup("server", "Server")
  .registerGroup("user", "User")
  .registerGroup("youtube", "Youtube")
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "libs/commands"))

client.login(token)
