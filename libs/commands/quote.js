//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const constants = require("../util/constants")
const DB = require("../util/db.js")
const db = new DB()
const winston = require("winston")

function _boldNames(quote) {
  return quote.replace(/(...\w* - \w*\b.*)/g, "**$1**")
}

class Quote extends CommandBase {
  constructor() {
    super()
    this.commands = {
      "!quote": this.get,
      "+quote": this.add,
      "-quote": this.del
    }
  }
}

Quote.prototype.default = function() {}

Quote.prototype.add = function(msg) {
  let quote = _boldNames(msg.content.replace("+quote ", ""))
  if(!quote) {
    msg.channel.sendMessage(constants.responses.QUOTE.EMPTY[this.language])
    return
  }
  db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id", [quote, msg.author.username], "one")
    .then(data => msg.channel.sendMessage(constants.responses.QUOTE.ADDED[this.language](data.id)))
}

Quote.prototype.del = function(msg) {
  db.query("DELETE FROM quotes WHERE id=$1::int RETURNING id", [+msg.content.match(/\d+/g)], "one")
    .then(data => {
      db.cleanTable("quotes")
      msg.channel.sendMessage(constants.responses.QUOTE.REMOVED[this.language](data.id))
    })
    .catch(e => {
      winston.error(e)
      msg.channel.sendMessage(constants.responses.QUOTE.INVALID[this.language])
    })
}

Quote.prototype.get = function(msg) {
  let id = +msg.content.match(/\d+/g) ? +msg.content.match(/\d+/g) : null
  let query
  let values
  if (!id) {
    query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
    values = null
  } else {
    query = "SELECT * FROM quotes WHERE id=$1::int"
    values = [id]
  }

  db.query(query, values, "one")
    .then(data => msg.channel.sendMessage(constants.responses.QUOTE.GET[this.language](data.id, data.text)))
    .catch(e => {
      winston.error(e)
      msg.channel.sendMessage(constants.responses.QUOTE.MISSING[this.language])
    })
}

module.exports = Quote
