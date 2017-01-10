//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const stripIndents = require("common-tags").stripIndents
const winston = require("winston")
const PGP = require("pg-promise")({
  error: (e) => {
    if(e.name === "QueryResultError") return
    return winston.error(e)
  }
})
const pgp = new PGP(process.env.DATABASE_URL.includes("?ssl=true") ?
  process.env.DATABASE_URL : process.env.DATABASE_URL + "?ssl=true")

class DB {
  constructor() {
    this.pgp = pgp
    this.qrm = {
      one: 1,
      many: 2,
      none: 4,
      any: 6
    }
    this.cleanTableQuery = (table) => stripIndents`
      ALTER TABLE ${table} DROP CONSTRAINT ${table}_pkey;
      CREATE TEMPORARY SEQUENCE temp_seq;
      UPDATE ${table} SET id = nextval('temp_seq');
      ALTER TABLE ${table} ADD PRIMARY KEY(id);
      DROP SEQUENCE temp_seq;
      SELECT setval('${table}_id_seq', (SELECT MAX(id) FROM ${table}));`
    this.vacuumQuery = (table) => stripIndents`
      VACUUM (ANALYZE) ${table}`
  }

  query(text, values = null, mode = "any") {
    return this.pgp.query(text, values, this.qrm[mode])
  }

  cleanTable(table) {
    return this.pgp.query(this.cleanTableQuery(table)) && this.vacuum(table)
  }

  vacuum(table) {
    return this.pgp.query(this.vacuumQuery(table))
  }
}

module.exports = DB
