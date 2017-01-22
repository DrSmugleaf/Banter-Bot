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
      description: "Set your language.",
      examples: ["language spanish", "language french"],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "language",
          prompt: "What language do you want to set your account to?",
          type: "string",
          validate: (language) => {
            language = language.toLowerCase()
            return constants.mslanguages.hasOwnProperty(language)
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const language = args.language.toLowerCase()

    const userSettings = msg.guild.settings.get(msg.author.id, {})
    userSettings.language = language
    msg.guild.settings.set(msg.author.id, userSettings)

    return msg.reply(constants.responses.LANGUAGE.SET["english"](language))
  }
}
