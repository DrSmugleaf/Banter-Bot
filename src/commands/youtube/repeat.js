//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

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
          type: "video"
        }
      ]
    })
  }

  async run(msg, args) {
    args.repeat = true
    this.client.registry.resolveCommand("youtube:play").run(msg, args)
  }
}
