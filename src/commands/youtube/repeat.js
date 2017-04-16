//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const request = require("request-promise")
const Song = require("../youtube/base/song")
const winston = require("winston")

module.exports = class RepeatCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "repeat",
      aliases: ["repeat"],
      group: "youtube",
      memberName: "repeat",
      description: "Repeat a song",
      examples: ["repeat https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: "video",
          prompt: "What video do you want to repeat?",
          type: "string",
          validate: (video) => {
            return new Promise((resolve) => {
              request.get({
                url: "https://www.googleapis.com/youtube/v3/videos",
                qs: {
                  key: process.env.GOOGLE_KEY,
                  id: Song.id(video),
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
          },
          parse: (video) => {
            return new Promise((resolve) => {
              request.get({
                url: "https://www.googleapis.com/youtube/v3/videos",
                qs: {
                  key: process.env.GOOGLE_KEY,
                  id: Song.id(video),
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
      ]
    })
  }

  async run(msg, args) {
    args.repeat = true
    this.client.registry.resolveCommand("youtube:play").run(msg, args)
  }
}
