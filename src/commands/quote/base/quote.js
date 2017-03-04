//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const DB = require("../../../util/db.js")

module.exports = class Quote {
  constructor(client) {
    this.client = client

    this.db = new DB()

    this.quotes = new Map()
  }

  async init() {
    this.quotes = new Map()

    await this.db.query("CREATE TABLE IF NOT EXISTS quotes (id BIGSERIAL PRIMARY KEY, text TEXT, submitter BIGINT, guild BIGINT)")

    const rows = await this.db.query("SELECT id as realid, text, CAST(submitter as TEXT) as submitter, CAST(guild as TEXT) as guild FROM quotes")
    for(var row of rows) {
      const guild = row.guild
      const quotes = this.quotes.get(guild) || new Array()
      const id = quotes[quotes.length - 1] ? quotes[quotes.length - 1].id + 1 : 1
      row.id = id
      quotes.push(row)
      this.quotes.set(guild, quotes)
    }
  }

  add(data) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.db.query(
        "INSERT INTO quotes (text, submitter, guild) VALUES ($1::text, $2::bigint, $3::bigint) RETURNING id as realid, text, CAST(submitter as TEXT), CAST(guild as TEXT)",
        [data.text, data.submitter, data.guild],
        "one"
      ).then((res) => {
        const quotes = that.quotes.get(res.guild) || new Array()
        const id = quotes[quotes.length - 1] ? quotes[quotes.length - 1].id + 1 : 1
        res.id = id
        quotes.push(res)
        that.quotes.set(res.guild, quotes)
        resolve(id)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  delete(data) {
    var quotes = this.quotes.get(data.guild)
    const quote = quotes.find((quote) => { return quote.id === data.id })

    const that = this
    return new Promise(function(resolve, reject) {
      if(!quote) reject()
      that.db.query("DELETE FROM quotes WHERE id=$1::bigint", [quote.realid]).then(() => {
        quotes = _.without(quotes, quote)
        that.quotes.set(data.guild, quotes)
        resolve()
      }).catch((e) => {
        reject(e)
      })
    })
  }

  empty(guild) {
    return !this.quotes.has(guild)
  }

  get(data) {
    const quotes = this.quotes.get(data.guild)

    if(data.id) return quotes.find((quote) => { return quote.id === data.id })
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  has(data) {
    return Boolean(this.quotes.get(data.guild).find((quote) => {
      return quote.id === data.id
    }))
  }
}
