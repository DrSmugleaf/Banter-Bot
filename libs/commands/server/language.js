//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const ObjectUtil = require("../../util/objectutil")
const objectutil = new ObjectUtil()

module.exports = class ServerLanguage extends commando.Command {
  constructor(client) {
    super(client, {
      name: "server-language",
      aliases: [
        "server-language", "server-lang",
        "serverlanguage", "serverlang"
      ],
      group: "server",
      memberName: "server-language",
      description: "Set the server's default language for the bot",
      examples: ["server-language spanish", "server-language french"],
      args: [
        {
          key: "language",
          prompt: "What language do you want to set this server to?",
          type: "string",
          validate: (language) => {
            language = language.toLowerCase()
            return !!objectutil.hasValue(constants.mslanguages, language)
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const language = args.language.toLowerCase()

    msg.guild.settings.set("server-language", language)

    return msg.reply(constants.responses.SERVER_LANGUAGE.SET["english"](language))
  }
}
