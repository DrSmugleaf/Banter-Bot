//
// Copyright (c) 2016-2017 DrSmugleaf
//

// https://github.com/Gawdl3y/discord.js-commando/blob/master/src/providers/sqlite.js
"use strict"
const DB = require("../util/db")
const Discord = require("discord.js")
const SettingProvider = require("discord.js-commando").SettingProvider

class PostgreSQLProvider extends SettingProvider {
  constructor() {
    super()

    this.db = new DB()

    Object.defineProperty(this, "client", { value: null, writable: true })

    this.guildSettings = new Map()

    this.guildListeners = new Map()

    this.userSettings = new Map()
  }

  async init(client) {
    this.client = client

    Promise.all([
      this.guildInit(),
      this.userInit()
    ]).then(() => this.client.emit("dbReady"))
  }

  async guildInit() {
    await this.db.query("CREATE TABLE IF NOT EXISTS settings (guild BIGINT PRIMARY KEY, settings TEXT)")

    const rows = await this.db.query("SELECT CAST(guild as TEXT) as guild, settings FROM settings")
    for(const row of rows) {
      let settings
      try {
        settings = JSON.parse(row.settings)
      } catch(e) {
        this.client.emit("warn", `PostgreSQLProvider couldn't parse the settings stored for guild ${row.guild}`)
        continue
      }

      const guild = row.guild !== "0" ? row.guild : "global"
      this.guildSettings.set(guild, settings)
      if(guild !== "global" && !this.client.guilds.has(row.guild)) continue
      this.setupGuild(guild, settings)
    }

    this.guildListeners
      .set("commandPrefixChange", (guild, prefix) => this.set(guild, "prefix", prefix))
      .set("commandStatusChange", (guild, command, enabled) => this.set(guild, `cmd-${command.name}`, enabled))
      .set("groupStatusChange", (guild, group, enabled) => this.set(guild, `grp-${group.id}`, enabled))
      .set("guildCreate", (guild) => {
        const settings = this.guildSettings.get(guild.id)
        if(!settings) return
        this.setupGuild(guild.id, settings)
      })
      .set("commandRegister", (command) => {
        for(const [guild, settings] of this.guildSettings) {
          if(guild !== "global" && !this.client.guilds.has(guild)) continue
          this.setupGuildCommand(this.client.guilds.get(guild), command, settings)
        }
      })
      .set("groupRegister", (group) => {
        for(const [guild, settings] of this.guildSettings) {
          if(guild !== "global" && !this.client.guilds.has(guild)) continue
          this.setupGuildGroup(this.client.guilds.get(guild), group, settings)
        }
      })

    for(const [event, listener] of this.guildListeners) this.client.on(event, listener)
  }

  async userInit() {
    await this.db.query("CREATE TABLE IF NOT EXISTS users (id BIGINT PRIMARY KEY, settings TEXT)")

    const rows = await this.db.query("SELECT CAST(user as TEXT) as id, settings FROM users")
    for(const row of rows) {
      let settings
      try {
        settings = JSON.parse(row.settings)
      } catch(e) {
        this.client.emit("warn", `PostgreSQLProvider couldn't parse the settings stored for user ${row.user}`)
        continue
      }

      const user = row.user
      this.userSettings.set(user, settings)
    }
  }

  destroy() {
    for(const [event, listener] of this.guildListeners) this.client.removeListener(event, listener)
    this.guildListeners.clear()
  }

  get(unit, key, defVal) {
    var settings
    if(unit instanceof Discord.Guild) {
      settings = this.guildSettings.get(this.constructor.getGuildID(unit))
    } else if(unit instanceof Discord.GuildMember || unit instanceof Discord.User) {
      settings = this.userSettings.get(this.getUserID(unit))
    } else {
      throw new TypeError("Unit must be an instance of Discord.Guild, Discord.GuildMember or Discord.User")
    }

    return settings ? typeof settings[key] !== "undefined" ? settings[key] : defVal : defVal
  }

  async set(unit, key, val) {
    if(unit instanceof Discord.Guild) {
      const guild = this.constructor.getGuildID(unit)
      let settings = this.guildSettings.get(guild)
      if(!settings) {
        settings = {}
        this.guildSettings.set(guild, settings)
      }

      settings[key] = val
      await this.db.query(
        "INSERT INTO settings VALUES ($1, $2) ON CONFLICT (guild) DO UPDATE SET guild = $1, settings = $2",
        [guild !== "global" ? guild : 0, JSON.stringify(settings)]
      )
      if(guild === "global") this.updateOtherShards(key, val)
      return val
    } else if(unit instanceof Discord.GuildMember || unit instanceof Discord.User) {
      const user = this.getUserID(unit)
      let settings = this.userSettings.get(user)
      if(!settings) {
        settings = {}
        this.userSettings.set(user, settings)
      }

      settings[key] = val
      await this.db.query(
        "INSERT INTO users VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET id = $1, settings = $2",
        [user, JSON.stringify(settings)]
      )
      this.updateOtherShards(key, val)
      return val
    } else {
      throw new TypeError("Unit must be an instance of Discord.Guild, Discord.GuildMember or Discord.User")
    }
  }

  async remove(unit, key) {
    if(unit instanceof Discord.Guild) {
      const guild = this.constructor.getGuildID(unit)
      const settings = this.guildSettings.get(guild)
      if(!settings || typeof settings[key] === "undefined") return undefined

      const val = settings[key]
      settings[key] = undefined
      await this.db.query(
        "INSERT INTO settings VALUES ($1, $2) ON CONFLICT (guild) DO UPDATE SET guild = $1, settings = $2",
        [guild !== "global" ? guild : 0, JSON.stringify(settings)]
      )
      if(guild === "global") this.updateOtherShards(key, undefined)
      return val
    } else if(unit instanceof Discord.GuildMember || unit instanceof Discord.User) {
      const user = this.getUserID(unit)
      const settings = this.userSettings.get(user)
      if(!settings || typeof settings[key] === "undefined") return undefined

      const val = settings[key]
      settings[key] = undefined
      await this.db.query(
        "INSERT INTO users VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET id = $1, settings = $2",
        [user, JSON.stringify(settings)]
      )
      this.updateOtherShards(key, undefined)
      return val
    }
  }

  async clear(unit) {
    if(unit instanceof Discord.Guild) {
      const guild = this.constructor.getGuildID(unit)
      if(!this.guildSettings.has(guild)) return
      this.guildSettings.delete(guild)
      await this.db.query(
        "DELETE FROM settings WHERE guild = $1",
        [guild !== "global" ? guild : 0]
      )
    } else if(unit instanceof Discord.GuildMember || unit instanceof Discord.User) {
      const user = this.getUserID(unit)
      if(!this.userSettings.has(user)) return
      this.userSettings.delete(user)
      await this.db.query(
        "DELETE FROM users WHERE user = $1",
        [user]
      )
    }
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

  getUserID(user) {
    return user.id
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
