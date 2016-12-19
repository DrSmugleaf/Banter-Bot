//
// Copyright (c) 2016 DrSmugleaf
//

// https://github.com/Gawdl3y/discord.js-commando/blob/master/src/providers/sqlite.js
"use strict"
const commando = require("discord.js-commando")
const winston = require("winston")
const PGP = require("pg-promise")({
  error: (e) => {
    if(e.name === "QueryResultError") return
    winston.error(e)
  }
})

class PostgreSQLProvider extends commando.SettingProvider {
  constructor(db) {
    super()
    this.db = new PGP(db)

    this.qrm = {
      one: 1,
      many: 2,
      none: 4,
      any: 6
    }

    Object.defineProperty(this, "client", { value: null, writable: true })

    this.settings = new Map()

    this.listeners = new Map()

    this.insertOrReplaceStatement = null

    this.deleteStatement = null
  }

  async init(client) {
    this.client = client
    await this.db.none("CREATE TABLE IF NOT EXISTS settings (guild TEXT PRIMARY KEY, settings TEXT)")

    const rows = await this.db.any("SELECT CAST(guild as TEXT) as guild, settings FROM settings")
    for(const row of rows) {
      let settings
      try {
        settings = JSON.parse(row.settings)
      } catch(e) {
        client.emit("warn", `PostgreSQLProvider couldn't parse the settings stored for guild ${row.guild}`)
        continue
      }

      this.settings.set(row.guild || "global", settings)
      if(row.guild !== "0" && !client.guilds.has(row.guild)) continue
      this.setupGuild(row.guild || "global", settings)
    }

    this.insertOrReplaceStatement = "INSERT INTO settings (guild, settings) VALUES ($1, $2) ON CONFLICT (guild) DO UPDATE SET guild = $1, settings = $2"
    this.deleteStatement = "DELETE FROM settings WHERE guild = $1~"

    this.listeners
      .set("commandPrefixChange", (guild, prefix) => this.set(guild, "prefix", prefix))
      .set("commandStatusChange", (guild, command, enabled) => this.set(guild, `cmd-${command.name}`, enabled))
      .set("groupStatusChange", (guild, group, enabled) => this.set(guild, `grp-${group.name}`, enabled))
      .set("guildCreate", guild => {
        const settings = this.settings.get(guild.id)
        if(!settings) return
        this.setupGuild(guild.id, settings)
      })
      .set("commandRegister", command => {
        for(const [guild, settings] of this.settings) {
          if(guild !== "global" && !client.guilds.has(guild)) continue
          this.setupGuildCommand(client.guilds.get(guild), command, settings)
        }
      })
      .set("groupRegister", group => {
        for(const [guild, settings] of this.settings) {
          if(guild !== "global" && !client.guilds.has(guild)) continue
          this.setupGuildGroup(client.guilds.get(guild), group, settings)
        }
      })
    for(const [event, listener] of this.listeners) client.on(event, listener)
  }

  async destroy() {
    for(const [event, listener] of this.listeners) this.client.removeListener(event, listener)
    this.listeners.clear()
  }

  get(guild, key, defValue) {
    const settings = this.settings.get(this.constructor.getGuildID(guild))
    return settings ? settings[key] || defValue : defValue
  }

  async set(guild, key, value) {
    guild = this.constructor.getGuildID(guild)
    let settings = this.settings.get(guild)
    if(!settings) {
      settings = {}
      this.settings.set(guild, settings)
    }

    settings[key] = value
    await this.db.any(this.insertOrReplaceStatement, [(guild !== "global" ? guild.replace("\"", "'") : 0), JSON.stringify(settings)])
    if(guild === "global") this.updateOtherShards(key, value)
    return value
  }

  async remove(guild, key) {
    guild = this.constructor.getGuildID(guild)
    const settings = this.settings.get(guild)
    if(!settings || typeof settings[key] === "undefined") return undefined

    const value = settings[key]
    settings[key] = undefined
    await this.db.any(this.insertOrReplaceStatement, [(guild !== "global" ? guild.replace("\"", "'") : 0), JSON.stringify(settings)])
    if(guild === "global") this.updateOtherShards(key, undefined)
    return value
  }

  async clear(guild) {
    guild = this.constructor.getGuildID(guild)
    if(!this.settings.has(guild)) return
    this.settings.delete(guild)
    await this.db.any(this.deleteStatement, [(guild !== "global" ? guild.replace("\"", "'") : 0)])
  }

  setupGuild(guild, settings) {
    if(typeof guild !== "string") throw new TypeError("The guild must be a guild ID or \"global\".")
    guild = this.client.guilds.get(guild) || null

    if(typeof settings.prefix !== "undefined") {
      if(guild) guild._commandPrefix = settings.prefix
      else this.client._commandPrefix = settings.prefix
    }

    for(const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings)
    for(const group of this.client.registry.group.values()) this.setupGuildGroups(guild, group, settings)
  }

  setupGuildCommand(guild, group, settings) {
    if(typeof settings[`grp-${group.name}`] === "undefined") return
    if(guild) {
      if(!guild._groupsEnabled) guild._groupsEnabled = {}
      guild._groupsEnabled[group.name] = settings[`grp-${group.name}`]
    } else {
      group._globalEnabled = settings[`grp-${group.name}`]
    }
  }

  updateOtherShards(key, value) {
    if(!this.client.shard) return
    key = JSON.stringify(key)
    value = typeof value !== "undefined" ? JSON.stringify(value) : "undefined"
    this.client.shard.broadcastEval(`
      if(this.shard.id !== ${this.client.shard.id} && this.provider && this.provider.settings) {
        this.provider.settings.global[${key}] = ${value}
      }
    `)
  }
}

module.exports = PostgreSQLProvider
