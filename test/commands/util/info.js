//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Info", function() {
  describe("run", function() {
    it("should return a discord reply with the bot's info", function() {
      const command = global.client.registry.resolveCommand("util:info")

      return global.channel.sendMessage("!info").then((msg) => {
        command.run(msg)

        return global.channel.awaitMessages((msg) => {
          return msg.content !== "!info" && msg.author.id === global.client.user.id
        }, { maxMatches: 1 }).then((msg) => {
          const reply = msg.first().content.replace(`<@${global.client.user.id}>, `, "")
          expect(global.constants.responses.INFO["english"]).to.equal(reply)
        })
      })
    })
  })
})
