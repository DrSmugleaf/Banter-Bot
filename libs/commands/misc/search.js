//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const async = require("async")
const commando = require("discord.js-commando")
const Discord = require("discord.js")
const os = require("os")
const winston = require("winston")

module.exports = class Search extends commando.Command {
  constructor(client) {
    super(client, {
      name: "search",
      aliases: ["search", "lookfor"],
      group: "misc",
      memberName: "search",
      description: "Search for a message in this channel",
      examples: ["search Look at this image"],
      guildOnly: true,
      args: [
        {
          key: "searchtext",
          prompt: "What do you want to search for?",
          type: "string"
        }
      ]
    })
  }

  async run(msg, args) {
    const searchtext = args.searchtext
    let sentences = new Discord.Collection()
    let i = 0
    let lastmessageid = msg.id

    msg.reply(`Searching for \`${searchtext}\``)
    async.whilst(
      function() { return i < 25 && lastmessageid},
      function(next) {
        msg.channel.fetchMessages({limit: 100, before: lastmessageid})
          .then(messages => {
            lastmessageid = messages.last() ? messages.last().id : null
            sentences = sentences.concat(messages.filter(value => {
              return value.content.includes(searchtext)
            }))
            i++
            next(null, lastmessageid, sentences)
          })
          .catch(winston.error)
      },
      function(e, lastmessageid, sentences) {
        if(e) {
          winston.error(e)
          return
        }

        let res = `Found \`${sentences.array().length}\` results with \`${searchtext}\` in them:`
        for(let value of sentences.values()) {
          let msgdate = value.createdAt
          res = res.concat(`${os.EOL + os.EOL}**${value.author.username}** ${msgdate.getUTCDate()}/${msgdate.getUTCMonth()+1}/${msgdate.getUTCFullYear()} at ${msgdate.getUTCHours()}:${msgdate.getUTCMinutes()}${os.EOL}${value.content}`)
        }

        msg.author.sendMessage(res)
        return msg.reply("Sent you a DM with the results")
      }
    )
  }
}
