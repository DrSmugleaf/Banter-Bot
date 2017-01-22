//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const ObjectUtil = require("../../util/objectutil")
const objectutil = new ObjectUtil()

module.exports = class Language extends commando.Command {
  constructor(client) {
    super(client, {
      name: "language",
      aliases: ["language", "lang"],
      group: "user",
      memberName: "language",
      description: "Set your language.",
      examples: ["language spanish", "language french"],
      guildOnly: true,
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
            return Boolean(
              objectutil.hasKey(constants.mslanguages, language) ||
              objectutil.hasValue(constants.mslanguages, language)
            )
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const language = args.language.toLowerCase()

    msg.member.language = constants.mslanguages[language] || language

    return msg.reply(constants.responses.LANGUAGE.SET["english"](language))
  }
}
