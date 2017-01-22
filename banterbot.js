//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
require("./libs/util")
const commando = require("discord.js-commando")
const client = new commando.Client({
  commandPrefix: process.env.NODE_ENV === "dev" ? "!!" : "!",
  invite: "https://discord.gg/yyDWNBr",
  owner: "109067752286715904",
  unknownCommandResponse: false
})
const oneLine = require("common-tags").oneLine
const path = require("path")
const PostgreSQLProvider = require("./libs/providers/postgresql")
const Sender = require("./libs/bridge/sender")
new Sender(client)
const token = process.env.NODE_ENV === "dev" ?
  process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN
const VersionAnnouncer = require("./libs/versionannouncer/announcer")
const VoiceAutoChannel = require("./libs/autochannel/voice")
new VoiceAutoChannel(client)
const winston = require("winston")

client
  .on("error", winston.error)
  .on("warn", winston.warn)
  .on("debug", winston.debug)
  .on("ready", () => {
    winston.info(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
    new VersionAnnouncer(client)
  })
  .on("disconnect", () => { winston.warn("Disconnected!") })
  .on("reconnect", () => { winston.warn("Reconnecting...") })
  .on("commandError", (cmd, err) => {
    if(err instanceof commando.FriendlyError) return
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
  new commando.SQLiteProvider(new PostgreSQLProvider())
).catch(winston.error)

client.registry
  .registerGroup("bridge", "Bridge")
  .registerGroup("misc", "Misc")
  .registerGroup("server", "Server")
  .registerGroup("user", "User")
  .registerGroup("youtube", "Youtube")
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "libs/commands"))

client.login(token)
