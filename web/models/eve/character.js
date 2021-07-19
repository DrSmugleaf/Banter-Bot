//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes } = require("sequelize")
const winston = require("winston")

class EveCharacters extends Model {}
class EveBannedCharacters extends Model {}

module.exports = {
  db: null,

  async init(db) {
    winston.info("Initializing characters")
    this.db = db

    EveCharacters.init({
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true
      },
      token: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      characterName: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      characterPortrait: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      characterBirthday: {
        type: DataTypes.DATE,
        allowNull: false
      },
      corporationId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      corporationName: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      corporationPortrait: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      allianceId: {
        type: DataTypes.BIGINT.UNSIGNED
      },
      allianceName: {
        type: DataTypes.TEXT("tiny")
      },
      alliancePortrait: {
        type: DataTypes.TEXT("tiny")
      },
      freighter: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      director: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    }, {
      sequelize: this.db
    })

    EveBannedCharacters.init({
      name: {
        type: DataTypes.STRING(32),
        primaryKey: true
      }
    }, {
      sequelize: this.db
    })
  },

  ban(name) {
    EveBannedCharacters.build({name: name}).save()
  },

  delete(id) {
    EveCharacters.build({id: id}).destroy()
  },

  get(id) {
    return EveCharacters.findByPk(id)
  },

  getBanned() {
    return EveBannedCharacters.findAll()
  },

  getByName(name) {
    return EveCharacters.findOne({where: {name: name}})
  },

  getByToken(token) {
    return EveCharacters.findAll({where: {token: token}})
  },

  getFreighters() {
    return EveCharacters.findAll({where: {freighter: true}})
  },

  async isBanned(name) { // TODO use id
    return EveBannedCharacters.findByPk(name).then(c => c !== null)
  },

  async set(data) {
    await EveCharacters.upsert(data)
  },

  unban(name) { // TODO use id
    return EveBannedCharacters.build({name: name}).destroy()
  }
}
