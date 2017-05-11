//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

class PokemonMove {
  constructor(game, data) {
    Object.defineProperty(this, "game", { value: game })

    if(data) this.setup(data)
  }

  setup(data) {
    this.name = data.name
    this.type = data.type
    this.category = data.category
    this.powerPoints = data.powerPoints
    this.basePower = data.basePower
    this.accuracy = data.accuracy

    this.battleEffect = data.battleEffect
    this.secondaryEffect = data.secondaryEffect
    this.effectRate = data.effectRate
    this.zToxic = data.zToxic
    this.detailedEffect = data.detailedEffect

    this.criticalHitRate = data.criticalHitRate
    this.speedPriority = data.speedPriority
    this.pokemonHit = data.pokemonHit

    this.physicalContact = data.physicalContact
    this.soundType = data.soundType
    this.punchMove = data.punchMove
    this.snatchable = data.snatchable
    this.zMove = data.zMove
    this.defrosts = data.defrosts
    this.hitsOppositeSideInTriples = data.hitsOppositeSideInTriples
    this.reflectable = data.reflectable
    this.blockable = data.blockable
    this.copyable = data.copyable
  }

  getDamage(move, attacker, defender) {
    if(move.category === "non-damaging") return 0
    const attackStat = move.category === "physical" ? attacker.attack : attacker.spAttack
    const defenseStat = move.category === "physical" ? defender.defense : defender.spDefense
    const stab = attacker.types.includes(move.type) ? 1.5 : 1
    return ((((2 * attacker.level / 5 + 2) * attackStat * move.basePower / defenseStat) / 50) + 2)
      * stab * "PLACEHOLDER" * Math.floor(Math.random() * (100 - 85 + 1) + 85) / 100
  }
}

module.exports = PokemonMove
