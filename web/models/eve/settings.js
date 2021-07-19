//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes } = require("sequelize")
const winston = require("winston")

class Settings extends Model {}

module.exports = {
  db: null,

  async init(db) {
    winston.info("Initializing settings")
    this.db = db

    Settings.init({
      maxVolume: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 300000
      }
    }, {
      sequelize: this.db
    })
  },

  get() {
    return Settings.findAll()
  },

  set(data) {
    return Settings.upsert(Settings.build(data))
  }
}