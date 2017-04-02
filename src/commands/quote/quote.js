//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const Quote = require("./base/quote")
const responses = require("../../util/constants").responses.QUOTE
const winston = require("winston")

module.exports = class QuoteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "quote",
      aliases: ["quote"],
      group: "misc",
      memberName: "quote",
      description: "Add, remove or get a quote from the list.",
      examples: ["quote", "quote 25", "quote add Hello World", "quote del 25"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "mode",
          prompt: "Add, delete or get a quote",
          type: "string",
          default: "",
          parse: (mode) => {
            mode = mode.toLowerCase()
            if(["add", "put"].includes(mode)) return "add"
            if(["del", "delete", "rem", "remove"].includes(mode)) return "delete"
            if(["find", "get"].includes(mode)) return "get"
            if(!mode) return "get"
            if(!isNaN(mode)) return mode
            return mode
          }
        },
        {
          key: "id_text",
          label: "ID or text",
          prompt: "ID of the quote to add or delete or text of the quote to add to the list of quotes",
          type: "string",
          default: ""
        }
      ]
    })

    this.client.once("dbReady", async () => {
      const quote = new Quote(this.client)
      await quote.init()
      this.quote = quote
      this.ready = true
    })
  }

  async run(msg, args) {
    if(!this.ready) return msg.reply(responses.NOT_READY[msg.language])
    const mode = args.id_text ? this.args[0].parse(args.mode) : "get"
    const id = parseInt(args.mode, 10) || parseInt(args.id_text, 10) || null
    const text = args.id_text
    var parameters
    const commandPrefix = msg.guild.commandPrefix
    const prefix = commandPrefix ? commandPrefix : commandPrefix === "" ?
      `<@${msg.client.user.id}>` : msg.client.options.commandPrefix

    switch (mode) {
    case "add":
      if(!text) return msg.reply(responses.NO_TEXT[msg.language])

      parameters = { text: text, submitter: msg.author.id, guild: msg.guild.id }
      this.quote.add(parameters).then((id) => {
        return msg.reply(responses.ADDED[msg.language](id, `${prefix}quote`))
      }).catch((e) => {
        winston.info(e)
        return msg.reply(responses.ERROR[msg.language])
      })
      break
    case "delete":
      parameters = { id: id, guild: msg.guild.id }
      if(!this.quote.has(parameters)) return msg.reply(responses.MISSING[msg.language](id))
      if(this.quote.get(parameters).submitter !== msg.author.id && !msg.member.hasPermission("ADMINISTRATOR")) {
        return msg.reply(responses.NO_PERMISSION[msg.language](id))
      }

      this.quote.delete(parameters).then(() => {
        return msg.reply(responses.REMOVED[msg.language](id))
      }).catch((e) => {
        winston.error(e)
        return msg.reply(responses.ERROR[msg.language])
      })
      break
    case "get": {
      parameters = { id: id, guild: msg.guild.id }
      if(this.quote.empty(msg.guild.id)) return msg.reply(responses.EMPTY[msg.language](`${prefix}quote`))
      if(id && !this.quote.has(parameters)) return msg.reply(responses.MISSING[msg.language](id))

      const quote = this.quote.get(parameters)
      msg.reply(responses.GET[msg.language](quote.id, quote.text))
      break
    }
    default:
      return msg.reply(responses.NO_MODE[msg.language](mode))
    }
  }
}
