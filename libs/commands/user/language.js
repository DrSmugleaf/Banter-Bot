//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
// const DB = require("../../util/db")
// const db = new DB()
const ObjectUtil = require("../../util/objectutil")
const objectutil = new ObjectUtil()
// const winston = require("winston")

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

    // db.query("INSERT INTO users (id, language) VALUES ($1::text, $2::text) ON CONFLICT (id) DO UPDATE SET id=$1::text settings=$2::text",
    //   [msg.author.id, language], "none")
    //   .then(() => {
    //     return msg.reply(constants.responses.LANGUAGE.SET["english"](language))
    //   })
    //   .catch(winston.error)

    const usersettings = msg.guild.settings.get(msg.author.id, {})
    usersettings.language = language

    msg.guild.settings.set(msg.author.id, usersettings)

    return msg.reply(constants.responses.LANGUAGE.SET["english"](language))
  }
}
