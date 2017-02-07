//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

module.exports = (name, command) => class CustomCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: name,
      group: "customcommand",
      memberName: name,
      description: "Custom command.",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "target",
          prompt: "Which member do you want to target?",
          type: "member",
          default: ""
        }
      ]
    })

    this.guild = command.guild
    this.text = command.text
    this.url = command.url
  }

  hasPermission(msg) {
    return msg.guild.id === command.guild.id
  }

  async run(msg, args) {
    const member = args.target || msg.member

    if(command.text) {
      msg.channel.sendMessage(`<@${member.id}>, ${this.text}`)
    } else if(command.url) {
      args.url = this.url
      args.repeat = false
      this.client.registry.resolveCommand("youtube:play").run(msg, args)
    }
  }
}
