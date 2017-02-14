//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect

describe("Color", function() {

  before(function() {
    return global.channel.sendTest("color")
  })

  after(function() {
    return global.channel.sendTest("color")
  })

  describe("add", function() {
    const color = "#" + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)

    it("should return a discord reply with the color that has been set", function() {
      return global.channel.sendTest(`color ${color}`).then((reply) => {
        expect(reply).to.equal(global.constants.responses.COLOR.ADDED["english"](` ${color}`))
      })
    })

    it("should set the color of the bot with a role named 'color-userID'", function() {
      const roleColor = global.guild.member(global.guild.client.user).roles.find(
        "name", `color-${global.client.user.id}`
      ).hexColor.toUpperCase()
      expect(color).to.equal(roleColor)
    })
  })

  describe("edit", function() {
    const color = "#" + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)

    it("should edit the bot's role color to another color and return a discord reply", function() {
      return global.channel.sendTest(`color ${color}`).then((reply) => {
        const roleColor = global.guild.member(global.guild.client.user).roles.find(
          "name", `color-${global.client.user.id}`
        ).hexColor.toUpperCase()

        expect(reply).to.equal(global.constants.responses.COLOR.EDITED["english"](` ${color}`))
        expect(color).to.equal(roleColor)
      })
    })
  })

  describe("remove", function() {

    it("should remove the bot's role color and return a discord reply", function() {
      return global.channel.sendTest("color").then((reply) => {
        const roleColor = global.guild.member(global.guild.client.user).roles.find(
          "name", `color-${global.client.user.id}`
        )

        expect(reply).to.equal(global.constants.responses.COLOR.REMOVED["english"])
        expect(roleColor).to.not.exist
      })
    })

    it("should return a discord reply saying the user has no name color", function() {
      return global.channel.sendTest("color").then((reply) => {
        expect(reply).to.equal(global.constants.responses.COLOR.NO_COLOR_ROLE["english"])
      })
    })
  })
})
