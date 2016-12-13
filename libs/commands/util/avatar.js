//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const request = require("request").defaults({encoding: null})
const winston = require("winston")

module.exports = class Avatar extends commando.Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: ["avatar", "image"],
      group: "util",
      memberName: "avatar",
      description: "Change the bot's image",
      examples: ["avatar http://i.imgur.com/DJcsFvt.png"],
      args: [
        {
          key: "url",
          prompt: "The url of the image to apply",
          type: "string"
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.author.id === this.client.options.owner
  }

  async run(msg, args) {
    const link = request.get(args.url)
    request.get(link, function(e, res, body) {
      if(!e && res.statusCode == 200) {
        msg.client.user.setAvatar(new Buffer(body))
          .catch(winston.error)
      }
    })
  }
}
