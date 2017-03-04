//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Roll", function() {
  describe("run", function() {
    it("should return a discord reply with a number from 1 to 100", function() {
      return global.channel.sendTest("roll").then((reply) => {
        expect(reply).to.be.within(1, 100)
      })
    })
  })
})
