//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const main = require("./base/main")

module.exports = class Queue extends commando.Command {
  constructor(client) {
    super(client, {
      name: "queue",
      aliases: ["queue"],
      group: "youtube",
      memberName: "queue",
      description: "See the current video queue",
      examples: ["queue"],
      guildOnly: true
    })
  }

  async run(msg) {
    if(main.isQueueEmpty(msg.guild)) {
      return msg.reply("There are no queued songs.")
    }

    const queue = main.queue.get(msg.guild.id)

    return msg.reply(`There are ${queue.length} songs in the queue`)
  }
}
