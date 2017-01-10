//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const moment = require("moment-timezone")
const stripIndents = require("common-tags").stripIndents

module.exports = class WhoIs extends commando.Command {
  constructor(client) {
    super(client, {
      name: "whois",
      aliases: ["user", "user-info", "userinfo", "whois"],
      group: "util",
      memberName: "whois",
      description: "Get information about a user",
      examples: ["whois DrSmugleaf", "whois 109067752286715904"],
      guildOnly: true,
      args: [
        {
          key: "user",
          label: "user",
          prompt: "What user would you like the information of?",
          type: "string",
          default: "yourself"
        }
      ]
    })
  }

  async run(msg, args) {
    const member = args.user == "yourself" ? msg.guild.member(msg.author) : msg.guild.member(args.user)

    if(member) {
      const user = member.user
      return msg.reply(stripIndents`
        Info on **${user.username}#${user.discriminator}** (ID: ${user.id})
        **❯ Member Details**
        ${member.nickname !== null ? ` • Nickname: ${member.nickname}` : " • No Nickname"}
         • Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(", ")}
         • Joined at: ${moment.tz(member.joinedAt, process.env.TZ).format("MMMM Do YYYY, HH:MM:SS zZ")}

        **❯ User Details**
         • Created at: ${moment.tz(user.createdAt, process.env.TZ).format("MMMM Do YYYY, HH:MM:SS zZ")}${user.bot ? "\n • Is a bot account" : ""}
         • Status: ${user.presence.status}
         • Game: ${user.presence.game ? user.presence.game.name : "None"}
      `)
    } else {
      return msg.reply(`User \`${args.user}\` couldn't be found`)
    }
  }
}
