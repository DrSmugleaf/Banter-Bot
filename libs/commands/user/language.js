//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class Language extends commando.Command {
  constructor(client) {
    super(client, {
      name: "language",
      aliases: ["language", "lang"],
      group: "user",
      memberName: "language",
      description: "Set your language",
      examples: ["language spanish", "language french"],
      args: [
        {
          key: "language",
          prompt: "What language do you want to set your account to?",
          type: "string",
          validate: (language) => {
            language = language.toLowerCase()
            return (constants.mslanguages.hasOwnProperty(language)
              || true)
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const language = args.language.toLowerCase()

    const usersettings = msg.guild.settings.get(msg.author.id, {})
    usersettings.language = language
    msg.guild.settings.set(msg.author.id, usersettings)

    return msg.reply(constants.responses.LANGUAGE.SET["english"](language))
  }
}
