//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Roll", function() {
  describe("run", function() {
    it("should return a discord reply with a number from 1 to 100", function() {
      const command = global.client.registry.resolveCommand("misc:roll")

      return global.channel.sendMessage("!roll").then((msg) => {
        command.run(msg)

        return global.channel.awaitMessages((msg) => {
          return msg.content !== "!roll" && msg.author.id === global.client.user.id
        }, { maxMatches: 1 }).then((msg) => {
          const reply = msg.first().content.replace(`<@${global.client.user.id}>, `, "")
          expect(reply).to.be.within(1, 100)
        })
      })
    })
  })
})
