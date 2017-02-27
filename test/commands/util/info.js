//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Info", function() {
  describe("run", function() {
    it("should return a discord reply with the bot's info", function() {
      return global.channel.sendTest("info").then((reply) => {
        expect(reply).to.equal(global.constants.responses.INFO["english"])
      })
    })
  })
})
