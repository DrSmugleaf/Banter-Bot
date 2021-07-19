//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes } = require("sequelize")
const winston = require("winston")

class AllowedCorporations extends Model {}

module.exports = {
  db: null,

  init(db) {
    winston.info("Initializing corporations")
    this.db = db

    AllowedCorporations.init({
      name: {
        type: DataTypes.STRING(32),
        primaryKey: true
      }
    }, {
      sequelize: this.db
    })
  },

  allow(name) {
    AllowedCorporations.build({name: name}).save()
  },

  disallow(name) {
    AllowedCorporations.build({name: name}).destroy()
  },

  getAllowed() {
    return AllowedCorporations.findAll()
  },

  async isAllowed(name) {
    return AllowedCorporations.findOne({where: {name: name}}).then(c => c !== null)
  }
}
