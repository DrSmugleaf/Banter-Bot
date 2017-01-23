//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const constants = require("../../../util/constants")
const Discord = require("discord.js")
const winston = require("winston")
const ytdl = require("ytdl-core")

module.exports = {
  queue: new Map(),

  dispatcher(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }
    if(!this.isInVoiceChannel(guild)) return

    return guild.voiceConnection.player.dispatcher
  },

  isCurrentlyPaused(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return this.isPlaying(guild) && this.isPaused(guild)
  },

  isCurrentlyPlaying(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return this.isPlaying(guild) && !this.isPaused(guild)
  },

  isInVoiceChannel(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return guild.voiceConnection
  },

  isMemberInVoiceChannel(member) {
    if(!(member instanceof Discord.GuildMember)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return member.voiceChannel
  },

  isPaused(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return !this.isQueueEmpty(guild) && this.dispatcher(guild).paused
  },

  isPlaying(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return !this.isQueueEmpty(guild) && this.dispatcher(guild)
  },

  isReady(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return this.dispatcher(guild)
  },

  isSameVoiceChannel(member) {
    if(!(member instanceof Discord.GuildMember)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return member.voiceChannel && member.voiceChannel.connection &&
      member.voiceChannel.connection === member.guild.voiceConnection
  },

  isQueueEmpty(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return !this.queue.has(guild.id) || !this.queue.get(guild.id)[0]
  },

  joinVoice(member) {
    if(!(member instanceof Discord.GuildMember)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    const voiceChannel = member.voiceChannel
    const voiceConnection = member.guild.voiceConnection

    return new Promise(function(resolve, reject) {
      if(voiceConnection && voiceConnection == voiceChannel.connection) {
        resolve(voiceConnection)
      } else {
        voiceChannel.join().then(resolve).catch(reject)
      }
    })
  },

  playNext(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }
    if(this.isQueueEmpty(guild)) return

    const queue = this.queue.get(guild.id)
    const next = queue[0]
    if(!this.isMemberInVoiceChannel(next.member)) {
      next.channel.sendMessage(constants.responses.YOUTUBE.LEFT_VOICE[next.member.language])
      return this.playNext(guild)
    }

    const voicePermissions = next.member.voiceChannel.permissionsFor(guild.client.user)
    if(!voicePermissions.hasPermission("CONNECT")) {
      next.channel.sendMessage(constants.responses.YOUTUBE.CANT_CONNECT_ANYMORE[next.member.language])
      return this.playNext(guild)
    }
    if(!voicePermissions.hasPermission("SPEAK")) {
      next.channel.sendMessage(constants.responses.YOUTUBE.CANT_SPEAK_ANYMORE[next.member.language])
    }

    const stream = ytdl(next.url, { filter: "audioonly" })

    this.joinVoice(next.member).then(voiceConnection => {
      voiceConnection.playStream(
        stream, constants.youtube.STREAMOPTIONS
      ).on("end", (reason) => {
        next.repeated = true
        if(reason === "skip") next.repeat = false
        if(!next.repeat) queue.shift()

        return this.playNext(next.guild)
      })

      if(next.repeat && !next.repeated) {
        return next.channel.sendMessage(
          constants.responses.YOUTUBE.NEXT.REPEAT[next.member.language || next.guild.language || next.author.language || "english"](next.video.title)
        )
      } else if(!next.repeated) {
        return next.channel.sendMessage(
          constants.responses.YOUTUBE.NEXT.PLAY[next.member.language || next.guild.language || next.author.language || "english"](next.video.title)
        )
      }
    }).catch(e => {
      winston.error(e)
      next.channel.sendMessage(constants.responses.YOUTUBE.NEXT.ERROR[next.member.language || next.guild.language || next.author.language || "english"](next.url))
    })
  }
}
