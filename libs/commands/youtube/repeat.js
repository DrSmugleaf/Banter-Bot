//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const request = require("request-promise")
const validurl = require("valid-url")

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
      args: [
        {
          key: "url",
          prompt: "What video do you want to repeat?",
          type: "string",
          validate: (url) => {
            if(validurl.isWebUri(url)) {
              return request(url, function(e, res) {
                return !e && res.statusCode === 200
              })
            }
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
