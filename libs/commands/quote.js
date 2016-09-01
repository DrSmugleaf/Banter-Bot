"use strict"
const DB = require("../util/db.js");
const db = new DB();

class Quote {
  constructor() {};
};

Quote.prototype.addQuote = function(discord, msg) {
  let quote = msg.content.substr(msg.content.indexOf(" ") + 1);
  db.query("INSERT INTO quotes (text, submitter) VALUES ($1::text, $2::text) RETURNING id", [quote, msg.author.username], function(e, dbres) {
    if(e) {
      console.log("quote.js: " + e);
      discord.sendMessage(msg, "Error");
      return;
    };
    console.log("quote.js: added quote #" + dbres.rows[0].id);
    discord.sendMessage(msg, `Quote #${dbres.rows[0].id} a\u00f1adido`);
  });
};

Quote.prototype.delQuote = function(discord, msg) {
  let id = +msg.content.match(/\d+/g) ? +msg.content.match(/\d+/g) : undefined;
  if(isNaN(id)) { discord.sendMessage(msg, "Número de quote inválido"); };
  db.query("DELETE FROM quotes WHERE id=$1::int", [id], function(e, dbres) {
    if (e) {
      console.log("quote.js: " + e);
      discord.sendMessage(msg, "Error");
      return;
    };
    db.cleanTable("quotes", function(e, dbres) {
      if(e) {
        console.log("quote.js: " + e);
        discord.sendMessage(msg, "Error");
        return;
      };
    });
    console.log("quote.js: removed quote #" + id);
    discord.sendMessage(msg, `Quote #${id} eliminado`);
  });
};

Quote.prototype.getQuote = function(discord, msg) {
  var id = +msg.content.match(/\d+/g) ? +msg.content.match(/\d+/g) : undefined;
  if (isNaN(id)) {
    var query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) limit 1";
    var values = undefined;
  } else {
    var query = "SELECT * FROM quotes WHERE id=$1::int";
    var values = [id];
  };

  db.query(query, values, function(e, dbres) {
    if(e || typeof dbres.rows[0] == "undefined") {
      console.log("quote.js " + e);
      discord.sendMessage(msg, "Error");
      return;
    };
    console.log(`quote.js: sending quote #${dbres.rows[0].id} submitted by ${dbres.rows[0].submitter}: ${dbres.rows[0].text}`);
    discord.sendMessage(msg, `Quote #${dbres.rows[0].id}: ${dbres.rows[0].text}`);
  });
};

module.exports = Quote;
