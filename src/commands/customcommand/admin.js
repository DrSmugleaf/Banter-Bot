//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const CustomCommand = require("./base/command")
const responses = require("../../util/constants").responses.CUSTOM_COMMAND

module.exports = class CustomCommandAdmin extends commando.Command {
  constructor(client) {
    super(client, {
      name: "custom-command-manager",
      aliases: [
        "custom-command-manager", "customcommandmanager", "custom-cmd-manager", "customcmdmanager",
        "custom-command-admin", "customcommandadmin", "custom-cmd-admin", "customcmdadmin"
      ],
      group: "customcommand",
      memberName: "custom-command-manager",
      description: "Manage custom commands.",
      examples: ["custom-command-manager"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "action",
          prompt: "What do you want to do? (remove)",
          type: "string"
        },
        {
          key: "command",
          prompt: "Which custom command do you want to act upon?",
          type: "string"
        }
      ]
    })

    this.client.once("dbReady", () => {
      this.client.guilds.forEach((guild) => {
        const commands = guild.settings.get("custom-commands", {})
        for(const customCommand in commands) {
          if(!commands.hasOwnProperty(customCommand)) continue
          const command = CustomCommand(guild, customCommand, commands[customCommand])
          this.client.registry.registerCommand(command)
        }
      })
    })
  }

  static async registerCommand(guild, name, command) {
    const commands = await guild.settings.get("custom-commands", {})
    commands[name] = command
    guild.settings.set("custom-commands", commands)
    const customCommand = CustomCommand(guild, name, command)
    guild.client.registry.registerCommand(customCommand)
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const action = args.action
    const commandName = args.command
    const command = this.client.registry.commands.get(commandName)
    const commands = msg.guild.settings.get("custom-commands", {})
    if(!command || !commands || !commands[commandName]) {
      return msg.reply(responses.DOESNT_EXIST[msg.language](commandName))
    }

    switch (action) {
    case "remove":
      this.client.registry.unregisterCommand(command)
      delete commands[commandName]
      msg.guild.settings.set(commands)

      return msg.reply(responses.UNREGISTERED[msg.language](commandName))
    }
  }
}
