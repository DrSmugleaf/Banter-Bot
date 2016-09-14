"use strict"
const DB = require("../util/db.js")
const db = new DB()
const winston = require("winston")

class Quote {
  constructor() {}
}

Quote.prototype.addQuote = function(msg) {
  let quote = msg.content.substr(msg.content.indexOf(" ") + 1)
  db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id", [quote, msg.author.username], function(e, dbres) {
    if(e) {
      winstor.error("quote.js: " + e)
      msg.channel.sendMessage("Error")
      return
    }
    winston.log("quote.js: added quote #" + dbres.rows[0].id)
    msg.channel.sendMessage(`Quote #${dbres.rows[0].id} a\u00f1adido`)
  })
}

Quote.prototype.delQuote = function(msg) {
  let id = +msg.content.match(/\d+/g) ? +msg.content.match(/\d+/g) : undefined
  if(isNaN(id)) {
    msg.channel.sendMessage("Número de quote inválido")
    return
  }
  db.query("DELETE FROM quotes WHERE id=$1::int RETURNING id", [id], function(e, dbres) {
    if (e) {
      winston.error("quote.js: " + e)
      msg.channel.sendMessage("Error")
      return
    }
    db.cleanTable("quotes", function(e, dbres) {
      if(e) {
        winston.error("quote.js: " + e)
        msg.channel.sendMessage("Error")
        return
      }
    })
    winston.log("quote.js: removed quote #" + id)
    msg.channel.sendMessage(`Quote #${id} eliminado`)
  })
}

Quote.prototype.getQuote = function(msg) {
  var id = +msg.content.match(/\d+/g) ? +msg.content.match(/\d+/g) : undefined
  if (isNaN(id)) {
    var query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) LIMIT 1"
    var values = undefined
  } else {
    var query = "SELECT * FROM quotes WHERE id=$1::int"
    var values = [id]
  }

  db.query(query, values, function(e, dbres) {
    if(e || !dbres.rows[0]) {
      if(!id) {
        msg.channel.sendMessage(`No existe ningún quote`)
        return
      }
      winston.error("quote.js " + e)
      msg.channel.sendMessage(`Quote #${id} no existe`)
      return
    }
    winston.log(`quote.js: sending quote #${dbres.rows[0].id} submitted by ${dbres.rows[0].submitter}: ${dbres.rows[0].text}`)
    msg.channel.sendMessage(`Quote #${dbres.rows[0].id}: ${dbres.rows[0].text}`)
  })
}

module.exports = Quote
