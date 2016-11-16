//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const async = require("async")
const CommandBase = require("./commandbase")
const constants = require("../util/constants")
const os = require("os")
const MarkovChain = require("markov")
const winston = require("winston")

class Markov extends CommandBase {
  constructor() {
    super()
  }
}

Markov.prototype.default = function(msg) {
  this.generate(msg, this.command[1])
}

Markov.prototype.generate = function(msg, user = msg.author.username) {
  let markovchain = MarkovChain(1)
  let i = 0
  let lastmessageid
  let sentences = []

  if(!msg.guild || !msg.guild.available) {
    msg.reply(constants.responses.NOT_A_SERVER[msg.language])
    return
  }

  async.whilst(
    function() { return sentences.length < 1000 && i < 25},
    function(next) {
      winston.info(lastmessageid)
      msg.channel.fetchMessages({limit: 100, before: lastmessageid})
        .then(messages => {
          let filteredmessages = messages.filter(m => m.author.username == user)
          lastmessageid = messages.last().id
          sentences = sentences.concat(filteredmessages.array())
          winston.info(sentences.length)
          i++
          next(null, lastmessageid, sentences)
        })
        .catch(winston.error)
    },
    function(e, lastmessageid, sentences) {
      if(e) winston.error(e)
      markovchain.seed(sentences.join(os.EOL), function() {
        //winston.info(sentences[Math.floor(Math.random() * sentences.length)])
        winston.info(markovchain.fill(markovchain.pick()).join(" "))
      })
    }
  )
}

module.exports = Markov
