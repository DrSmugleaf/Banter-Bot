//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const constants = require("../../../util/constants")
const Discord = require("discord.js")
const responses = constants.responses
const winston = require("winston")
const ytdl = require("ytdl-core")

module.exports = {
  queue: new Map(),

  addToQueue(guild, song) {
    const queue = this.queue.get(guild.id) || []

    queue.push(song)
    this.queue.set(guild.id, queue)

    if(queue.length <= 1) {
      this.playNext(guild)
    } else {
      queue[0].repeat = false
    }
  },

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

    return Boolean(this.isPlaying(guild) && this.isPaused(guild))
  },

  isCurrentlyPlaying(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(this.isPlaying(guild) && !this.isPaused(guild))
  },

  isInVoiceChannel(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(guild.voiceConnection)
  },

  isMemberInVoiceChannel(member) {
    if(!(member instanceof Discord.GuildMember)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(member.voiceChannel)
  },

  isPaused(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(!this.isQueueEmpty(guild) && this.dispatcher(guild).paused)
  },

  isPlaying(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(!this.isQueueEmpty(guild) && this.dispatcher(guild))
  },

  isReady(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(this.dispatcher(guild))
  },

  isSameVoiceChannel(member) {
    if(!(member instanceof Discord.GuildMember)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(member.voiceChannel && member.voiceChannel.connection &&
      member.voiceChannel.connection === member.guild.voiceConnection)
  },

  isQueueEmpty(guild) {
    if(!(guild instanceof Discord.Guild)) {
      throw new TypeError("Guild must be an instance of Discord.Guild")
    }

    return Boolean(!this.queue.has(guild.id) || !this.queue.get(guild.id)[0])
  },

  joinVoice(voiceChannel) {
    if(!(voiceChannel instanceof Discord.VoiceChannel)) {
      throw new TypeError("VoiceChannel must be an instance of Discord.VoiceChannel")
    }

    const voiceConnection = voiceChannel.guild.voiceConnection

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
      next.textChannel.sendMessage(
        responses.LEFT_VOICE[next.message.language]
      )
      return this.playNext(guild)
    }

    if(!next.voiceChannel.joinable) {
      next.textChannel.sendMessage(responses.CANT_CONNECT_ANYMORE[next.message.language](next.channel.name))
      return this.playNext(guild)
    }
    if(!next.voiceChannel.speakable) {
      next.textChannel.sendMessage(responses.CANT_SPEAK_ANYMORE[next.message.language](next.channel.name))
      return this.playNext(guild)
    }

    this.joinVoice(next.voiceChannel).then(voiceConnection => {
      const stream = ytdl(next.url, { filter: "audioonly" }).on("error", (e) => {
        winston.error(e)
        return next.textChannel.sendMessage(
          responses.NEXT.DISPATCHER_ERROR[next.message.language](next.video.title)
        )
      })

      voiceConnection.playStream(
        stream, constants.youtube.STREAM_OPTIONS
      ).on("end", (reason) => {
        next.repeated = true
        if(reason === "skip") next.repeat = false
        if(!next.repeat) queue.shift()
        return this.playNext(next.guild)
      }).on("error", (e) => {
        winston.error(e)
        queue.shift()
        this.playNext(guild)
        return next.textChannel.sendMessage(
          responses.NEXT.DISPATCHER_ERROR[next.message.language](next.video.title)
        )
      })

      if(next.repeat && !next.repeated) {
        return next.textChannel.sendMessage(
          responses.NEXT.REPEAT[next.message.language](next.video.title)
        )
      } else if(!next.repeated) {
        return next.textChannel.sendMessage(
          responses.NEXT.PLAY[next.message.language](next.video.title)
        )
      }
    }).catch(e => {
      winston.error(e)
      next.textChannel.sendMessage(
        responses.NEXT.ERROR[next.message.language](next.video.title)
      )
      return this.playNext(guild)
    })
  }
}
