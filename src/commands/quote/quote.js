//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const DB = require("../../util/db.js")
const db = new DB()
const responses = require("../../util/constants").responses.QUOTE
const winston = require("winston")

module.exports = class Quote extends commando.Command {
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

    this.client.once("dbReady", () => {
      db.query("CREATE TABLE IF NOT EXISTS quotes (id BIGSERIAL PRIMARY KEY, text TEXT, submitter TEXT)")
    })
  }

  async quoteAdd(msg, text) {
    if(!text) return msg.reply(responses.EMPTY[msg.language])
    db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id",
      [text, msg.author.username], "one"
    ).then(data => {
      return msg.reply(responses.ADDED[msg.language](data.id))
    }).catch(winston.error)
  }

  async quoteDel(msg, id) {
    db.query("DELETE FROM quotes WHERE id=$1::int RETURNING id",
      [id], "one"
    ).then(data => {
      db.cleanTable("quotes")
      return msg.reply(responses.REMOVED[msg.language](data.id))
    }).catch(e => {
      winston.error(e)
      return msg.reply(responses.INVALID[msg.language])
    })
  }

  async quoteGet(msg, id) {
    const query = id ? "SELECT * FROM quotes WHERE id=$1::int" :
    "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
    const values = id ? [id] : null

    db.query(query, values, "one").then(data => {
      return msg.reply(responses.GET[msg.language](data.id, data.text))
    }).catch(e => {
      winston.error(e)
      return msg.reply(responses.MISSING[msg.language])
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
      this.quoteAdd(msg, text)
      break
    case "del":
    case "delete":
    case "rem":
    case "remove":
      this.quoteDel(msg, id)
      break
    case "find":
    case "get":
      this.quoteGet(msg, id)
      break
    default:
      return msg.reply(`Mode \`${mode}\` doesn't exist`)
    }
  }
}
