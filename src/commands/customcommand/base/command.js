//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

module.exports = (guild, name, command) => class CustomCommand extends commando.Command {
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

    this.guild = guild
    this.text = command.text
    this.url = command.url
  }

  hasPermission(msg) {
    return msg.guild.id === this.guild.id
  }

  async run(msg, args) {
    const member = args.target || msg.member

    if(command.text) {
      msg.channel.sendMessage(`<@${member.id}>, ${this.text}`)
    } else if(command.url) {
      const command = this.client.registry.resolveCommand("youtube:play")
      const video = await command.args[0].parse(this.url)
      args.video = video
      args.repeat = false
      this.client.registry.resolveCommand("youtube:play").run(msg, args)
    }
  }
}
