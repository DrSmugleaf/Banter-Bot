"use strict"

class Magic8Ball {
  constructor() {
    this.answers = [];
    this.answers.spanish = ["En mi opinión, sí", "Es cierto", "Es decididamente así", "Probablemente", "Buen pronóstico", "Todo apunta a que sí", "Sin duda", "Sí", "Sí - definitivamente", "Debes confiar en ello", "Respuesta vaga, vuelve a intentarlo", "Pregunta en otro momento", "Será mejor que no te lo diga ahora", "No puedo predecirlo ahora", "Concéntrate y vuelve a preguntar", "No cuentes con ello", "Mi respuesta es no", "Mis fuentes me dicen que no", "Las perspectivas no son buenas", "Muy dudoso"];
    this.answers.english = ["It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
  };
};

Magic8Ball.prototype.answer = function(discord, msg, language) {
  discord.sendMessage(msg, this.answers[language][Math.floor(Math.random() * this.answers[language].length)]);
};

module.exports = Magic8Ball;
