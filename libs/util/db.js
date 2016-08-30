"use strict"
const pg = require("pg");
const Pool = require("pg-pool");
const pool = new Pool(config);
const url = require("url");

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(":");
const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true,
  max: 10,
  idleTimeoutMillis: 1000,
};

pool.on("error", function(e, client) {
  console.log("db.js: " + e)
});

class DB {
  constructor() {};
}

DB.prototype.query = function(text, values, cb) {
  pool.connect(function(e, client, done) {
    client.query(text, values, function(e, result) {
      done();
      cb(e, result)
    });
  });
};

DB.prototype.cleanTable = function(table, cb) {
  let query = `ALTER TABLE ${table} DROP CONSTRAINT ${table}_pkey;
CREATE temporary sequence temp_seq;
UPDATE ${table} SET id = nextval("temp_seq");
ALTER TABLE ${table} ADD primary key (id);
DROP sequence temp_seq;
SELECT setval("${table}_id_seq", (SELECT MAX(id) FROM ${table}));`
  this.query(query, cb);
};

module.exports = DB;
