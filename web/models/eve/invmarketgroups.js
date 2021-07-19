//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const async = require("async")
const winston = require("winston")
const fs = require("fs")
const YAML = require("yaml")
const { Model, DataTypes } = require("sequelize")

class InvMarketGroups extends Model {}
class EveBannedMarketGroups extends Model {}

module.exports = {
  db: null,

  initTable(model, tableName) {
    winston.info(`Initializing ${tableName}`)

    model.init({
      marketGroupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true
      },
      marketGroupName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      marketDescription: {
        type: DataTypes.STRING(512),
        allowNull: true
      },
      iconId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    }, {
      sequelize: this.db,
      modelName: tableName
    })
  },

  async init(db) {
    this.db = db

    this.initTable(InvMarketGroups, "invmarketgroups")
    this.initTable(EveBannedMarketGroups, "eve_banned_market_groups")
  },

  async import(db) {
    // const file = fs.readFileSync("./sde/bsd/marketGroups.yaml", "utf8")
    // const names = YAML.parse(file)

    // const namesParsed = [] // TODO
    // for (let name of names) {
    //   namesParsed.push({
    //   })
    // }
  },

  allow(id) {
    EveBannedMarketGroups.destroy({where: {marketGroupId: id}})
  },

  ban(data) {
    EveBannedMarketGroups.build(data).save()
  },

  get(id) {
    return InvMarketGroups.findByPk(id)
  },

  getBanned() {
    return EveBannedMarketGroups.findAll()
  },

  getByName(name) {
    return InvMarketGroups.findAll({where: {marketGroupName: name}})
  },

  getAllParentsByID(parentGroupId) {
    const parents = [parentGroupId]

    return new Promise((resolve, reject) => {
      async.whilst(
        function() { return Boolean(parentGroupId) },
        async function() {
          const result = InvMarketGroups.findByPk(parentGroupId)
          parentGroupId = result[0].parentGroupID
          if (parentGroupId) parents.push(parentGroupId)
          return parents
        },
        function(e, result) {
          if (e) {
            winston.error(e)
            reject(e)
          }
          resolve(result)
        }
      )
    })
  },

  getHighestParentID(id) {
    return new Promise((resolve, reject) => {
      InvMarketGroups.findByPk(id).then((result) => {
        var parent = result[0].parentGroupID
        async.whilst(
          function() { return parent },
          async function(callback) {
            result = InvMarketGroups.findByPk(parent)
            if (result) parent = result[0].parentGroupID
            callback(null, result)
          },
          function(e, result) {
            if (e) {
              winston.error(e)
              reject(e)
            }
            resolve(result)
          }
        )
      })
    })
  },

  async isBanned(id) {
    return EveBannedMarketGroups.findByPk(id).then(g => g !== null)
  }
}
