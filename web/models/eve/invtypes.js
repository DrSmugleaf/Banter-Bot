//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const { Model, DataTypes } = require("sequelize")
const fs = require("fs")
const YAML = require("yaml")
const winston = require("winston")

class InvTypes extends Model {}
class EveBannedTypes extends Model {}

module.exports = {
  db: null,

  initTable(model, tableName) {
    winston.info(`Initializing ${tableName}`)

    model.init({
      itemId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true
      },
      itemName: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      sequelize: this.db,
      modelName: tableName
    })
  },

  async init(db) {
    this.db = db

    this.initTable(InvTypes, "invtypes")
    this.initTable(EveBannedTypes, "eve_banned_types")
  },

  async import() {
    const file = fs.readFileSync("./sde/bsd/invNames.yaml", "utf8")
    const names = YAML.parse(file)

    await InvTypes.bulkCreate(names)
  },

  allow(id) {
    EveBannedTypes.destroy({where: {itemId: id}})
  },

  ban(data) {
    EveBannedTypes.build(data).save()
  },

  get(id) {
    return InvTypes.findByPk(id)
  },

  getBanned() {
    return EveBannedTypes.findAll()
  },

  getByName(name) {
    return InvTypes.findOne({where: {itemName: name}})
  },

  async isIDBanned(id) {
    return EveBannedTypes.findByPk(id).then(t => t !== null)
  },

  async isNameBanned(name) {
    return EveBannedTypes.findOne({where: {itemName: name}}).then(t => t !== null)
  }
}
