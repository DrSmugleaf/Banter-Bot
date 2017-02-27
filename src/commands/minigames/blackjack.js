//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackGame = require("./blackjack/game")
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.BLACKJACK

module.exports = class BlackjackCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blackjack",
      aliases: [
        "blackjack", "juan", "juanaco", "spirit-roar", "spiritroar",
        "alexei-grinko", "alexeigrinko"
      ],
      group: "minigames",
      memberName: "blackjack",
      description: "Play a game of Blackjack.",
      examples: ["blackjack"],
      guildOnly: true
    })

    this.client.once("ready", () => {
      this.client.guilds.forEach((guild) => {
        const channel = guild.channels.find((channel) => channel.name === "bb-blackjack")
        if(channel) channel.delete()
      })
    })

    this.client.on("message", (msg) => this.onMessage(msg))

    this.games = new Object()
  }

  onMessage(msg) {
    if(!msg.guild) return
    const blackjack = this.games[msg.guild.id]
    if(!blackjack) return
    if(msg.channel.id !== blackjack.channel.id) return
    if(!blackjack.game.hasPlayer(msg.member.id)) return

    const pseudoCommand = msg.content.split(" ")[0]
    switch(pseudoCommand) {
    case "action":
    case "actions":
    case "accion":
    case "acciones":
      return msg.reply(responses.AVAILABLE_ACTIONS[msg.language](
        blackjack.game.getPlayer(msg.member.id).availableActions.join(", ")
      ))
    case "help":
    case "rules":
    case "rule":
    case "ayuda":
    case "reglas":
    case "regla":
      return msg.author.sendMessage(responses.HELP[msg.language])
    case "kick":
    case "echar":
      return this.voteKick(msg)
    }

    blackjack.game.getPlayer(msg.member.id).hands.find((hand) => {
      return !hand.action
    }).action = msg.content
  }

  async setupGame(msg) {
    var channel
    if(msg.guild.member(msg.client.user).hasPermission("MANAGE_CHANNELS")) {
      await msg.guild.createChannel("bb-blackjack", "text").then((ch) => {
        channel = ch
      })
    } else {
      channel = msg.channel
    }

    const language = msg.guild.language
    const game = new BlackjackGame({ dealerID: msg.client.user.id, deck: "french", decks: 1, player: msg.member.id })
      .on("deal", (hand, card) => {
        if(game.dealer.id === hand.player.id) return channel.sendMessage(
          responses.DEALER_DEAL[language](card.suit.symbol, card.name, hand.score)
        )
        const member = msg.guild.member(hand.player.id)
        channel.sendMessage(responses.DEAL[language](
          member, card.suit.symbol, card.name, hand.score, hand.availableActions
        ))
      })
      .on("end", () => {
        game.removeAllListeners()
        delete this.games[msg.guild.id]
        channel.delete()
      })
      .on("lose", (hand) => {
        const member = msg.guild.member(hand.player.id)
        channel.sendMessage(responses.LOSE[language](member))
      })
      .on("nextTurn", () => {

      })
      .on("start", (game) => {
        var response = responses.START.DEALER_HAND[language]
        game.dealer.hands[0].cards.forEach((card) => {
          response = response.concat(responses.START.CARD[language](card.suit.symbol, card.name))
        })
        response = response.concat(responses.START.DEALER_TOTAL[language](game.dealer.hands[0].score))

        game.players.forEach((player) => {
          const member = msg.guild.member(player.id)
          response = response.concat(responses.START.PLAYER_HAND[language](member.displayName))
          player.hands.forEach((hand) => {
            if(hand.status === "blackjack") return channel.sendMessage(responses.NATURAL_BLACKJACK[language](member))
            hand.cards.forEach((card) => {
              response = response.concat(responses.START.CARD[language](card.suit.symbol, card.name))
            })
            response = response.concat(responses.START.PLAYER_TOTAL[language](hand.score, hand.availableActions.join(", ")))
          })
        })
        channel.sendMessage(response)
      })
      .on("surrender", (hand) => {
        const member = msg.guild.member(hand.player.id)
        channel.sendMessage(responses.SURRENDER[language](member))
      })
      .on("tie", (hand) => {
        const member = msg.guild.member(hand.player.id)
        channel.sendMessage(responses.TIE[language](member))
      })
      .on("win", (hand) => {
        const member = msg.guild.member(hand.player.id)
        channel.sendMessage(responses.WIN[language](member))
      })

    this.games[msg.guild.id] = { game: game, channel: channel, kickVotes: {} }

    game.start()
    return msg.reply(responses.ADDED_PLAYER[language](channel.id))
  }

  voteKick(msg) {
    const blackjack = this.games[msg.guild.id]
    const member = msg.content.split(" ")[1]
    if(!member) return msg.reply(responses.KICK.NO_MEMBER_SPECIFIED[msg.language])

    const parsedMember = this.client.registry.types.get("member").parse(member, msg)
    if(!parsedMember) return msg.reply(responses.KICK.INVALID_MEMBER[msg.language])
    if(!blackjack.game.hasPlayer(parsedMember.id)) return msg.reply(responses.KICK.NOT_PLAYING[msg.language](parsedMember.displayName))

    if(!blackjack.kickVotes[parsedMember]) blackjack.kickVotes[parsedMember] = new Array()

    const kickVotes = blackjack.kickVotes[parsedMember]
    if(kickVotes.includes(msg.member.id)) {
      return msg.reply(responses.KICK.ALREADY_VOTED[msg.language](parsedMember.displayName))
    }
    kickVotes.push(msg.member.id)

    if(kickVotes.length > blackjack.game.playerCount / 2) {
      blackjack.kickVotes[parsedMember] = new Array()
      blackjack.game.removePlayer(parsedMember.id)
      return msg.reply(responses.KICK.SUCCESS[msg.language](parsedMember.displayName, blackjack.game.playerCount))
    } else {
      return msg.reply(responses.KICK.FAIL[msg.language](parsedMember.displayName, blackjack.game.playerCount))
    }
  }

  async run(msg) {
    var blackjack = this.games[msg.guild.id]
    if(!blackjack) return this.setupGame(msg)

    if(!blackjack.game.hasPlayer(msg.member.id)) {
      blackjack.game.addPlayer(msg.member.id)
      msg.reply(responses.ADDED_PLAYER[msg.language](blackjack.channel.id))
    } else {
      blackjack.game.removePlayer(msg.member.id)
      msg.reply(responses.REMOVED_PLAYER[msg.language])
    }
  }
}
