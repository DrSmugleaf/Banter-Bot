//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class Pokemon {
  constructor(game, data) {
    Object.defineProperty(this, "game", { value: game })

    if(data) this.setup(data)
  }

  setup(data) {
    this.number = data.number
    this.name = data.name
    this.species = data.species
    this.types = data.types
    this.abilities = data.abilities
    this.nature = data.nature

    this.stats = {
      base: {
        hp: data.baseStats[0],
        attack: data.baseStats[1],
        defense: data.baseStats[2],
        spAttack: data.baseStats[3],
        spDefense: data.baseStats[4],
        speed: data.baseStats[5]
      },

      actual: {},

      iv: {}
    }
  }
}

module.exports = Pokemon
