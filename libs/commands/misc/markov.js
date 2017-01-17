//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const async = require("async")
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const MarkovChain = require("markov")
const os = require("os")
const winston = require("winston")

module.exports = class Markov extends commando.Command {
  constructor(client) {
    super(client, {
      name: "markov",
      aliases: ["markov", "mimic", "simulate"],
      group: "misc",
      memberName: "markov",
      description: "Simulate a user's speech",
      examples: ["markov", "markov DrSmugleaf"],
      guildOnly: true,
      args: [
        {
          key: "subject",
          prompt: "What member do you want to simulate?",
          type: "string",
          default: "yourself"
        }
      ]
    })
  }

  async run(msg, args) {
    const subject = args.subject == "yourself" ? msg.author.username : args.subject
    var markovChain = MarkovChain()
    var i = 0
    var lines = new Array()
    var lastMessageID = msg.id

    msg.reply(`Gathering messages to simulate \`${subject}\` in this channel, please wait`)
    async.whilst(
      function() { return lines.length < 1500 && i < 30 && lastMessageID != null },
      function(next) {
        msg.channel.fetchMessages(
          { limit: 100, before: lastMessageID }
        ).then(messages => {
          let filteredMessages = messages.filter(m => {
            m.author.username.toLowerCase() == subject.toLowerCase()
          })

          lines = lines.concat(filteredMessages.array())
          lastMessageID = messages.last() ? messages.last().id : null
          i++

          next(null, lastMessageID, lines)
        }).catch(winston.error)
      },
      function(e, lastMessageID, lines) {
        if(e) winston.error(e)
        if(!(lines && lastMessageID)) {
          return msg.reply(constants.responses.MARKOV.MISSING["english"](subject))
        }

        markovChain.seed(lines.join(os.EOL), function() {
          const markovAnswer = markovChain.fill(markovChain.pick(), 25).join(" ").replace("@", "@ ")
          const answer = constants.responses.MARKOV.ANSWER["english"](subject, markovAnswer)
          return msg.channel.sendMessage(answer)
        })
      }
    )
  }
}
