"use strict"
const DB = require("../util/db.js")
const db = new DB()
const winston = require("winston")

function _boldNames(quote) {
  return quote.replace(/(...\w* - \w*\b.*)/g, "**$1**")
}

class Quote {
  constructor() {}
}

Quote.prototype.addQuote = function(msg) {
  let quote = _boldNames(msg.content.replace("+quote", ""))
  if(!quote) {
    msg.channel.sendMessage("Quote vacío, a\u00f1ade texto después del comando")
    return
  }
  db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id", [quote, msg.author.username], "one")
    .then(data => msg.channel.sendMessage(`Quote #${data.id} a\u00f1adido`))
}

Quote.prototype.delQuote = function(msg) {
  db.query("DELETE FROM quotes WHERE id=$1::int RETURNING id", [+msg.content.match(/\d+/g)], "one")
    .then(data => {
      db.cleanTable("quotes")
      msg.channel.sendMessage(`Quote #${data.id} eliminado`)
    })
    .catch(e => {
      msg.channel.sendMessage("Número de quote inválido")
    })
}

Quote.prototype.getQuote = function(msg) {
  let id = +msg.content.match(/\d+/g) ? +msg.content.match(/\d+/g) : null
  if (isNaN(id)) {
    var query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
    var values = null
  } else {
    var query = "SELECT * FROM quotes WHERE id=$1::int"
    var values = [id]
  }

  db.query(query, values, "one")
    .then(data => msg.channel.sendMessage(`Quote #${data.id}: ${data.text}`))
    .catch(e => {
      msg.channel.sendMessage("Ese quote no existe")
    })
}

module.exports = Quote
