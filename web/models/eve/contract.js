//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

const { Model, DataTypes, Sequelize } = require("sequelize")
const winston = require("winston")

class EveContracts extends Model {}

module.exports = {
  db: null,

  init(db) {
    winston.info("Initializing contracts")
    this.db = db

    EveContracts.init({
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      link: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      destination: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      value: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      valueFormatted: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      valueShort: {
        type: DataTypes.TEXT("tinby"),
        allowNull: false
      },
      quote: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      quoteFormatted: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      quoteShort: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      volume: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
      },
      volumeFormatted: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      valueVolumeRatio: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      valueVolumeRatioFormatted: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      multiplier: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false
      },
      submitterId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      submitterName: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      submitted: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      submittedFormatted: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      status: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      freighterId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      freighterName: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false
      },
      taxed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    }, {
      sequelize: this.db
    })
  },

  delete(id) {
    return EveContracts.build({id: id}).destroy()
  },

  get(id) {
    return EveContracts.findByPk(id)
  },

  getAllPending(characterID) {
    if (characterID) {
      return EveContracts.findAll({
        where: Sequelize.and(
          Sequelize.or(
            {status: "pending"},
            {status: "flagged"}
          ),
          {where: {submitterId: characterID}}
        ),
        order: [["status", "DESC"], "submitted"]
      })
    }

    return EveContracts.findAll({
      where: Sequelize.or(
        {status: "pending"},
        {status: "flagged"}
      ),
      order: [["status", "DESC"], "submitted"]
    })
  },

  getAllOngoing(characterID) {
    if (characterID) {
      return EveContracts.findAll({
        where: Sequelize.and(
          {status: "ongoing"},
          {submitterId: characterID}
        )
      })
    }

    return EveContracts.findAll({where: {status: "ongoing"}})
  },

  getAllFinalized(characterID) {
    if (characterID) {
      return EveContracts.findAll({
        where: Sequelize.and(
          {status: "completed"},
          {submitterId: characterID}
        )
      })
    }

    return EveContracts.findAll({where:  {status: "completed"}})
  },

  getAllUntaxed(characterID) {
    if (characterID) {
      return EveContracts.findAll({
        where: Sequelize.and(
          Sequelize.or(
            {status: "completed"},
            {status: "ongoing"}
          ),
          {taxed: 0},
          {submitterId: characterID}
        )
      })
    }

    return EveContracts.findAll({
      where: Sequelize.and(
        Sequelize.or(
          {status: "completed"},
          {status: "ongoing"}
        ),
        {taxed: 0},
      )
    })
  },

  set(data) {
    return EveContracts.upsert(EveContracts.build(data))
  }
}
