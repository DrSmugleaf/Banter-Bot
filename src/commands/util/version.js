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
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "version",
          prompt: "What version do you want the details of?",
          type: "string",
          validate: (version) => {
            return Boolean(constants.versions[version])
          }
        }
      ]
    })
  }

  async run(msg, args) {
    const version = args.version

    msg.reply("\n" + constants.versions[version][msg.language])
  }
}
