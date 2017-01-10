//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const async = require("async")
const commando = require("discord.js-commando")
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
    var markovchain = MarkovChain()
    var i = 0
    var lines = new Array()
    var lastmessageid = msg.id

    msg.reply(`Gathering messages to simulate \`${subject}\` in this channel, please wait`)
    async.whilst(
      function() { return lines.length < 1500 && i < 30 && lastmessageid != null },
      function(next) {
        msg.channel.fetchMessages({ limit: 100, before: lastmessageid })
          .then(messages => {
            let filteredmessages = messages.filter(m => m.author.username.toLowerCase() == subject.toLowerCase())
            lines = lines.concat(filteredmessages.array())
            lastmessageid = messages.last() ? messages.last().id : null
            i++
            next(null, lastmessageid, lines)
          })
          .catch(winston.error)
      },
      function(e, lastmessageid, lines) {
        if(e) winston.error(e)
        if(!(lines && lastmessageid)) return msg.reply("There are no messages in this channel from that user")
        markovchain.seed(lines.join(os.EOL), function() {
          const answer = `**${subject} (Markov):** ${markovchain.fill(markovchain.pick(), 25).join(" ").replace("@", "@ ")}`
          return msg.channel.sendMessage(answer)
        })
      }
    )
  }
}
