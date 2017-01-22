//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class Magic8Ball extends commando.Command {
  constructor(client) {
    super(client, {
      name: "8ball",
      aliases: ["8", "8ball", "magic8", "magic8ball"],
      group: "misc",
      memberName: "8ball",
      description: "An answer from the Magic 8 Ball.",
      examples: ["8 will I get an answer?"],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "question",
          prompt: "What is your question for the Magic 8 Ball?",
          type: "string",
          default: ""
        }
      ]
    })
  }

  async run(msg) {
    const answer = constants.responses.MAGIC8BALL["english"][Math.floor(
      Math.random() * constants.responses.MAGIC8BALL["english"].length
    )]
    return msg.reply(answer)
  }
}
