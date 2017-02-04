//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const CustomCommand = require("./base/command")
const Youtube = require("simple-youtube-api")
const youtube = new Youtube(process.env.GOOGLE_KEY)

module.exports = class CustomVoiceCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "custom-voice-command",
      aliases: [
        "custom-voice-command", "customvoicecommand", "custom-voice-cmd", "customvoicecmd",
        "custom-command-voice", "customcommandvoice", "custom-cmd-voice", "customcmdvoice"
      ],
      group: "customcommand",
      memberName: "custom-voice-command",
      description: "Make a basic custom command to play in a voice channel.",
      examples: ["custom-voice-command"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "name",
          prompt: "What name do you want for this command?",
          type: "string"
        },
        {
          key: "url",
          prompt: "What youtube video do you want this command to play?",
          type: "string",
          validate: (url) => {
            return youtube.getVideo(url).then(() => {
              return true
            }).catch(() => {
              return false
            })
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const name = args.name
    const url = args.url

    if(this.client.registry.commands.get(name)) {
      return msg.reply(constants.responses.CUSTOM_COMMAND.ALREADY_EXISTS[msg.language](name))
    }

    const commands = msg.guild.settings.get("custom-commands", {})
    commands[name] = {
      url: url
    }

    msg.guild.settings.set("custom-commands", commands)
    commands[name].guild = msg.guild
    const command = CustomCommand(name, commands[name])
    this.client.registry.registerCommand(command)

    return msg.reply(constants.responses.CUSTOM_COMMAND.REGISTERED[msg.language](
      name, this.client.commandPrefix || `<@${msg.client.user.id}> `
    ))
  }
}
