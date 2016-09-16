"use strict"
const winston = require("winston")
const PGP = require("pg-promise")({
  error: (err, e) => {
    if(err.name === "QueryResultError") { return }
    winston.error(err)
  }
})
const pgp = new PGP({
  connectionString: process.env.DATABASE_URL + "?ssl=true"
})

class DB {
  constructor() {
    this.qrm = {
      one: 1,
      many: 2,
      none: 4,
      any: 6,
    }
  }
}

DB.prototype.query = function(text, values = undefined, mode = "any") {
  return pgp.query(text, values, this.qrm[mode])
}

DB.prototype.cleanTable = function(table) {
  let query = `ALTER TABLE ${table} DROP CONSTRAINT ${table}_pkey;
CREATE TEMPORARY SEQUENCE temp_seq;
UPDATE ${table} SET id = nextval('temp_seq');
ALTER TABLE ${table} ADD PRIMARY KEY(id);
DROP SEQUENCE temp_seq;
SELECT setval('${table}_id_seq', (SELECT MAX(id) FROM ${table}));`
  pgp.query(query)
}

module.exports = DB;
