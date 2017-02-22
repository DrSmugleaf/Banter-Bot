//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const DB = require("../../util/db.js")
const db = new DB()
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
          default: "get"
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
    })
  }

  async run(msg, args) {
    const mode = args.id_text == "" ? "get" : args.mode
    const id = args.mode == "" ?
      null : args.id_text == "" ?
      parseInt(args.mode, 10) : parseInt(args.id_text, 10)
    const text = args.id_text == "" ? args.mode : args.id_text

    switch (mode) {
    case "add":
    case "put":
      if(!text) return msg.reply(responses.EMPTY[msg.language])
      this.quote.add(
        { text: text, submitter: msg.author.username, guild: msg.guild.id }
      ).then(() => {
        return msg.reply(responses.ADDED[msg.language])
      }).catch((e) => {
        winston.info(e)
        return msg.reply(responses.ERROR[msg.language])
      })
      break
    case "del":
    case "delete":
    case "rem":
    case "remove":
      if(!this.quote.has({ id: id, guild: msg.guild.id })) return msg.reply(responses.MISSING[msg.language])
      return this.quote.delete({ id: id, guild: msg.guild.id }).then(() => {
        return msg.reply(responses.REMOVED[msg.language](id))
      }).catch(() => {
        return msg.reply(responses.ERROR[msg.language])
      })
    case "find":
    case "get": {
      if(id && !this.quote.has({ id: id, guild: msg.guild.id })) return msg.reply(responses.MISSING[msg.language])
      const quote = this.quote.get({ id: id, guild: msg.guild.id })
      return msg.reply(responses.GET[msg.language](quote.id, quote.text))
    }
    default:
      return msg.reply(`Mode \`${mode}\` doesn't exist`)
    }
  }
}
