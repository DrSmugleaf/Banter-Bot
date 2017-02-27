//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const CustomCommandAdmin = require("./admin")
const responses = require("../../util/constants").responses.CUSTOM_COMMAND
const Youtube = require("simple-youtube-api")
const youtube = new Youtube(process.env.GOOGLE_KEY)

module.exports = class CustomVoiceCommandCommand extends commando.Command {
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
    const name = args.name.toLowerCase()
    const url = args.url

    if(this.client.registry.commands.get(name)) {
      return msg.reply(responses.ALREADY_EXISTS[msg.language](name))
    }

    const command = {
      url: url
    }
    CustomCommandAdmin.registerCommand(msg.guild, name, command)

    const commandPrefix = msg.guild.commandPrefix
    const prefix = commandPrefix ? commandPrefix : commandPrefix === "" ?
      `<@${msg.client.user.id}>` : msg.client.options.commandPrefix
    return msg.reply(responses.REGISTERED[msg.language](prefix + name))
  }
}
