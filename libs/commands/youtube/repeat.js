//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const Youtube = require("simple-youtube-api")
const youtube = new Youtube(process.env.GOOGLE_KEY)

module.exports = class Repeat extends commando.Command {
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
          key: "url",
          prompt: "What video do you want to repeat?",
          type: "string",
          validate: (url) => {
            return youtube.getVideo(url).then(() => {
              return true
            }).catch(() => {
              return false
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
