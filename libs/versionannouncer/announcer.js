//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")
const DB = require("../util/db")
const db = new DB()
const stripIndents = require("common-tags").stripIndents

module.exports = class Announcer {
  constructor(discord) {
    this.discord = discord

    this.discord.on("ready", () => this.checkVersion())
  }

  checkVersion() {
    if(process.env.NODE_ENV === "dev") return
    
    db.query(
      "SELECT guild, settings FROM settings WHERE guild = '0'", null, "one"
    ).then((data) => {
      const settings = JSON.parse(data.settings)
      const version = parseInt(settings.version, 10)
      const newVersion = (version + 1).toString()

      if(version < Object.keys(constants.versions).length + 1) {
        this.discord.guilds.forEach(guild => {
          const language = guild.settings.get("server-language", "english")
          guild.defaultChannel.sendMessage(stripIndents`
            @everyone
            ${constants.versions[newVersion][language]}
          `)
        })
        settings.version++
        db.query("UPDATE settings SET settings = $1 WHERE guild = '0'", [JSON.stringify(settings)], "none")
      }
    })
  }
}
