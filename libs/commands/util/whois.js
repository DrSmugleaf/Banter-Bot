//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const moment = require("moment-timezone")

module.exports = class WhoIs extends commando.Command {
  constructor(client) {
    super(client, {
      name: "whois",
      aliases: ["nsa", "user", "user-info", "userinfo", "whois"],
      group: "util",
      memberName: "whois",
      description: "Get information about a user.",
      examples: ["whois DrSmugleaf", "whois 109067752286715904"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
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

    if(!member) return msg.reply(`User \`${args.user}\` couldn't be found`)

    const user = member.user
    const joined = moment.tz(member.joinedAt, process.env.TZ).format(
      "MMMM Do YYYY, HH:MM:SS zZ"
    )
    const created = moment.tz(user.createdAt, process.env.TZ).format(
      "MMMM Do YYYY, HH:MM:SS zZ"
    )

    return msg.reply(constants.responses.WHOIS["english"](user, member, joined, created))
  }
}
