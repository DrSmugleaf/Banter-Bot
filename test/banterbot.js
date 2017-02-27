//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const client = require("../banterbot").client
const constants = require("../src/util/constants")

before(function(done) {
  global.constants = constants
  global.client = client

  client.once("dbReady", () => {
    global.guild = client.guilds.get("260158980343463937")
    global.member = global.guild.member(global.guild.client.user)
    global.guild.createChannel("test", "text").then((channel) => {
      global.channel = channel
      global.channel.sendTest = function(message) {
        return new Promise(function(resolve) {
          const commandPrefix = global.guild.commandPrefix
          const prefix = commandPrefix ? commandPrefix : commandPrefix === "" ?
            `<@${global.client.user.id}>` : global.client.options.commandPrefix

          global.channel.sendMessage(prefix + message).then((initialMsg) => {
            const command = global.client.dispatcher.parseMessage(initialMsg)
            command.command.throttling = null
            command.run()

            return global.channel.awaitMessages((m) => {
              return m.author.id === global.client.user.id && m.id !== initialMsg.id
            }, { maxMatches: 1 }).then((msg) => {
              const reply = msg.first().content.replace(`<@${global.client.user.id}>, `, "")
              resolve(reply)
            })
          })
        })
      }

      done()
    })
  })
})

after(function() {
  return global.channel.delete()
})
