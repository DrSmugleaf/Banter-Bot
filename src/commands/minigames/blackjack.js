//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackGame = require("./blackjack/game")
const commando = require("discord.js-commando")
const oneLine = require("common-tags").oneLine
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

    this.client.on("channelDelete", (channel) => this.onChannelDelete(channel))

    this.games = new Object()
  }

  onChannelDelete(channel) {
    const game = this.games[channel.guild.id]
    if(!game) return
    if(game._channel && channel.id === game._channel.id) game._channel = null
    if(game.channel.id === channel.id && game._channel && game._channel.id !== game.channel.id) {
      game.channel = game._channel
      game._channel = null
      var response = ""
      game.players.forEach((player) => {
        response = response.concat(`${game.guild.member(player.id)}, `)
      })
      response = response.concat(
        responses.CHANNEL_REMOVED[channel.guild.language](channel.name, channel.guild.name)
      )
      return game.channel.sendMessage(response)
    } else if(game.channel.id === channel.id && !game._channel) {
      game.removeAllListeners()
      delete this.games[channel.guild.id]
      return game.players.forEach((player) => {
        game.guild.member(player.id).sendMessage(
          responses.CHANNEL_REMOVED_GAME_ENDED[channel.guild.language](channel.name, channel.guild.name)
        )
      })
    }
  }

  onMessage(msg) {
    if(!msg.guild) return
    const game = this.games[msg.guild.id]
    if(!game) return
    if(msg.channel.id !== game.channel.id) return
    if(!game.hasPlayer(msg.member.id)) return

    const pseudoCommand = msg.content.split(" ")[0]
    if(responses.ALIASES.ACTION[msg.language].includes(pseudoCommand)) {
      if(!game.isPlayerPlaying(msg.member.id)) return msg.reply(responses.NOT_PLAYING_YET[msg.language])
      return msg.reply(responses.AVAILABLE_ACTIONS[msg.language](
        game.getPlayer(msg.member.id).availableActions.join(", ")
      ))
    } else if(responses.ALIASES.HELP[msg.language].includes(pseudoCommand)) {
      return msg.author.sendMessage(responses.HELP[msg.language])
    } else if(responses.ALIASES.KICK[msg.language].includes(pseudoCommand)) {
      return this.voteKick(msg)
    } else {
      if(!game.isPlayerPlaying(msg.member.id)) return msg.reply(responses.NOT_PLAYING_YET[msg.language])
      game.getPlayer(msg.member.id).hands.find((hand) => !hand.action).action = msg.content
    }
  }

  parseCards(game, hand) {
    const language = game.guild.language
    var response = new String()
    hand.cards.forEach((card) => {
      response = response.concat(responses.CARD[language](card.suit.symbol, card.name))
    })
    return response
  }

  parseHand(game, hand, member, data = {}) {
    const language = game.guild.language
    const handResponse = data.dealer ? responses.DEALER_HAND[language] : responses.PLAYER_HAND[language](member.displayName)
    if(hand.status === "blackjack") return responses.NATURAL_BLACKJACK[language](member)
    return ""
      .concat(handResponse)
      .concat(this.parseCards(game, hand))
      .concat(responses.PLAYER_TOTAL[language](hand.score, data.dealer ? null : hand.availableActions.join(", ")))
  }

  parseHands(game) {
    var response = this.parseHand(game, game.dealer.hands[0], null, { dealer: true })
    game.players.forEach((player) => {
      const member = game.guild.member(player.id)
      player.hands.forEach((hand) => {
        response = response.concat(this.parseHand(game, hand, member))
      })
    })
    return response
  }

  async setupGame(msg) {
    var channel, _channel
    if(msg.guild.member(msg.client.user).hasPermission("MANAGE_CHANNELS")) {
      await msg.guild.createChannel("bb-blackjack", "text").then((ch) => {
        channel = ch
        _channel = msg.channel
      })
    } else {
      channel = msg.channel
    }

    const language = msg.guild.language
    const game = new BlackjackGame({ dealerID: msg.client.user.id, deck: "french", decks: 1, player: msg.member.id })
      .on("end", () => {
        game.removeAllListeners()
        delete this.games[msg.guild.id]
        if(game.guild.channels.has(channel.id)) channel.delete()
      })
      .on("endRound", (hand) => {
        game.channel.sendMessage(oneLine`${this.parseHand(hand.game, hand, null, { dealer: true })}`)
      })
      .on("lose", (hand) => {
        const member = msg.guild.member(hand.player.id)
        var lose = responses.LOSE[language](member)
        var cards = this.parseHand(hand.game, hand, member)
        game.channel.sendMessage(oneLine`${lose} ${cards}`)
      })
      .on("nextTurn", () => {
        const response = this.parseHands(this.games[msg.guild.id])
        game.channel.sendMessage(response)
      })
      .on("start", (game) => {
        const response = this.parseHands(this.games[msg.guild.id])
        if(game.players.every((player) => player.hands[0].status === "blackjack")) return
        game.channel.sendMessage(response)
      })
      .on("surrender", (hand) => {
        const member = msg.guild.member(hand.player.id)
        var surrender = responses.SURRENDER[language](member)
        var cards = this.parseHand(hand.game, hand, member)
        game.channel.sendMessage(oneLine`${surrender} ${cards}`)
      })
      .on("tie", (hand) => {
        const member = msg.guild.member(hand.player.id)
        var tie = responses.TIE[language](member)
        var cards = this.parseHand(hand.game, hand, member)
        game.channel.sendMessage(oneLine`${tie} ${cards}`)
      })
      .on("win", (hand) => {
        const member = msg.guild.member(hand.player.id)
        var win = responses.WIN[language](member)
        var cards = this.parseHand(hand.game, hand, member)
        game.channel.sendMessage(oneLine`${win} ${cards}`)
      })

    game._channel = _channel
    game.channel = channel
    game.guild = msg.guild
    game.kickVotes = {}
    this.games[msg.guild.id] = game

    game.start()
    return msg.reply(responses.ADDED_PLAYER[language](channel.id))
  }

  voteKick(msg) {
    const game = this.games[msg.guild.id]
    const member = msg.content.split(" ")[1]
    if(!member) return msg.reply(responses.KICK.NO_MEMBER_SPECIFIED[msg.language])

    const parsedMember = this.client.registry.types.get("member").parse(member, msg)
    if(!parsedMember) return msg.reply(responses.KICK.INVALID_MEMBER[msg.language])
    if(this.client.user.id === parsedMember.id) return msg.reply(responses.CANT_KICK_DEALER[msg.language])
    if(!game.hasPlayer(parsedMember.id)) return msg.reply(responses.KICK.NOT_PLAYING[msg.language](parsedMember.displayName))

    if(!game.kickVotes[parsedMember]) game.kickVotes[parsedMember] = new Array()

    const kickVotes = game.kickVotes[parsedMember]
    if(kickVotes.includes(msg.member.id)) {
      return msg.reply(responses.KICK.ALREADY_VOTED[msg.language](parsedMember.displayName))
    }
    kickVotes.push(msg.member.id)

    if(kickVotes.length > game.playerCount / 2) {
      kickVotes[parsedMember] = new Array()
      game.removePlayer(parsedMember.id)
      return msg.reply(responses.KICK.SUCCESS[msg.language](parsedMember.displayName, game.playerCount))
    } else {
      return msg.reply(responses.KICK.FAIL[msg.language](parsedMember.displayName, game.playerCount))
    }
  }

  async run(msg) {
    var game = this.games[msg.guild.id]
    if(!game) return this.setupGame(msg)

    if(!game.hasPlayer(msg.member.id)) {
      game.addPlayer(msg.member.id)
      return msg.reply(responses.ADDED_PLAYER[msg.language](game.channel.id))
    } else {
      game.removePlayer(msg.member.id)
      return msg.reply(responses.REMOVED_PLAYER[msg.language])
    }
  }
}
