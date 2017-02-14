//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Color", function() {
  describe("add", function() {
    it("should return a discord reply with the color that has been set", function() {
      const color = "#" + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)

      return global.channel.sendMessage(`!!color ${color}`).then((initialMsg) => {
        const command = global.client.dispatcher.parseMessage(initialMsg)
        command.run()

        return global.channel.awaitMessages((m) => {
          return m.content !== `!!color ${color}` && m.author.id === global.client.user.id
        }, { maxMatches: 1 }).then((msg) => {
          const reply = msg.first().content.replace(`<@${global.client.user.id}>, `, "")

          // msg.argString has a space at the beggining
          expect(reply).to.equal(global.constants.responses.COLOR.ADDED["english"](` ${color}`))
        })
      })
    })
  })
})
