"use strict"
const pg = require("pg")
const url = require("url")
const winston = require("winston")

const params = url.parse(process.env.DATABASE_URL)
const auth = params.auth.split(":")
const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true,
  max: 10,
  idleTimeoutMillis: 1000,
}
const pool = new pg.Pool(config)

pool.on("error", function(e, client) {
  winston.error("db.js: " + e)
})

class DB {
  constructor() {}
}

DB.prototype.query = function(text, values, cb) {
  pool.connect(function(e, client, done) {
    client.query(text, values, function(e, result) {
      done()
      if(typeof cb === "function") { cb(e, result) }
    })
  })
}

DB.prototype.cleanTable = function(table, cb) {
  let query = `ALTER TABLE quotes DROP CONSTRAINT quotes_pkey;
CREATE temporary sequence temp_seq;
UPDATE quotes SET id = nextval('temp_seq');
ALTER TABLE quotes ADD primary key (id);
DROP sequence temp_seq;
SELECT setval('quotes_id_seq', (SELECT MAX(id) FROM quotes));`
  this.query(query, cb)
}

module.exports = DB
