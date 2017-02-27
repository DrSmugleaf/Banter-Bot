//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const ObjectUtil = require("../../util/objectutil")

module.exports = class ServerLanguageCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "server-language",
      aliases: [
        "server-language", "serverlanguage",
        "server-lang", "serverlang"
      ],
      group: "admintools",
      memberName: "server-language",
      description: "Set the server's default language for the bot.",
      examples: ["server-language spanish", "server-language french"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "language",
          prompt: "What language do you want to set this server to?",
          type: "string",
          validate: (language) => {
            language = language.toLowerCase()
            return Boolean(
              ObjectUtil.hasKey(constants.mslanguages, language) ||
              ObjectUtil.hasValue(constants.mslanguages, language)
            )
          }
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const language = args.language.toLowerCase()

    msg.guild.language = constants.mslanguages[language] || language

    return msg.reply(constants.responses.SERVER_LANGUAGE.SET[msg.language](language))
  }
}
