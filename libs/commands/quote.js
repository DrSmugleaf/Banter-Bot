"use strict"
const DB = require("../util/db.js");
const db = new DB();

class Quote {
  constructor() {};
};

Quote.prototype.addQuote = function(msg) {
  let quote = msg.content.substr(msg.content.indexOf(" ") + 1);
  db.query("INSERT INTO quotes (text, submitter) VALUES ('$1::text', '$2::text') RETURNING id", [quote, msg.author.username], function(e, dbres) {
    if(e) {
      console.log("quote.js: " + e);
      return "Error";
    };
    console.log("quote.js: added quote #" + dbres.rows[0].id);
    return `Quote #${dbres.rows[0].id} a\u00f1adido`;
  });
};

Quote.prototype.delQuote = function(msg) {
  msg.content.match(/\d+/g) ? let id = msg.content.match(/\d+/g) : return "Número de quote inválido";
  db.query("DELETE FROM quotes WHERE id=$1::number", [id], function(e, dbres) {
    if (e) {
      console.log("quote.js: " + e);
      return "Error";
    };
    db.cleanTable("quotes", function(e, dbres) {
      if(e) {
        console.log("quote.js: " + e);
      };
    });
    console.log("quote.js: removed quote #" + id);
    return `Quote #${id} eliminado`
  });
};

Quote.prototype.getQuote = function(msg) {
  msg.content.match(/\d+/g) ? let id = msg.content.match(/\d+/g) : let id;
  if (isNaN(id)) {
    var query = "SELECT id, text, submitter FROM quotes OFFSET random() * (SELECT count(*)-1 FROM quotes) limit 1";
  } else {
    var query = "SELECT * FROM quotes WHERE id=$1::number";
  };

  db.query(query, [id], function(e, dbres) {
    if(e || typeof dbres.rows[0] == "undefined") {
      console.log("quote.js " + e);
      return "Error";
    };
    console.log(`quote.js: sending quote #${dbres.rows[0].id} submitted by ${dbres.rows[0].submitter}: ${dbres.rows[0].text}`);
    return `Quote #${dbres.rows[0].id}: ${dbres.rows[0].text}`;
  });
};

module.exports = Quote;
