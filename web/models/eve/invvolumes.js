//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes } = require("sequelize")
const fs = require("fs")
const YAML = require("yaml")
const { getByName } = require("./character")
const winston = require("winston")

class InvVolumes extends Model {}

module.exports = {
  db: null,
  tableName: "typeIDs",

  async init(db) {
    winston.info("Initializing invvolumes")
    this.db = db

    InvVolumes.init({
      typeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true
      },
      volume: {
        type: DataTypes.DOUBLE,
        allowNull: true
      }
    }, {
      sequelize: db,
      modelName: this.tableName
    })
  },

  async import(db) {
    // TODO
    // const file = fs.readFileSync("./sde/bsd/typeIDs.yaml", "utf8")
    // const types = YAML.parse(file)

    // const typesParsed = [] // TODO
    // for (let type of types) {
    //   typesParsed.push({

    //   })
    // }
  },

  get(id) {
    return InvVolumes.findByPk(id)
  }
}
