//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const request = require("request-promise")
const Song = require("../commands/youtube/base/song")
const winston = require("winston")

module.exports = class VideoArgumentType extends commando.ArgumentType {
  constructor(client) {
    super(client, "video")
  }

  validate(value) {
    return new Promise((resolve) => {
      request.get({
        url: "https://www.googleapis.com/youtube/v3/videos",
        qs: {
          key: process.env.GOOGLE_KEY,
          id: Song.id(value),
          part: "snippet"
        },
        json: true
      }).then((video) => {
        video = video.items[0]
        if(!video) return resolve(false)
        if(video.snippet.liveBroadcastContent !== "none") return resolve(false)
        resolve(true)
      }).catch((e) => {
        winston.error(e)
        resolve(false)
      })
    })
  }

  parse(value) {
    return new Promise((resolve) => {
      request.get({
        url: "https://www.googleapis.com/youtube/v3/videos",
        qs: {
          key: process.env.GOOGLE_KEY,
          id: Song.id(value),
          part: "snippet"
        },
        json: true
      }).then((video) => {
        video = video.items[0]
        video.url = `https://www.youtube.com/watch?v=${video.id}`
        resolve(video)
      }).catch((e) => {
        winston.error(e)
        resolve(null)
      })
    })
  }
}
