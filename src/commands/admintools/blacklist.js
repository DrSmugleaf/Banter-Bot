//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.BLACKLIST

module.exports = class Blacklist extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blacklist",
      aliases: [
        "blacklist", "black-list",
        "mute", "mute-user", "muteuser",
        "mute-member", "mutemember"
      ],
      group: "admintools",
      memberName: "blacklist",
      description: "Blacklist a member from using any bot commands, or unblacklist a blacklisted member.",
      examples: ["blacklist DrSmugleaf", "blacklist @DrSmugleaf#9458", "blacklist 109067752286715904"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "member",
          prompt: "Which member do you want to blacklist?",
          type: "member"
        }
      ]
    })

    this.client.dispatcher.addInhibitor(msg => {
      return msg.guild && msg.guild.settings.get("blacklist", []).includes(msg.member.id)
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const member = args.member
    var blacklist = msg.guild.settings.get("blacklist", [])

    if(msg.member.id === member.id) return msg.reply(responses.CANT_BLACKLIST_SELF[msg.language])

    if(blacklist.includes(member.id)) {
      blacklist = _.without(blacklist, member.id)
      msg.guild.settings.set("blacklist", blacklist)
      return msg.reply(responses.WHITELISTED[msg.language](member.displayName))
    } else {
      blacklist.push(member.id)
      msg.guild.settings.set("blacklist", blacklist)
      return msg.reply(responses.BLACKLISTED[msg.language](member.displayName))
    }
  }
}
