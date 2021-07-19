//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes } = require("sequelize")
const winston = require("winston")

class EveDestinations extends Model {}

module.exports = {
  EveDestinations: EveDestinations,
  db: null,

  async init(db) {
    winston.info("Initializing destinations")
    this.db = db

    EveDestinations.init({
      name: {
        type: DataTypes.STRING(32),
        primaryKey: true
      },
      image: {
        type: DataTypes.TEXT({
          length: "tiny"
        }),
        allowNull: false
      }
    }, {
      sequelize: this.db
    })
  },

  add(data) {
    return EveDestinations.build(data).save()
  },

  get(name) {
    return EveDestinations.findOne({where: {name: name}})
  },

  getAll() {
    return EveDestinations.findAll()
  },

  remove(name) {
    return EveDestinations.findOne({name: name}).destroy()
  }
}