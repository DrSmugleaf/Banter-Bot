//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Magic 8 Ball", function() {
  describe("run", function() {
    it("should return a discord reply with 1 of 21 magic 8 ball responses", function() {
      return global.channel.sendTest("8").then((reply) => {
        expect(global.constants.responses.MAGIC8BALL["english"]).to.include(reply)
      })
    })
  })
})
