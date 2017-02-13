//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const assert = require("chai").assert

describe("Magic 8 Ball", function() {
  describe("run", function() {
    it("should return a discord reply with 1 of 21 magic 8 ball responses", function() {
      const command = global.client.registry.resolveCommand("misc:8ball")

      return global.channel.sendMessage("!8").then((msg) => {
        command.run(msg)

        return global.channel.awaitMessages((msg) => {
          return msg.content !== "!8" && msg.author.id === global.client.user.id
        }, { maxMatches: 1 }).then((msg) => {
          const reply = msg.first().content.replace(`<@${global.client.user.id}>, `, "")
          assert.include(global.constants.responses.MAGIC8BALL["english"], reply)
        })
      })
    })
  })
})
