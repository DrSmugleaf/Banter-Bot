//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
if(process.env.NODE_ENV === "dev") require("longjohn")
const Commando = require("discord.js-commando")
const Discord = require("discord.js")
require("./extensions/guild").applyToClass(Discord.Guild)
require("./extensions/member").applyToClass(Discord.GuildMember)
require("./extensions/message").applyToClass(Discord.Message)
require("./extensions/user").applyToClass(Discord.User)
require("./extensions/argument").applyToClass(Commando.CommandArgument)
require("./extensions/message").applyToClass(Commando.CommandMessage)
require("./util")
const client = new Commando.Client({
  commandPrefix: process.env.TRAVIS === "true" ? "!!!" : process.env.NODE_ENV === "dev" ? "!!" : "!",
  invite: "https://discord.gg/yyDWNBr",
  owner: "109067752286715904",
  unknownCommandResponse: process.env.NODE_ENV === "dev"
})
const oneLine = require("common-tags").oneLine
const path = require("path")
const PostgreSQLProvider = require("./providers/postgresql")
const token = process.env.NODE_ENV === "dev" ?
  process.env.DISCORD_TOKEN_DEV : process.env.DISCORD_TOKEN
const VersionAnnouncer = require("./announcer/version")
new VersionAnnouncer(client)
const winston = require("winston")

client
  .on("error", winston.error)
  .on("warn", winston.warn)
  .on("ready", () => {
    winston.info(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
  })
  .on("disconnect", () => { winston.warn("Disconnected!") })
  .on("reconnecting", () => { winston.warn("Reconnecting...") })
  .on("commandError", (cmd, e) => {
    if(e instanceof Commando.FriendlyError) return
    winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, e)
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

client.setProvider(new PostgreSQLProvider()).catch(winston.error)

client.registry
  .registerGroup("admintools", "Admin Tools")
  .registerGroup("autochannel", "Auto Channel")
  .registerGroup("bottools", "Bot Tools")
  .registerGroup("bridge", "Bridge")
  .registerGroup("customcommand", "Custom Commands")
  .registerGroup("eve", "Eve Online")
  .registerGroup("minigames", "Minigames")
  .registerGroup("misc", "Misc")
  .registerGroup("user", "User")
  .registerGroup("youtube", "Youtube")
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"))

client.login(token)

module.exports = {
  client: client
}
