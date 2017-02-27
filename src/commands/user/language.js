//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const ObjectUtil = require("../../util/objectutil")

module.exports = class LanguageCommand extends commando.Command {
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
            return Boolean(
              ObjectUtil.hasKey(constants.mslanguages, language) ||
              ObjectUtil.hasValue(constants.mslanguages, language)
            )
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const language = args.language.toLowerCase()

    if(msg.guild) msg.member.language = constants.mslanguages[language] || language
    else msg.author.language = constants.mslanguages[language] || language

    return msg.reply(constants.responses.LANGUAGE.SET[msg.language](language))
  }
}
