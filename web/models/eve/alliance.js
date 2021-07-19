//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes } = require("sequelize")
const winston = require("winston")

class AllowedAlliances extends Model {}

module.exports = {
  db: null,

  init(db) {
    winston.info("Initializing alliances")
    this.db = db

    AllowedAlliances.init({
      name: {
        type: DataTypes.STRING(32),
        primaryKey: true
      }
    }, {
      sequelize: this.db
    })
  },

  allow(name) {
    AllowedAlliances.build({name: name}).save()
  },

  disallow(name) {
    AllowedAlliances.build({name: name}).destroy()
  },

  getAllowed() {
    return AllowedAlliances.findAll()
  },

  async isAllowed(name) {
    return AllowedAlliances.findByPk(name).then(c => c !== null)
  }
}
