//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class Version extends commando.Command {
  constructor(client) {
    super(client, {
      name: "version",
      aliases: ["build", "changes", "version", "versions"],
      group: "util",
      memberName: "version",
      description: "Shows details about a bot version.",
      examples: ["version 2"],
      args: [
        {
          key: "version",
          prompt: "What version do you want the details of?",
          type: "string",
          validate: (version) => {
            return Boolean(constants.builds[version])
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const version = args.version

    msg.reply(constants.builds[version]["english"])
  }
}
