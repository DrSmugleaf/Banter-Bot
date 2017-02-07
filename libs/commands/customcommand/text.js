//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const CustomCommand = require("./base/command")

module.exports = class CustomTextCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "custom-text-command",
      aliases: [
        "custom-text-command", "customtextcommand", "custom-text-cmd", "customtextcmd",
        "custom-command-text", "customcommandtext", "custom-cmd-text", "customcmdtext"
      ],
      group: "customcommand",
      memberName: "custom-text-command",
      description: "Make a basic custom command that answers with text.",
      examples: ["custom-text-command secret 42"],
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
          key: "text",
          prompt: "What do you want this command to answer with?",
          type: "string"
        }
      ]
    })
  }

  async run(msg, args) {
    const name = args.name.toLowerCase()
    const text = args.text

    if(this.client.registry.commands.get(name)) {
      return msg.reply(constants.responses.CUSTOM_COMMAND.ALREADY_EXISTS[msg.language](name))
    }

    const commands = msg.guild.settings.get("custom-commands", {})
    commands[name] = {
      text: text
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
