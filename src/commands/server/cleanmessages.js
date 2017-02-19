//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const async = require("async")
const commando = require("discord.js-commando")
const { oneLine, stripIndents } = require("common-tags")
const responses = require("../../util/constants").responses.CLEAN_MESSAGES
const winston = require("winston")

module.exports = class CleanMessages extends commando.Command {
  constructor(client) {
    super(client, {
      name: "clean-messages",
      aliases: [
        "clean-messages", "cleanmessages", "cleanmsgs", "clean-msgs",
        "clear-messages", "clearmessages", "clearmsgs", "clear-msgs",
        "delete-messages", "deletemessages", "deletemsgs", "delete-msgs"
      ],
      group: "server",
      memberName: "clean-messages",
      description: "Delete the messages of a channel forever.",
      examples: ["clean-messages"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "confirmation",
          prompt: "Confirm that you want to delete all messages from this channel",
          type: "string",
          default: ""
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async clean(msg) {
    const channel = msg.channel
    var lastMessageID = msg.id
    var i = 0

    async.whilst(
      function() { return i < 100 && lastMessageID },
      function(next) {
        channel.fetchMessages({
          limit: 100,
          before: lastMessageID
        }).then(messages => {
          lastMessageID = messages.last() ? messages.last().id : null
          messages.deleteAll()
          i++
          next(null, lastMessageID)
        }).catch(winston.error)
      }
    )
  }

  async run(msg, args) {
    if(!msg.channel.permissionsFor(msg.client.user).hasPermission("MANAGE_MESSAGES")) {
      return msg.reply(responses.NO_PERMISSION[msg.language])
    }
    const confirmation = args.confirmation.toLowerCase()

    switch (confirmation) {
    case "confirm":
    case "yes":
    case oneLine`
      from the ghastly eyrie i can see to the ends of the world, and from
      this vantage point i declare with utter certainty that this one is in
      the can!
    `:
      this.clean(msg)
      return msg.channel.send(`Messages in this channel cleared by ${msg.author}`)
    default:
      return msg.reply(stripIndents`
        This command will remove all messages from this channel forever.
        If you are sure, type ${msg.content.split(" ")[0]} confirm
      `)
    }
  }
}
