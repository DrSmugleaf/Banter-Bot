//
// Copyright (c) 2016-2017 DrSmugleaf
//

// https://github.com/Gawdl3y/discord.js-commando/blob/master/src/providers/sqlite.js
"use strict"
const DB = require("../util/db")
const SettingProvider = require("discord.js-commando").SettingProvider

class PostgreSQLProvider extends SettingProvider {
  constructor() {
    super()

    this.db = new DB()

    Object.defineProperty(this, "client", { value: null, writable: true })

    this.settings = new Map()

    this.listeners = new Map()
  }

  async init(client) {
    this.client = client
    await this.db.query("CREATE TABLE IF NOT EXISTS settings (guild BIGINT PRIMARY KEY, settings TEXT)")

    const rows = await this.db.query("SELECT CAST(guild as TEXT) as guild, settings FROM settings")
    for(const row of rows) {
      let settings
      try {
        settings = JSON.parse(row.settings)
      } catch(e) {
        client.emit("warn", `PostgreSQLProvider couldn't parse the settings stored for guild ${row.guild}`)
        continue
      }

      const guild = row.guild !== "0" ? row.guild : "global"
      this.settings.set(guild, settings)
      if(guild !== "global" && !client.guilds.has(row.guild)) continue
      this.setupGuild(guild, settings)
    }

    this.listeners
      .set("commandPrefixChange", (guild, prefix) => this.set(guild, "prefix", prefix))
      .set("commandStatusChange", (guild, command, enabled) => this.set(guild, `cmd-${command.name}`, enabled))
      .set("groupStatusChange", (guild, group, enabled) => this.set(guild, `grp-${group.id}`, enabled))
      .set("guildCreate", (guild) => {
        const settings = this.settings.get(guild.id)
        if(!settings) return
        this.setupGuild(guild.id, settings)
      })
      .set("commandRegister", (command) => {
        for(const [guild, settings] of this.settings) {
          if(guild !== "global" && !client.guilds.has(guild)) continue
          this.setupGuildCommand(client.guilds.get(guild), command, settings)
        }
      })
      .set("groupRegister", (group) => {
        for(const [guild, settings] of this.settings) {
          if(guild !== "global" && !client.guilds.has(guild)) continue
          this.setupGuildGroup(client.guilds.get(guild), group, settings)
        }
      })

    for(const [event, listener] of this.listeners) client.on(event, listener)
  }

  destroy() {
    for(const [event, listener] of this.listeners) this.client.removeListener(event, listener)
    this.listeners.clear()
  }

  get(guild, key, defVal) {
    const settings = this.settings.get(this.constructor.getGuildID(guild))
    return settings ? typeof settings[key] !== "undefined" ? settings[key] : defVal : defVal
  }

  async set(guild, key, val) {
    guild = this.constructor.getGuildID(guild)
    let settings = this.settings.get(guild)
    if(!settings) {
      settings = {}
      this.settings.set(guild, settings)
    }

    settings[key] = val
    await this.db.query(
      "INSERT OR REPLACE INTO settings VALUES($1, $2)",
      [guild !== "global" ? guild : 0, JSON.stringify(settings)]
    )
    if(guild === "global") this.updateOtherShards(key, val)
    return val
  }

  async remove(guild, key) {
    guild = this.constructor.getGuildID(guild)
    const settings = this.settings.get(guild)
    if(!settings || typeof settings[key] === "undefined") return undefined

    const val = settings[key]
    settings[key] = undefined
    await this.db.query(
      "INSERT OR REPLACE INTO settings VALUES($1, $2)",
      [guild !== "global" ? guild : 0, JSON.stringify(settings)]
    )
    if(guild === "global") this.updateOtherShards(key, undefined)
    return val
  }

  async clear(guild) {
    guild = this.constructor.getGuildID(guild)
    if(!this.settings.has(guild)) return
    this.settings.delete(guild)
    await this.db.query(
      "DELETE FROM settings WHERE guild = $1",
      [guild !== "global" ? guild : 0]
    )
  }

  setupGuild(guild, settings) {
    if(typeof guild !== "string") throw new TypeError("The guild must be a guild ID or 'global'.")
    guild = this.client.guilds.get(guild) || null

    if(typeof settings.prefix !== "undefined") {
      if(guild) guild._commandPrefix = settings.prefix
      else this.client._commandPrefix = settings.prefix
    }

    for(const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings)
    for(const group of this.client.registry.groups.values()) this.setupGuildGroup(guild, group, settings)
  }

  setupGuildCommand(guild, command, settings) {
    if(typeof settings[`cmd-${command.name}`] === "undefined") return
    if(guild) {
      if(!guild._commandsEnabled) guild._commandsEnabled = {}
      guild._commandsEnabled[command.name] = settings[`cmd-${command.name}`]
    } else {
      command._globalEnabled = settings[`cmd-${command.name}`]
    }
  }

  setupGuildGroup(guild, group, settings) {
    if(typeof settings[`grp-${group.id}`] === "undefined") return
    if(guild) {
      if(!guild._groupsEnabled) guild._groupsEnabled = {}
      guild._groupsEnabled[group.id] = settings[`grp-${group.id}`]
    } else {
      group._globalEnabled = settings[`grp-${group.id}`]
    }
  }

  updateOtherShards(key, val) {
    if(!this.client.shard) return
    key = JSON.stringify(key)
    val = typeof val !== "undefined" ? JSON.stringify(val) : "undefined"
    this.client.shard.broadcastEval(`
      if(this.shard.id !== ${this.client.shard.id} && this.provider && this.provider.settings) {
        this.provider.settings.global[${key}] = ${val}
      }
    `)
  }
}

module.exports = PostgreSQLProvider
