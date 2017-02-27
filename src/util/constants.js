//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const { oneLine, stripIndents } = require("common-tags")

exports.versions = {
  "2": {
    english: stripIndents`
      **ADDED**
      Version notes.
      !announce: Announces a message to a guild, guilds or all guilds, owner only.
      !clean-messages: Deletes a channel's messages forever, admin only.
      !playing: Changes the bot's playing status, owner only.
      !queue: Shows how many songs are in the queue.
      !skip: Replaces !stop and !pause commands for regular users, vote based.
      !server-language: Sets the server language.
      !server-settings: Clears, gets, removes or sets a setting in this server, owner only.
      !version: Shows the changes of a specific version.

      **CHANGES**
      !color now supports a lot more types of color formats.
      !info now shows the support server invite link.
      !stop and !pause commands can now only be used by members with the permission to mute others.
      !play now deletes the command message if it is able to, to reduce clutter.
      When playing a song, it now only shows the name instead of the link.
      Every command now has a maximum usage rate of 2 uses every 3 seconds.
      !play and !repeat usage rate is 2 uses every 5 seconds

      **FIXES**
      Fixed crash when !color's color parameter doesn't exist.
      Fixed crash when using !help in a direct message with the bot.
      Fixed crash when trying to !play a link that isn't a youtube video.
    `,
    spanish: stripIndents`
      **AÑADIDO**
      Notas de versión.
      !announce: Anuncia un mensaje a un servidor, servidores o todos los servidores, solo dueño.
      !clean-messages: Borra los mensajes de un canal para siempre, solo admins.
      !playing: Cambia el estado de Jugando del bot, solo dueño.
      !queue: Enseña cuantas canciones hay en cola.
      !skip: Reemplaza !stop y !pause para usuarios normales, basado en votos.
      !server-language: Cambia el idioma del servidor.
      !server-settings: Limpia, adquiere, quita o aplica una opción en este servidor, solo dueño.
      !version: Enseña los cambios de una versión especifica.

      **CAMBIOS**
      !color ahora es compatible con más variantes de formatos de colores.
      !info ahora enseña el link de invitación al servidor de soporte.
      !stop y !pause solo pueden ser usados por usuarios con el permiso para silenciar a otros.
      !play ahora borra el mensaje del comando si puede, para reducir desorden.
      Cuando reproduce una cancion, ahora solo enseña el nombre en vez del link.
      Todos los comandos ahora tienen un máximo de usos de 2 veces cada 3 segundos.
      !play y !repeat tienen un máximo de usos de 2 veces cada 5 segundos.

      **ARREGLOS**
      Arreglado un crash cuando el parametro de !color color no existía.
      Arreglado un crash cuando se usaba !help en un mensaje directo al bot.
      Arreglado un crash cuando se intentaba reproducir un video ajeno a youtube con !play.
    `
  },
  "3": {
    english: stripIndents`
      **ADDED**
      !info-channel: Sets the info channel for the bot.
      !language: Sets your language in this server for the bot to respond with.
      !server-language: Sets the server's language for the bot to respond with.
      !song-text-channel: Sets the server's song text channel for the bot to send song status messages to.
      !song-voice-channel: Sets the server's song voice channel for the bot to always play songs in.
      !stop-all: Stops and removes all videos in the server's queue, users with mute members permission or above only.
      The bot will now answer in the language you set for yourself (!language language) or the server's language (!server-language language).

      **REMOVED**
      Removed automatic voice channels when 2 or more people are playing the same game. Will be added back in a future update.
      Removed !search command as it is now obsolete because of Discord's search feature.

      **CHANGES**
      !play now only allows every user to queue 2 songs each.
      !stop now also allows the member that put the song in the queue.

      **FIXES**
      Fixed !skip command always staying at one vote maximum.
      Fixed !play command audio cutting out at random times.
    `,
    spanish: stripIndents`
      **AÑADIDO**
      !info-channel: Establece el canal de información del bot.
      !language: Establece tu lenguaje en este servidor con el que el bot te responderá.
      !server-language: Estable el lenguaje del servidor con el que el bot responderá.
      !song-text-channel: Establece el canal de texto para canciones del servidor en el que el bot pondrá mensajes de estado sobre canciones.
      !song-voice-channel: Establece el canal de voz para canciones del servidor en el que el bot exclusivamente reproducirá canciones.
      !stop-all: Para y quita todas las canciones en cola, usuarios con permiso para silenciar a otros o más solo.
      El bot ahora te responderá en el idioma de tu elección (!language language) o el idioma del servidor (!server-language language).

      **QUITADO**
      Quitado canales automáticos de voz cuando dos o más personas están jugando al mismo juego. Se añadirá de nuevo en una proxima actualización.
      Quitado comando !search porque ya está obsoleto con el modo de búsqueda implementado por Discord.

      **CAMBIOS**
      !play ahora solo permite 2 canciones por usuario en cola.
      !stop ahora también permite usarlo al usuario que puso la canción en cola.

      **ARREGLOS**
      Arreglado !skip manteniéndose en un voto como máximo.
      Arreglado el audio de !play cortándose al azar.
    `
  },
  "4": {
    english: stripIndents`
      **FIXES**
      Fixed server language not applying to members who had no language set.
      Fixed error when using !help while a song isn't playing.
    `,
    spanish: stripIndents`
      **ARREGLOS**
      Arreglado el lenguaje del servidor no aplicándose a miembros que no tenian un lenguaje propio aplicado.
      Arreglado un error al usar !help cuando una canción no esta reproduciéndose.
    `
  },
  "5": {
    english: stripIndents`
      **ADDED**
      !roll: Rolls a number from 1 to 100.
      !custom-text-command: Creates a basic custom command where the bot will answer with the text you told it to.
      !custom-voice-command: Creates a basic custom command where the bot will join your channel and play the song you told it to.
      !custom-command-manager: Removes a custom command, admin only.
      Custom commands are created by using !custom-text-command <new-command-name> <text-to-reply-with> and !custom-voice-command <new-command-name> <youtube-url>.
      !blacklist: Blocks a member in the server from using any bot commands, admin only.
      Added !econnreset as an alias for !play.

      **FIXES**
      Fixed unnecessary arguments in !server-settings command.
      Fixed error in !color command when the bot doesn't have permission to edit roles.
      Fixed spaces and special characters in !color's color argument not working.
      Fixed youtube !play commands never working because of youtube's protocol change.
      Fixed skipping 2 videos on error, reduced video stutter.
    `,
    spanish: stripIndents`
      **AÑADIDO**
      !roll: Saca un número del 1 al 100.
      !custom-text-command: Crea un básico comando personalizado de texto en el que el bot te responderá con el texto que le has dicho.
      !custom-voice-command: Crea un básico comando personalizado de voz en el que el bot se unirá a tu canal de voz y reproducirá la canción que le has dicho.
      !custom-command-manager: Borra un comando personalizado, sólo admins.
      Los comandos personalizados son creados usando !custom-text-command <nombre-de-comando-nuevo> <texto-con-el-que-responder> y !custom-voice-command <nombre-de-comando-nuevo> <link-youtube>.
      !blacklist: Bloquea a un miembro del servidor de usar cualquier comando del bot, sólo admins.
      Añadido !econnreset como un alias de !play.

      **ARREGLOS**
      Arreglado parámetros innecesarios en el comando !server-settings.
      Arreglado error en el comando !color cuando el bot no tiene permiso para editar roles.
      Arreglado espacios y carácteres especiales en el parámetro de color del comando !color.
      Arreglado comando !play nunca funcionando por un cambio de protocolo en youtube.
      Arreglado saltarse 2 vídeos cuando ocurría un error, reducido tartamudeo de audio.
    `
  },
  "6": {
    english: stripIndents`
      **CHANGES**
      Made some custom command responses clearer.

      **FIXES**
      Fixed various errors with database related commands.
      Fixed error when using !quote when there are no quotes in the list.
      Fixed !whois only accepting user IDs. It now also accepts user names and user mentions.
      Fixed custom commands being deleted every time the bot restarted.
      Fixed youtube !skip votes not resetting when a song ends.
    `,
    spanish: stripIndents`
      **CAMBIOS**
      Algunas respuestas relacionadas con los comandos personalizados son ahora más claras.

      **ARREGLOS**
      Arreglados varios errores relacionados con los comandos que accedían a la base de datos.
      Arreglado un error al usar !quote cuando no hay quotes en la lista.
      Arreglado que !whois sólo aceptara IDs de usuarios. Ahora también acepta nombres y menciones de usuarios.
      Arreglado que los comandos personalizados se borraran al reiniciarse el bot.
      Arreglado que los votos de youtube !skip no se reinicializaran al terminar una canción.
    `
  },
  "7": {
    english: stripIndents`
      **ADDED**
      The bot now removes unused color roles it created.
      !language can now be used outside of servers, and will set your user language.
      Automatic channels. :clap:
      !auto-channel: Used with parameters disable, enable, update or threshold.
      Blackjack.
      !blackjack:
      !blackjack-admin:

      **CHANGED**
      Changed how quotes are organized. They are now separated by server.

      **REMOVED**
      !markov command.

      **FIXED**
      Fixed an error that sometimes happened when using !help.
      Fixed an error when trying to remove a custom command that exists in another server.
      Fixed !color duplicating the colored role of an user when editing it.
      Fixed !color responses being unclear, added new responses.
      Fixed custom command creation sometimes not displaying the correct command prefix to use.
      Fixed an error when the bot tries to respond in a language it doesn't have a response for, it will now default to english.
      Fixed !skip counting bots aside than itself for the total vote count.
      Fixed !play accepting youtube livestreams that would instantly end, it no longer accepts livestreams.
      Fixed the bot sometimes incorrectly detecting whether or not it can or can't join or speak in a voice channel, improved responses when it can't.
      Fixed quotes disorganizing themselves every so often.
      Fixed quotes having the wrong id or skipping ids when adding them after deleting another.
      Fixed some errors when a quote doesn't exist and improved all responses related to quotes.
      Fixed the bot not telling the difference between there being no quotes and a specific quote not existing.
      Fixed everyone being able to delete any quotes. Only administrators and the submitter of the quote are now able to remove a quote, and only if it is from that server.
      Fixed quote modes that weren't written fully in lowercase not working.
      Fixed errors where some commands (!quote, !bridge y !custom-command-admin) would be used before they were fully loaded, resulting in crashes or weird behavior.
      Fixed bridge translations displaying the member's username instead of the member's nickname.
      Fixed !bridge only responding in english and fixed that the response was terrible.
      Fixed bridge message sending not working when using long language names in the command (english instead of en).
    `,
    spanish: stripIndents`
      **AÑADIDO**
      El bot ahora elimina roles de color no usados que él mismo ha creado.
      !language ahora puede ser usado fuera de servidores, y establecerá tu idioma de usuario.
      Canales automáticos. :clap:
      !auto-channel: Se usa con los paramétros disable, enable, update o threshold.
      Blackjack.
      !blackjack:
      !blackjack-admin:

      **CAMBIADO**
      Cambiado como los quotes están organizados. Ahora están separados por servidor.

      **QUITADO**
      Comando !markov.

      **ARREGLADO**
      Arreglado un error que ocurría a veces al usar !help.
      Arreglado un error al intentar quitar un comando personalizado que existía en otro servidor.
      Arreglado que !color duplicara el role de color de un usuario al editarlo.
      Arreglado que las respuestas de !color no fueran claras, añadidas nuevas respuestas.
      Arreglado que la creación de comandos personalizados no te dijera a veces el prefijo correcto que usar.
      Arreglado un error cuando el bot intentaba responder en un lenguaje para el que no tiene una respuesta, ahora por defecto responderá en inglés.
      Arreglado que !skip contara otros bots aparte de si mismo al recontar los votos totales.
      Arreglado que !play aceptara transmisiones en vivo que se terminaban inmediatamente, ahora no acepta transmisiones en vivo.
      Arreglado que el bot a veces detectara incorrectamente si puede o no unirse o hablar en un canal de voz, mejoradas las respuestas cuando no puede hacerlo.
      Arreglado que los quotes se desorganizaran de vez en cuando.
      Arreglado que los quotes tuvieran un ID erróneo al añadirlos después de borrar otro.
      Arreglados algunos errores cuando un quote no existe y mejoradas todas las respuestas relacionadas con los quotes.
      Arreglado que el bot no supiera la diferencia entre que no hubieran quotes y que no existiera un quote específico.
      Arreglado que todos pudieran borrar quotes. Ahora sólo administradores y el remitente del quote podrán borrar un quote, y sólo si es de ese servidor.
      Arreglado que los modos de quote fueran inválidos si no estaban escritos en minúscula.
      Arreglados errores en los que algunos comandos (!quote, !bridge y !custom-command-admin) eran usados antes de que estuvieran listos, resultando en comportamientos extraños.
      Arreglado que las traducciones de bridge mostraran el nombre de usuario del miembro en vez de el mote.
      Arreglado que !bridge solo respondiera en inglés y que la respuesta fuera terrible.
      Arreglado que el envío de mensajes de bridge no funcionara al usar nombres de idioma largos (english en vez de en).
    `
  }
}

exports.defaultoptions = {
  invite: "https://discord.gg/yyDWNBr",
  name: "Banter Bot"
}

exports.colors = {
  airforceblue: "#5D8AA8",
  aliceblue: "#F0F8FF",
  alizarincrimson: "#E32636",
  almond: "#EFDECD",
  amaranth: "#E52B50",
  amber: "#FFBF00",
  americanrose: "#FF033E",
  amethyst: "#9966CC",
  androidgreen: "#A4C639",
  antiflashwhite: "#F2F3F4",
  antiquebrass: "#CD9575",
  antiquefuchsia: "#915C83",
  antiquewhite: "#FAEBD7",
  ao: "#008000",
  applegreen: "#8DB600",
  apricot: "#FBCEB1",
  aqua: "#00FFFF",
  aquamarine: "#7FFFD4",
  armygreen: "#4B5320",
  arylideyellow: "#E9D66B",
  ashgrey: "#B2BEB5",
  asparagus: "#87A96B",
  atomictangerine: "#FF9966",
  auburn: "#A52A2A",
  aureolin: "#FDEE00",
  aurometalsaurus: "#6E7F80",
  awesome: "#FF2052",
  azure: "#007FFF",
  azuremistweb: "#F0FFFF",
  babyblue: "#89CFF0",
  babyblueeyes: "#A1CAF1",
  babypink: "#F4C2C2",
  ballblue: "#21ABCD",
  bananamania: "#FAE7B5",
  bananayellow: "#FFE135",
  battleshipgrey: "#848482",
  bazaar: "#98777B",
  beaublue: "#BCD4E6",
  beaver: "#9F8170",
  beige: "#F5F5DC",
  bisque: "#FFE4C4",
  bistre: "#3D2B1F",
  bittersweet: "#FE6F5E",
  black: "#000000",
  blanchedalmond: "#FFEBCD",
  bleudefrance: "#318CE7",
  blizzardblue: "#ACE5EE",
  blond: "#FAF0BE",
  blue: "#0000FF",
  bluebell: "#A2A2D0",
  bluegray: "#6699CC",
  bluegreen: "#0D98BA",
  bluepurple: "#8A2BE2",
  blueviolet: "#8A2BE2",
  blush: "#DE5D83",
  bole: "#79443B",
  bondiblue: "#0095B6",
  bone: "#E3DAC9",
  bostonuniversityred: "#CC0000",
  bottlegreen: "#006A4E",
  boysenberry: "#873260",
  brandeisblue: "#0070FF",
  brass: "#B5A642",
  brickred: "#CB4154",
  brightcerulean: "#1DACD6",
  brightgreen: "#66FF00",
  brightlavender: "#BF94E4",
  brightmaroon: "#C32148",
  brightpink: "#FF007F",
  brightturquoise: "#08E8DE",
  brightube: "#D19FE8",
  brilliantlavender: "#F4BBFF",
  brilliantrose: "#FF55A3",
  brinkpink: "#FB607F",
  britishracinggreen: "#004225",
  bronze: "#CD7F32",
  brown: "#A52A2A",
  bubblegum: "#FFC1CC",
  bubbles: "#E7FEFF",
  buff: "#F0DC82",
  bulgarianrose: "#480607",
  burgundy: "#800020",
  burlywood: "#DEB887",
  burntorange: "#CC5500",
  burntsienna: "#E97451",
  burntumber: "#8A3324",
  byzantine: "#BD33A4",
  byzantium: "#702963",
  cgblue: "#007AA5",
  cgred: "#E03C31",
  cadet: "#536872",
  cadetblue: "#5F9EA0",
  cadetgrey: "#91A3B0",
  cadmiumgreen: "#006B3C",
  cadmiumorange: "#ED872D",
  cadmiumred: "#E30022",
  cadmiumyellow: "#FFF600",
  caféaulait: "#A67B5B",
  cafénoir: "#4B3621",
  calpolypomonagreen: "#1E4D2B",
  cambridgeblue: "#A3C1AD",
  camel: "#C19A6B",
  camouflagegreen: "#78866B",
  canary: "#FFFF99",
  canaryyellow: "#FFEF00",
  candyapplered: "#FF0800",
  candypink: "#E4717A",
  capri: "#00BFFF",
  caputmortuum: "#592720",
  cardinal: "#C41E3A",
  caribbeangreen: "#00CC99",
  carmine: "#FF0040",
  carminepink: "#EB4C42",
  carminered: "#FF0038",
  carnationpink: "#FFA6C9",
  carnelian: "#B31B1B",
  carolinablue: "#99BADD",
  carrotorange: "#ED9121",
  celadon: "#ACE1AF",
  celeste: "#B2FFFF",
  celestialblue: "#4997D0",
  cerise: "#DE3163",
  cerisepink: "#EC3B83",
  cerulean: "#007BA7",
  ceruleanblue: "#2A52BE",
  chamoisee: "#A0785A",
  champagne: "#FAD6A5",
  charcoal: "#36454F",
  chartreuse: "#7FFF00",
  cherry: "#DE3163",
  cherryblossompink: "#FFB7C5",
  chestnut: "#CD5C5C",
  chocolate: "#D2691E",
  chromeyellow: "#FFA700",
  cinereous: "#98817B",
  cinnabar: "#E34234",
  cinnamon: "#D2691E",
  citrine: "#E4D00A",
  classicrose: "#FBCCE7",
  cobalt: "#0047AB",
  cocoabrown: "#D2691E",
  coffee: "#6F4E37",
  columbiablue: "#9BDDFF",
  coolblack: "#002E63",
  coolgrey: "#8C92AC",
  copper: "#B87333",
  copperrose: "#996666",
  coquelicot: "#FF3800",
  coral: "#FF7F50",
  coralpink: "#F88379",
  coralred: "#FF4040",
  cordovan: "#893F45",
  corn: "#FBEC5D",
  cornellred: "#B31B1B",
  cornflower: "#9ACEEB",
  cornflowerblue: "#6495ED",
  cornsilk: "#FFF8DC",
  cosmiclatte: "#FFF8E7",
  cottoncandy: "#FFBCD9",
  cream: "#FFFDD0",
  crimson: "#DC143C",
  crimsonred: "#990000",
  crimsonglory: "#BE0032",
  cyan: "#00FFFF",
  daffodil: "#FFFF31",
  dandelion: "#F0E130",
  darkblue: "#00008B",
  darkbrown: "#654321",
  darkbyzantium: "#5D3954",
  darkcandyapplered: "#A40000",
  darkcerulean: "#08457E",
  darkchestnut: "#986960",
  darkcoral: "#CD5B45",
  darkcyan: "#008B8B",
  darkelectricblue: "#536878",
  darkgoldenrod: "#B8860B",
  darkgray: "#A9A9A9",
  darkgreen: "#013220",
  darkjunglegreen: "#1A2421",
  darkkhaki: "#BDB76B",
  darklava: "#483C32",
  darklavender: "#734F96",
  darkmagenta: "#8B008B",
  darkmidnightblue: "#003366",
  darkolivegreen: "#556B2F",
  darkorange: "#FF8C00",
  darkorchid: "#9932CC",
  darkpastelblue: "#779ECB",
  darkpastelgreen: "#03C03C",
  darkpastelpurple: "#966FD6",
  darkpastelred: "#C23B22",
  darkpink: "#E75480",
  darkpowderblue: "#003399",
  darkraspberry: "#872657",
  darkred: "#8B0000",
  darksalmon: "#E9967A",
  darkscarlet: "#560319",
  darkseagreen: "#8FBC8F",
  darksienna: "#3C1414",
  darkslateblue: "#483D8B",
  darkslategray: "#2F4F4F",
  darkspringgreen: "#177245",
  darktan: "#918151",
  darktangerine: "#FFA812",
  darktaupe: "#483C32",
  darkterracotta: "#CC4E5C",
  darkturquoise: "#00CED1",
  darkviolet: "#9400D3",
  dartmouthgreen: "#00693E",
  davygrey: "#555555",
  debianred: "#D70A53",
  deepcarmine: "#A9203E",
  deepcarminepink: "#EF3038",
  deepcarrotorange: "#E9692C",
  deepcerise: "#DA3287",
  deepchampagne: "#FAD6A5",
  deepchestnut: "#B94E48",
  deepcoffee: "#704241",
  deepfuchsia: "#C154C1",
  deepjunglegreen: "#004B49",
  deeplilac: "#9955BB",
  deepmagenta: "#CC00CC",
  deeppeach: "#FFCBA4",
  deeppink: "#FF1493",
  deepsaffron: "#FF9933",
  deepskyblue: "#00BFFF",
  denim: "#1560BD",
  desert: "#C19A6B",
  desertsand: "#EDC9AF",
  dimgray: "#696969",
  dodgerblue: "#1E90FF",
  dogwoodrose: "#D71868",
  dollarbill: "#85BB65",
  drab: "#967117",
  dukeblue: "#00009C",
  earthyellow: "#E1A95F",
  ecru: "#C2B280",
  eggplant: "#614051",
  eggshell: "#F0EAD6",
  egyptianblue: "#1034A6",
  electricblue: "#7DF9FF",
  electriccrimson: "#FF003F",
  electriccyan: "#00FFFF",
  electricgreen: "#00FF00",
  electricindigo: "#6F00FF",
  electriclavender: "#F4BBFF",
  electriclime: "#CCFF00",
  electricpurple: "#BF00FF",
  electricultramarine: "#3F00FF",
  electricviolet: "#8F00FF",
  electricyellow: "#FFFF00",
  emerald: "#50C878",
  etonblue: "#96C8A2",
  fallow: "#C19A6B",
  falured: "#801818",
  famous: "#FF00FF",
  fandango: "#B53389",
  fashionfuchsia: "#F400A1",
  fawn: "#E5AA70",
  feldgrau: "#4D5D53",
  fern: "#71BC78",
  ferngreen: "#4F7942",
  ferrarired: "#FF2800",
  fielddrab: "#6C541E",
  fireenginered: "#CE2029",
  firebrick: "#B22222",
  flame: "#E25822",
  flamingopink: "#FC8EAC",
  flavescent: "#F7E98E",
  flax: "#EEDC82",
  floralwhite: "#FFFAF0",
  fluorescentorange: "#FFBF00",
  fluorescentpink: "#FF1493",
  fluorescentyellow: "#CCFF00",
  folly: "#FF004F",
  forestgreen: "#228B22",
  frenchbeige: "#A67B5B",
  frenchblue: "#0072BB",
  frenchlilac: "#86608E",
  frenchrose: "#F64A8A",
  fuchsia: "#FF00FF",
  fuchsiapink: "#FF77FF",
  fulvous: "#E48400",
  fuzzywuzzy: "#CC6666",
  gainsboro: "#DCDCDC",
  gamboge: "#E49B0F",
  ghostwhite: "#F8F8FF",
  ginger: "#B06500",
  glaucous: "#6082B6",
  glitter: "#E6E8FA",
  gold: "#FFD700",
  goldenbrown: "#996515",
  goldenpoppy: "#FCC200",
  goldenyellow: "#FFDF00",
  goldenrod: "#DAA520",
  grannysmithapple: "#A8E4A0",
  gray: "#808080",
  grayasparagus: "#465945",
  green: "#00FF00",
  greenblue: "#1164B4",
  greenyellow: "#ADFF2F",
  grullo: "#A99A86",
  guppiegreen: "#00FF7F",
  halayàúbe: "#663854",
  hanblue: "#446CCF",
  hanpurple: "#5218FA",
  hansayellow: "#E9D66B",
  harlequin: "#3FFF00",
  harvardcrimson: "#C90016",
  harvestgold: "#DA9100",
  heartgold: "#808000",
  heliotrope: "#DF73FF",
  hollywoodcerise: "#F400A1",
  honeydew: "#F0FFF0",
  hookergreen: "#49796B",
  hotmagenta: "#FF1DCE",
  hotpink: "#FF69B4",
  huntergreen: "#355E3B",
  icterine: "#FCF75E",
  inchworm: "#B2EC5D",
  indiagreen: "#138808",
  indianred: "#CD5C5C",
  indianyellow: "#E3A857",
  indigo: "#4B0082",
  internationalkleinblue: "#002FA7",
  internationalorange: "#FF4F00",
  iris: "#5A4FCF",
  isabelline: "#F4F0EC",
  islamicgreen: "#009000",
  ivory: "#FFFFF0",
  jade: "#00A86B",
  jasmine: "#F8DE7E",
  jasper: "#D73B3E",
  jazzberryjam: "#A50B5E",
  jonquil: "#FADA5E",
  junebud: "#BDDA57",
  junglegreen: "#29AB87",
  kucrimson: "#E8000D",
  kellygreen: "#4CBB17",
  khaki: "#C3B091",
  lasallegreen: "#087830",
  languidlavender: "#D6CADD",
  lapislazuli: "#26619C",
  laserlemon: "#FEFE22",
  laurelgreen: "#A9BA9D",
  lava: "#CF1020",
  lavender: "#E6E6FA",
  lavenderblue: "#CCCCFF",
  lavenderblush: "#FFF0F5",
  lavendergray: "#C4C3D0",
  lavenderindigo: "#9457EB",
  lavendermagenta: "#EE82EE",
  lavendermist: "#E6E6FA",
  lavenderpink: "#FBAED2",
  lavenderpurple: "#967BB6",
  lavenderrose: "#FBA0E3",
  lawngreen: "#7CFC00",
  lemon: "#FFF700",
  lemonyellow: "#FFF44F",
  lemonchiffon: "#FFFACD",
  lemonlime: "#BFFF00",
  lightcrimson: "#F56991",
  lightthulianpink: "#E68FAC",
  lightapricot: "#FDD5B1",
  lightblue: "#ADD8E6",
  lightbrown: "#B5651D",
  lightcarminepink: "#E66771",
  lightcoral: "#F08080",
  lightcornflowerblue: "#93CCEA",
  lightcyan: "#E0FFFF",
  lightfuchsiapink: "#F984EF",
  lightgoldenrodyellow: "#FAFAD2",
  lightgray: "#D3D3D3",
  lightgreen: "#90EE90",
  lightkhaki: "#F0E68C",
  lightpastelpurple: "#B19CD9",
  lightpink: "#FFB6C1",
  lightsalmon: "#FFA07A",
  lightsalmonpink: "#FF9999",
  lightseagreen: "#20B2AA",
  lightskyblue: "#87CEFA",
  lightslategray: "#778899",
  lighttaupe: "#B38B6D",
  lightyellow: "#FFFFED",
  lilac: "#C8A2C8",
  lime: "#BFFF00",
  limegreen: "#32CD32",
  lincolngreen: "#195905",
  linen: "#FAF0E6",
  lion: "#C19A6B",
  liver: "#534B4F",
  lust: "#E62020",
  msugreen: "#18453B",
  macaroniandcheese: "#FFBD88",
  magenta: "#FF00FF",
  magicmint: "#AAF0D1",
  magnolia: "#F8F4FF",
  mahogany: "#C04000",
  maize: "#FBEC5D",
  majorelleblue: "#6050DC",
  malachite: "#0BDA51",
  manatee: "#979AAA",
  mangotango: "#FF8243",
  mantis: "#74C365",
  maroon: "#800000",
  mauve: "#E0B0FF",
  mauvetaupe: "#915F6D",
  mauvelous: "#EF98AA",
  mayablue: "#73C2FB",
  meatbrown: "#E5B73B",
  mediumpersianblue: "#0067A5",
  mediumaquamarine: "#66DDAA",
  mediumblue: "#0000CD",
  mediumcandyapplered: "#E2062C",
  mediumcarmine: "#AF4035",
  mediumchampagne: "#F3E5AB",
  mediumelectricblue: "#035096",
  mediumjunglegreen: "#1C352D",
  mediumlavendermagenta: "#DDA0DD",
  mediumorchid: "#BA55D3",
  mediumpurple: "#9370DB",
  mediumredviolet: "#BB3385",
  mediumseagreen: "#3CB371",
  mediumslateblue: "#7B68EE",
  mediumspringbud: "#C9DC87",
  mediumspringgreen: "#00FA9A",
  mediumtaupe: "#674C47",
  mediumtealblue: "#0054B4",
  mediumturquoise: "#48D1CC",
  mediumvioletred: "#C71585",
  melon: "#FDBCB4",
  midnightblue: "#191970",
  midnightgreen: "#004953",
  mikadoyellow: "#FFC40C",
  mint: "#3EB489",
  mintcream: "#F5FFFA",
  mintgreen: "#98FF98",
  mistyrose: "#FFE4E1",
  moccasin: "#FAEBD7",
  modebeige: "#967117",
  moonstoneblue: "#73A9C2",
  mordantred19: "#AE0C00",
  mossgreen: "#ADDFAD",
  mountainmeadow: "#30BA8F",
  mountbattenpink: "#997A8D",
  mulberry: "#C54B8C",
  munsell: "#F2F3F4",
  mustard: "#FFDB58",
  myrtle: "#21421E",
  nadeshikopink: "#F6ADC6",
  napiergreen: "#2A8000",
  naplesyellow: "#FADA5E",
  navajowhite: "#FFDEAD",
  navyblue: "#000080",
  neoncarrot: "#FFA343",
  neonfuchsia: "#FE59C2",
  neongreen: "#39FF14",
  nonphotoblue: "#A4DDED",
  northtexasgreen: "#059033",
  oceanboatblue: "#0077BE",
  ochre: "#CC7722",
  officegreen: "#008000",
  oldgold: "#CFB53B",
  oldlace: "#FDF5E6",
  oldlavender: "#796878",
  oldmauve: "#673147",
  oldrose: "#C08081",
  olive: "#808000",
  olivedrab: "#6B8E23",
  olivegreen: "#BAB86C",
  olivine: "#9AB973",
  onyx: "#0F0F0F",
  operamauve: "#B784A7",
  orange: "#FFA500",
  orangeyellow: "#F8D568",
  orangepeel: "#FF9F00",
  orangered: "#FF4500",
  orchid: "#DA70D6",
  otterbrown: "#654321",
  outerspace: "#414A4C",
  outrageousorange: "#FF6E4A",
  oxfordblue: "#002147",
  pacificblue: "#1CA9C9",
  pakistangreen: "#006600",
  palatinateblue: "#273BE2",
  palatinatepurple: "#682860",
  paleaqua: "#BCD4E6",
  paleblue: "#AFEEEE",
  palebrown: "#987654",
  palecarmine: "#AF4035",
  palecerulean: "#9BC4E2",
  palechestnut: "#DDADAF",
  palecopper: "#DA8A67",
  palecornflowerblue: "#ABCDEF",
  palegold: "#E6BE8A",
  palegoldenrod: "#EEE8AA",
  palegreen: "#98FB98",
  palelavender: "#DCD0FF",
  palemagenta: "#F984E5",
  palepink: "#FADADD",
  paleplum: "#DDA0DD",
  paleredviolet: "#DB7093",
  palerobineggblue: "#96DED1",
  palesilver: "#C9C0BB",
  palespringbud: "#ECEBBD",
  paletaupe: "#BC987E",
  palevioletred: "#DB7093",
  pansypurple: "#78184A",
  papayawhip: "#FFEFD5",
  parisgreen: "#50C878",
  pastelblue: "#AEC6CF",
  pastelbrown: "#836953",
  pastelgray: "#CFCFC4",
  pastelgreen: "#77DD77",
  pastelmagenta: "#F49AC2",
  pastelorange: "#FFB347",
  pastelpink: "#FFD1DC",
  pastelpurple: "#B39EB5",
  pastelred: "#FF6961",
  pastelviolet: "#CB99C9",
  pastelyellow: "#FDFD96",
  patriarch: "#800080",
  paynegrey: "#536878",
  peach: "#FFE5B4",
  peachpuff: "#FFDAB9",
  peachyellow: "#FADFAD",
  pear: "#D1E231",
  pearl: "#EAE0C8",
  pearlaqua: "#88D8C0",
  peridot: "#E6E200",
  periwinkle: "#CCCCFF",
  persianblue: "#1C39BB",
  persianindigo: "#32127A",
  persianorange: "#D99058",
  persianpink: "#F77FBE",
  persianplum: "#701C1C",
  persianred: "#CC3333",
  persianrose: "#FE28A2",
  phlox: "#DF00FF",
  phthaloblue: "#000F89",
  phthalogreen: "#123524",
  piggypink: "#FDDDE6",
  pinegreen: "#01796F",
  pink: "#FFC0CB",
  pinkflamingo: "#FC74FD",
  pinksherbet: "#F78FA7",
  pinkpearl: "#E7ACCF",
  pistachio: "#93C572",
  platinum: "#E5E4E2",
  plum: "#DDA0DD",
  portlandorange: "#FF5A36",
  powderblue: "#B0E0E6",
  princetonorange: "#FF8F00",
  prussianblue: "#003153",
  psychedelicpurple: "#DF00FF",
  puce: "#CC8899",
  pumpkin: "#FF7518",
  purple: "#800080",
  purpleheart: "#69359C",
  purplemountainsmajesty: "#9D81BA",
  purplemountainmajesty: "#9678B6",
  purplepizzazz: "#FE4EDA",
  purpletaupe: "#50404D",
  rackley: "#5D8AA8",
  radicalred: "#FF355E",
  raspberry: "#E30B5D",
  raspberryglace: "#915F6D",
  raspberrypink: "#E25098",
  raspberryrose: "#B3446C",
  rawsienna: "#D68A59",
  razzledazzlerose: "#FF33CC",
  razzmatazz: "#E3256B",
  red: "#FF0000",
  redorange: "#FF5349",
  redbrown: "#A52A2A",
  redviolet: "#C71585",
  richblack: "#004040",
  richcarmine: "#D70040",
  richelectricblue: "#0892D0",
  richlilac: "#B666D2",
  richmaroon: "#B03060",
  riflegreen: "#414833",
  robinseggblue: "#1FCECB",
  rose: "#FF007F",
  rosebonbon: "#F9429E",
  roseebony: "#674846",
  rosegold: "#B76E79",
  rosemadder: "#E32636",
  rosepink: "#FF66CC",
  rosequartz: "#AA98A9",
  rosetaupe: "#905D5D",
  rosevale: "#AB4E52",
  rosewood: "#65000B",
  rossocorsa: "#D40000",
  rosybrown: "#BC8F8F",
  royalazure: "#0038A8",
  royalblue: "#4169E1",
  royalfuchsia: "#CA2C92",
  royalpurple: "#7851A9",
  ruby: "#E0115F",
  ruddy: "#FF0028",
  ruddybrown: "#BB6528",
  ruddypink: "#E18E96",
  rufous: "#A81C07",
  russet: "#80461B",
  rust: "#B7410E",
  sacramentostategreen: "#00563F",
  saddlebrown: "#8B4513",
  safetyorange: "#FF6700",
  saffron: "#F4C430",
  saintpatrickblue: "#23297A",
  salmon: "#FF8C69",
  salmonpink: "#FF91A4",
  sand: "#C2B280",
  sanddune: "#967117",
  sandstorm: "#ECD540",
  sandybrown: "#F4A460",
  sandytaupe: "#967117",
  sapgreen: "#507D2A",
  sapphire: "#0F52BA",
  satinsheengold: "#CBA135",
  scarlet: "#FF2400",
  schoolbusyellow: "#FFD800",
  screamingreen: "#76FF7A",
  seablue: "#006994",
  seagreen: "#2E8B57",
  sealbrown: "#321414",
  seashell: "#FFF5EE",
  selectiveyellow: "#FFBA00",
  sepia: "#704214",
  shadow: "#8A795D",
  shamrock: "#45CEA2",
  shamrockgreen: "#009E60",
  shockingpink: "#FC0FC0",
  sienna: "#882D17",
  silver: "#C0C0C0",
  sinopia: "#CB410B",
  skobeloff: "#007474",
  skyblue: "#87CEEB",
  skymagenta: "#CF71AF",
  slateblue: "#6A5ACD",
  slategray: "#708090",
  smalt: "#003399",
  smokeytopaz: "#933D41",
  smokyblack: "#100C08",
  snow: "#FFFAFA",
  spirodiscoball: "#0FC0FC",
  springbud: "#A7FC00",
  springgreen: "#00FF7F",
  steelblue: "#4682B4",
  stildegrainyellow: "#FADA5E",
  stizza: "#990000",
  stormcloud: "#008080",
  straw: "#E4D96F",
  sunglow: "#FFCC33",
  sunset: "#FAD6A5",
  sunsetorange: "#FD5E53",
  tan: "#D2B48C",
  tangelo: "#F94D00",
  tangerine: "#F28500",
  tangerineyellow: "#FFCC00",
  taupe: "#483C32",
  taupegray: "#8B8589",
  tawny: "#CD5700",
  teagreen: "#D0F0C0",
  tearose: "#F4C2C2",
  teal: "#008080",
  tealblue: "#367588",
  tealgreen: "#006D5B",
  terracotta: "#E2725B",
  thistle: "#D8BFD8",
  thulianpink: "#DE6FA1",
  ticklemepink: "#FC89AC",
  tiffanyblue: "#0ABAB5",
  tigereye: "#E08D3C",
  timberwolf: "#DBD7D2",
  titaniumyellow: "#EEE600",
  tomato: "#FF6347",
  toolbox: "#746CC0",
  topaz: "#FFC87C",
  tractorred: "#FD0E35",
  trolleygrey: "#808080",
  tropicalrainforest: "#00755E",
  trueblue: "#0073CF",
  tuftsblue: "#417DC1",
  tumbleweed: "#DEAA88",
  turkishrose: "#B57281",
  turquoise: "#30D5C8",
  turquoiseblue: "#00FFEF",
  turquoisegreen: "#A0D6B4",
  tuscanred: "#66424D",
  twilightlavender: "#8A496B",
  tyrianpurple: "#66023C",
  uablue: "#0033AA",
  uared: "#D9004C",
  uclablue: "#536895",
  uclagold: "#FFB300",
  ufogreen: "#3CD070",
  upforestgreen: "#014421",
  upmaroon: "#7B1113",
  usccardinal: "#990000",
  uscgold: "#FFCC00",
  ube: "#8878C3",
  ultrapink: "#FF6FFF",
  ultramarine: "#120A8F",
  ultramarineblue: "#4166F5",
  umber: "#635147",
  unitednationsblue: "#5B92E5",
  universityofcaliforniagold: "#B78727",
  unmellowyellow: "#FFFF66",
  upsdellred: "#AE2029",
  urobilin: "#E1AD21",
  utahcrimson: "#D3003F",
  vanilla: "#F3E5AB",
  vegasgold: "#C5B358",
  venetianred: "#C80815",
  verdigris: "#43B3AE",
  vermilion: "#E34234",
  veronica: "#A020F0",
  violet: "#EE82EE",
  violetblue: "#324AB2",
  violetred: "#F75394",
  viridian: "#40826D",
  vividauburn: "#922724",
  vividburgundy: "#9F1D35",
  vividcerise: "#DA1D81",
  vividtangerine: "#FFA089",
  vividviolet: "#9F00FF",
  warmblack: "#004242",
  waterspout: "#00FFFF",
  wenge: "#645452",
  wheat: "#F5DEB3",
  white: "#FFFFFF",
  whitesmoke: "#F5F5F5",
  wildstrawberry: "#FF43A4",
  wildwatermelon: "#FC6C85",
  wildblueyonder: "#A2ADD0",
  wine: "#722F37",
  wisteria: "#C9A0DC",
  xanadu: "#738678",
  yaleblue: "#0F4D92",
  yellow: "#FFFF00",
  yelloworange: "#FFAE42",
  yellowgreen: "#9ACD32",
  zaffre: "#0014A8",
  zinnwalditebrown: "#2C1608"
}

exports.mslanguages = {
  af: "afrikaans",
  ar: "arabic",
  bslatn: "bosnian (latin)",
  bg: "bulgarian",
  ca: "catalan",
  zhchs: "chinese simplified",
  zhcht: "chinese traditional",
  hr: "croatian",
  cs: "czech",
  da: "danish",
  nl: "dutch",
  en: "english",
  et: "estonian",
  fi: "finnish",
  fr: "french",
  de: "german",
  el: "greek",
  ht: "haitian creole",
  he: "hebrew",
  hi: "hindi",
  mww: "hmong daw",
  hu: "hungarian",
  id: "indonesian",
  it: "italian",
  ja: "japanese",
  sw: "kiswahili",
  tlh: "klingon",
  tlhqaak: "klingon (piqad)",
  ko: "korean",
  lv: "latvian",
  lt: "lithuanian",
  ms: "malay",
  mt: "maltese",
  no: "norwegian",
  fa: "persian",
  pl: "polish",
  pt: "portuguese",
  otq: "querétaro otomi",
  ro: "romanian",
  ru: "russian",
  srcyrl: "serbian (cyrillic)",
  srlatn: "serbian (latin)",
  sk: "slovak",
  sl: "slovenian",
  es: "spanish",
  sv: "swedish",
  th: "thai",
  tr: "turkish",
  uk: "ukrainian",
  ur: "urdu",
  vi: "vietnamese",
  cy: "welsh",
  yua: "yucatec maya"
}

exports.responses = {
  AUTO_CHANNEL: {
    DISABLED: {
      english: "Disabled automatic channels in this server.",
      spanish: "Los canales automáticos han sido desactivados en este servidor."
    },
    ENABLED: {
      english: "Enabled automatic channels in this server.",
      spanish: "Los canales automáticos han sido activados en este servidor."
    },
    NOT_READY: {
      english: "Automatic channels aren't ready yet in this server, please wait a few more seconds and try again.",
      spanish: "Los canales automáticos no están listos todavía para servidor, por favor espera unos segundos más e inténtalo de nuevo."
    },
    UPDATED: {
      english: "Updated channels for this server.",
      spanish: "Los canales automáticos han sido actualizados para este servidor"
    },
    SET_THRESHOLD: {
      english: (threshold) => `Set the automatic channel creation threshold in this server to \`${threshold}\` players.`,
      spanish: (threshold) => `El umbral de creación automática de canales ha sido establecido en este servidor a \`${threshold}\` jugadores.`
    }
  },

  AVATAR: {
    INVALID: {
      english: (url) => `${url} is an invalid image.`,
      spanish: (url) => `${url} es una imagen inválida.`
    },
    SET: {
      english: (url) => `Changed the bot's image to ${url}.`,
      spanish: (url) => `La imágen del bot ha sido cambiada a ${url}.`
    }
  },

  BLACKJACK: {
    ADDED_PLAYER: {
      english: (channel) => stripIndents`Added you to a game of Blackjack.
      You can play in <#${channel}>.
      You can remove yourself from the game at any time by using this command again.`,
      spanish: (channel) => stripIndents`Has sido añadido a una partida de Blackjack.
      Puedes jugar en <#${channel}>.
      Puedes abandonar la partida en cualquier momento usando este comando de nuevo.`,
    },
    AVAILABLE_ACTIONS: {
      english: (actions) => `Your available actions are \`${actions}\`.`,
      spanish: (actions) => `Tus acciones disponibles son \`${actions}\`.`
    },
    DEAL: {
      english: (name, suit, card, total, actions) => stripIndents`
        ${name}, dealt you ${suit}${card}. Total score: ${total}.
        Actions you can take: ${actions}
      `,
      spanish: (name, suit, card, total, actions) => stripIndents`
        ${name}, te he repartido ${suit}${card}. Puntuación total: ${total}.
        Acciones que puedes tomar: ${actions}
      `
    },
    HELP: {
      english: stripIndents`In a game of Blackjack, the objective is to reach the highest score that is equal to or under 21. If at any point you go above 21 points, you lose that round.

      Every numeric card has the same point value as its number, Aces are worth either 1 or 11 points, and face cards (Jack, Queen, King) are worth 10 points.

      After settling for your point amount, the dealer will draw until their score is equal to or above 17 points. After that your score is compared with the dealer's, if any score is above 21, that person loses. Otherwise, the highest score wins.

      Every turn you will be able to take a set of actions depending on your situation:
      hit, stand, double, split and surrender.

      Hit draws one card.

      Stand deals no cards and settles for your point and bet amounts.

      Double doubles your bet, deals you a card and sets you to 'stand' for the rest of that game.

      Split can only be used if your first 2 cards have the same value, and it splits your hand into two with those cards.

      Surrender halves your bet and makes you instantly lose that game.
      `,
      spanish: stripIndents`En una partida de Blackjack, el objetivo es alcanzar la puntuación más alta que sea igual o menor a 21. Si en cualquier momento tu puntuación llega a ser mayor a 21, pierdes esa ronda.

      Cada carta numérica tiene el mismo valor que su numero, los Ases valen 1 o 11 puntos, y las figuras (Valet, Dame y Roi) valen 10 puntos.

      Después de asentar tu puntuación, el crupier robará cartas hasta que su puntuación sea igual o mayor a 17 puntos. Después, tu puntuación es comparada con la del crupier, si una de las dos puntuaciones sobrepasa 21 puntos, esa persona pierde. De lo contrario, la puntuación mas alta gana.

      Cada turno tendrás disponibles diferentes acciones según tu situación:
      hit, stand, double, split y surrender.

      Hit roba una carta.

      Stand no roba ninguna carta, pero asienta tu puntuación y tu apuesta.

      Double dobla tu apuesta, roba una carta y hace que hagas "stand" durante el resto de la partida.

      Split solo puede ser usado si tus 2 primeras cartas tienen el mismo valor, y hace divide tu mano en dos distintas con esas cartas.

      Surrender reduce en la mitad tu apuesta y hace que pierdas instantáneamente esa partida.
      `
    },
    KICK: {
      ALREADY_VOTED: {
        english: (name) => `You already voted to kick ${name}.`,
        spanish: (name) => `Ya has votado para echar a ${name}.`
      },
      FAIL: {
        english: (votes, total, name) => `${votes} out of ${total} players want to kick ${name} from this round of Blackjack.`,
        spanish: (votes, total, name) => `${votes} de ${total} jugadores quieren echar a ${name} de esta ronda de Blackjack.`
      },
      INVALID_MEMBER: {
        english: "Invalid player.",
        spanish: "Jugador inválido."
      },
      NO_MEMBER_SPECIFIED: {
        english: "You need to specify a player to vote kick.",
        spanish: "Necesitas especificar un jugador a quien echar por votos."
      },
      NOT_PLAYING: {
        english: (name) => `${name} isn't playing Blackjack.`,
        spanish: (name) => `${name} no esta jugando Blackjack.`
      },
      SUCCESS: {
        english: (name) => `Kicked player ${name} from this round of Blackjack.`,
        spanish: (name) => `Echado jugador ${name} de esta ronda de Blackjack.`
      }
    },
    LOSE: {
      english: (name) => `${name} loses.`,
      spanish: (name) => `${name} pierde.`
    },
    NATURAL_BLACKJACK: {
      english: (name) => `${name} gets a natural Blackjack!`,
      spanish: (name) => `¡${name} consigue un Blackjack natural!`
    },
    REMOVED_PLAYER: {
      english: "Removed you from a game of Blackjack.",
      spanish: "Te he quitado de un juego de Blackjack."
    },
    TIE: {
      english: (name) => `${name} ties with the dealer.`,
      spanish: (name) => `${name} ha empatado con el crupier.`
    },
    WIN: {
      english: (name) => `${name} wins!`,
      spanish: (name) => `¡${name} gana!`
    }
  },

  BLACKJACK_ADMIN: {
    ENDED_GAME: {
      english: (channel) => `Ended a game of Blackjack in ${channel}.`,
      spanish: (channel) => `Una partida de Blackjack ha finalizado en ${channel}.`
    },
    KICKED_PLAYER: {
      english: (player) => `Kicked player ${player} from a game of Blackjack.`,
      spanish: (player) => `El jugador ${player} ha sido echado de una partida de Blackjack.`
    },
    NO_GAMES: {
      english: "No games of Blackjack are being played in this server.",
      spanish: "Ninguna partida de Blackjack esta siendo jugada en este servidor."
    }
  },

  BLACKJACK: {
    ADDED_PLAYER: {
      english: (channel) => stripIndents`Added you to a game of Blackjack.
      You can play in <#${channel}>.
      You can remove yourself from the game at any time by using this command again.`,
      spanish: (channel) => stripIndents`Te he añadido a una partida de Blackjack.
      Puedes jugar en <#${channel}>.
      Te puedes quitar de la partida en cualquier momento usando este comando de nuevo.`,
    },
    AVAILABLE_ACTIONS: {
      english: (actions) => `Your available actions are \`${actions}\`.`,
      spanish: (actions) => `Tus acciones disponibles son \`${actions}\`.`
    },
    DEAL: {
      english: (name, symbol, card, total, actions) => stripIndents`
        ${name}, dealt you ${symbol}${card}. Total score: ${total}.
        Actions you can take: ${actions}
      `,
      spanish: (name, symbol, card, total, actions) => stripIndents`
        ${name}, te he repartido ${symbol}${card}. Puntuación total: ${total}.
        Actions you can take: ${actions}
      `
    },
    DEALER_DEAL: {
      english: (symbol, card, total) => stripIndents`
        The dealer draws ${symbol}${card}. Total score: ${total}.
      `,
      spanish: (symbol, card, total) => stripIndents`
        El crupier roba ${symbol}${card}.
        Puntuación total: ${total}.
      `
    },
    HELP: {
      english: stripIndents`In a game of Blackjack, the objective is to reach the highest score that is equal to or under 21. If at any point you go above 21 points, you lose that round.

      Every numeric card has the same point value as its number, Aces are worth either 1 or 11 points, and face cards (Jack, Queen, King) are worth 10 points.

      After settling for your point amount, the dealer will draw until their score is equal to or above 17 points. After that your score is compared with the dealer's, if any score is above 21, that person loses. Otherwise, the highest score wins.

      Every turn you will be able to take a set of actions depending on your situation:
      hit, stand, double, split and surrender.

      Hit draws one card.

      Stand deals no cards and settles for your point and bet amounts.

      Double doubles your bet, deals you a card and sets you to 'stand' for the rest of that game.

      Split can only be used if your first 2 cards have the same value, and it splits your hand into two with those cards.

      Surrender halves your bet and makes you instantly lose that game.
      `,
      spanish: stripIndents`En una partida de Blackjack, el objetivo es alcanzar la puntuación más alta que sea igual o menor a 21. Si en cualquier momento tu puntuación llega a ser más de 21, pierdes esa ronda.

      Cada carta numérica tiene el mismo valor que su numero, los Ases valen 1 o 11 puntos, y las figuras (Valet, Dame y Roi) valen 10 puntos.

      Después de asentar tu puntuación, el crupier robará cartas hasta que su puntuación sea igual o mayor a 17 puntos. Después, tu puntuación es comparada con la del crupier, si una de las dos puntuaciones sobrepasa 21 puntos, esa persona pierde. De lo contrario, la puntuación mas alta gana.

      Cada turno tendrás disponibles diferentes acciones según tu situación:
      hit, stand, double, split y surrender.

      Hit roba una carta.

      Stand no roba ninguna carta y asienta tu puntuación y apuesta.

      Double dobla tu apuesta, roba una carta y establece tu acción como 'stand' para el resto de esa partida.

      Split solo puede ser usado si tus 2 primeras cartas tienen el mismo valor, y divide tu mano en 2 con esas cartas.

      Surrender reduce en la mitad tu apuesta y hace que pierdas instantáneamente esa partida.
      `
    },
    KICK: {
      ALREADY_VOTED: {
        english: (name) => `You already voted to kick ${name}.`,
        spanish: (name) => `Ya has votado para echar a ${name}.`
      },
      FAIL: {
        english: (votes, total, name) => `${votes} out of ${total} players want to kick ${name} from this round of Blackjack.`,
        spanish: (votes, total, name) => `${votes} de ${total} jugadores quieren echar a ${name} de esta ronda de Blackjack.`
      },
      INVALID_MEMBER: {
        english: "Invalid player.",
        spanish: "Jugador inválido."
      },
      NO_MEMBER_SPECIFIED: {
        english: "You need to specify a player to vote kick.",
        spanish: "Necesitas especificar un jugador a quien echar por votos."
      },
      NOT_PLAYING: {
        english: (name) => `${name} isn't playing Blackjack.`,
        spanish: (name) => `${name} no esta jugando Blackjack.`
      },
      SUCCESS: {
        english: (name) => `Kicked player ${name} from this round of Blackjack.`,
        spanish: (name) => `Echado jugador ${name} de esta ronda de Blackjack.`
      }
    },
    LOSE: {
      english: (name) => `${name} loses.`,
      spanish: (name) => `${name} pierde.`
    },
    NATURAL_BLACKJACK: {
      english: (name) => `${name} gets a natural Blackjack!`,
      spanish: (name) => `¡${name} consigue un Blackjack natural!`
    },
    REMOVED_PLAYER: {
      english: "Removed you from a game of Blackjack.",
      spanish: "Te he quitado de un juego de Blackjack."
    },
    START: {
      CARD: {
        english: (symbol, name) => `${symbol}${name}`,
        spanish: (symbol, name) => `${symbol}${name}`
      },
      DEALER_HAND: {
        english: "Dealer's hand:\n",
        spanish: "Mano del crupier:\n"
      },
      DEALER_TOTAL: {
        english: (score) => `. Total: ${score}\n`,
        spanish: (score) => `. Total: ${score}\n`
      },
      PLAYER_HAND: {
        english: (name) => `${name}'s hand:\n`,
        spanish: (name) => `Mano de ${name}:\n`
      },
      PLAYER_TOTAL: {
        english: (score, actions) => oneLine`
          . Total: ${score}.
          ${actions ? `Actions you can take: ${actions}.\n` : ""}
        `,
        spanish: (score, actions) => oneLine`
          . Total: ${score}.
          ${actions ? `Acciones que puedes tomar: ${actions}.\n` : ""}
        `
      }
    },
    TIE: {
      english: (name) => `${name} ties with the dealer.`,
      spanish: (name) => `${name} empata con el crupier.`
    },
    WIN: {
      english: (name) => `${name} wins!`,
      spanish: (name) => `¡${name} gana!`
    }
  },

  BLACKJACK_ADMIN: {
    ENDED_GAME: {
      english: (channel) => `Ended a game of Blackjack in ${channel}.`,
      spanish: (channel) => `Terminada una partida de Blackjack en ${channel}.`
    },
    KICKED_PLAYER: {
      english: (player) => `Kicked player ${player} from a game of Blackjack.`,
      spanish: (player) => `Echado jugador ${player} de una partida de Blackjack.`
    },
    NO_GAMES: {
      english: "No games of Blackjack are being played in this server.",
      spanish: "Ninguna partida de Blackjack esta siendo jugada en este servidor."
    }
  },

  BLACKLIST: {
    BLACKLISTED: {
      english: (name) => `Blacklisted user \`${name}\`.`,
      spanish: (name) => `Añadido usuario \`${name}\` a la lista negra.`
    },
    CANT_BLACKLIST_SELF: {
      english: "You can't blacklist yourself!",
      spanish: "¡No te puedes añadir a la lista negra a ti mismo!"
    },
    WHITELISTED: {
      english: (name) => `Removed user \`${name}\` from the blacklist.`,
      spanish: (name) => `Quitado usuario \`${name}\` de la lista negra.`
    }
  },

  BRIDGE: {
    BRIDGED: {
      english: (channels) => oneLine`
        Linked together channels \`${channels}\`.
        Messages sent to those channels will be translated and sent between them.
      `,
      spanish: (channels) => oneLine`
        Juntados canales \`${channels}\`.
        Los mensajes mandados a través de esos canales serán traducidos y enviados entre ellos.
      `
    },
    NOT_READY: {
      english: "Channel linking isn't ready yet in this server, please wait a few more seconds and try again.",
      spanish: "El enlace de canales no está listo todavía para este servidor, por favor espera unos segundos más e inténtalo de nuevo."
    },
    TRANSLATE: (name, translation) => `**${name}**: ${translation}`,
  },

  CLEAN_MESSAGES: {
    NO_PERMISSION: {
      english: "I don't have permission to delete messages in this channel.",
      spanish: "No tengo permiso para borrar mensajes en este canal."
    }
  },

  COLOR: {
    ADDED: {
      english: (hex) => `Added name color \`${hex}\`.`,
<<<<<<< HEAD:libs/util/constants.js
      spanish: (hex) => `Añadido color \`${hex}\` para tú nombre.`
    },
    EDITED: {
      english: (hex) => `Changed your name color to \`${hex}\``,
      spanish: (hex) => `El color de tu nombre ha sido cambiado a \`${hex}\``
    },
    INVALID: {
      english: (color) => `Color \`${color}\` doesn't exist. Try a name in english or hex string (red, #FF0000).`,
      spanish: (color) => `El color \`${color}\` no existe. Prueba a usar un nombre en inglés o hex (red, #FF0000).`
=======
      spanish: (hex) => `Añadido color de nombre \`${hex}\`.`
    },
    EDITED: {
      english: (hex) => `Changed your name color to \`${hex}\``,
      spanish: (hex) => `He cambiado tu color de nombre a \`${hex}\``
    },
    INVALID: {
      english: (color) => `Color \`${color}\` doesn't exist. Try a name in english or hex string (red, #FF0000).`,
      spanish: (color) => `Color \`${color}\` no existe. Prueba a usar un nombre en inglés o hex (red, #FF0000).`
    },
    NO_COLOR_ROLE: {
      english: "You don't have a name color.",
      spanish: "No tienes un color en tú nombre."
    },
    NO_PERMISSION: {
      english: "I don't have permission to change your name color.",
      spanish: "No tengo permiso para cambiar el color de tu nombre."
    },
    REMOVED: {
      english: "Removed name color.",
      spanish: "Quitado color de nombre."
    }
  },

  COMMANDO: {
    ARGUMENT: {
      INVALID_LABEL: {
        english: (label) => `You provided an invalid ${label}. Please try again.`,
        spanish: (label) => `Has proporcionado un ${label} inválido. Por favor, inténtalo de nuevo.`
      },
      RESPOND_WITH_CANCEL: {
        english: "Respond with \`cancel\` to cancel the command.",
        spanish: "Responde con \`cancel\` para cancelar el comando."
      },
      WAIT: {
        english: (time) => `The command will automatically be cancelled in ${time} seconds.`,
        spanish: (time) => `El commando será cancelado aútomaticamente en ${time} segundos.`
      }
    }
  },

  CUSTOM_COMMAND: {
    ALREADY_EXISTS: {
      english: (name) => `Custom command \`${name}\` already exists.`,
      spanish: (name) => `El comando personalizado \`${name}\` ya existe.`
    },
    CANT_CONNECT: {
      english: "I can't connect to that voice channel.",
      spanish: "No puedo conectarme a ese canal de voz."
    },
    CANT_SPEAK: {
      english: "I can't speak in that voice channel.",
      spanish: "No puedo hablar en ese canal de voz."
    },
    CURRENTLY_PLAYING: {
      english: "A song is currently playing, please wait until it finishes.",
      spanish: "Una canción está siendo reproducida actualmente, por favor espere a que termine."
    },
    DISPATCHER_ERROR: {
      english: (name) => `Error playing ${name}.`,
      spanish: (name) => `Error descargando ${name}.`
    },
    DOESNT_EXIST: {
      english: (name) => `Custom command \`${name}\` doesn't exist.`,
      spanish: (name) => `El comando personalizado \`${name}\` no existe.`
    },
    NOT_IN_VOICE_CHANNEL: {
      english: (name) => `Member ${name} isn't currently in a voice channel.`,
      spanish: (name) => `El miembro ${name} no está actualmente en un canal de voz.`
    },
    NOT_READY: {
      english: "Custom commands aren't ready yet in this server, please wait a few more seconds and try again.",
      spanish: "Los comandos personalizados no están listos todavía para este servidor, por favor espera unos segundos más e inténtalo de nuevo."
    },
    REGISTERED: {
      english: (name) => oneLine`Added command ${name}, use \`${name}\` to use it.`,
      spanish: (name) => oneLine`Añadido el comando ${name}, utiliza \`${name}\` para usarlo.`
    },
    UNREGISTERED: {
      english: (name) => `Removed custom command \`${name}\`.`,
      spanish: (name) => `Borrado el comando personalizado \`${name}\`.`
    },
    YTDL_ERROR: {
      english: (name) => `Error downloading ${name}.`,
      spanish: (name) => `Error descargando ${name}.`
    }
  },

  INFO: {
    english: stripIndents`
      GitHub page: https://github.com/DrSmugleaf/Banter-Bot
      Support server: https://discord.gg/yyDWNBr
    `,
    spanish: stripIndents`
      Página de GitHub: https://github.com/DrSmugleaf/Banter-Bot
      Servidor de soporte: https://discord.gg/yyDWNBr
    `
  },

  INFO_CHANNEL: {
    INVALID: {
      english: (channel) => `${channel} isn't a text channel.`,
      spanish: (channel) => `${channel} no es un canal de texto.`
    },
    NO_PERMISSION: {
      english: (channel) => `I don't have permission to send messages to ${channel}.`,
      spanish: (channel) => `No tengo permiso para enviar mensajes a ${channel}.`
    },
    REMOVED: {
      english: "Removed server's info channel.",
      spanish: "El canal de información del servidor ha sido borrado."
    },
    SET: {
      english: (channel) => `Set ${channel} as this server's info channel.`,
      spanish: (channel) => `Asignado ${channel} como el canal de información de este servidor.`
    },
  },

  LANGUAGE: {
    SET: {
      english: (language) => `Set your language to ${language}.`,
      spanish: (language) => `Tu lenguage ha sido asignado como ${language}.`
    }
  },

  MAGIC8BALL: {
    english: ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."],
<<<<<<< HEAD:libs/util/constants.js
    spanish: ["En mi opinión, sí.", "Es cierto.", "Definitivamente, es así.", "Probablemente.", "Buen pronóstico.", "Todo apunta a que sí.", "Sin duda.", "Sí.", "Sí - definitivamente.", "Debes confiar en ello.", "Respuesta vaga, vuelve a intentarlo.", "Pregunta en otro momento.", "Será mejor que no te lo diga ahora.", "No puedo predecirlo ahora.", "Concéntrate y vuelve a preguntar.", "No cuentes con ello.", "Mi respuesta es no.", "Mis fuentes me dicen que no.", "Las perspectivas no son buenas.", "Muy dudoso."]
  },

  NAME: {
    SET: {
      english: (name) => `Changed the bot's username to ${name}.`,
      spanish: (name) => `El nombre del bot ha sido cambiado a ${name}.`
    }
  },

  PLAYING: {
    SET: {
      english: (name) => `Changed the bot's game to ${name}.`,
      spanish: (name) => `Cambiado el juego del bot a ${name}.`
    }
  },

  QUOTE: {
    ADDED: {
      english: (number, command) => `Quote #${number} added, use \`${command} ${number}\` to see it.`,
      spanish: (number, command) => `Quote #${number} añadido, utiliza \`${command} ${number}\` para verlo.`
    },
    EMPTY: {
      english: (command) => `There are no quotes, add some by using \`${command} <text>\`.`,
      spanish: (command) => `No hay quotes en la lista, añade algunos usando \`${command} <texto>\`.`
    },
    ERROR: {
      english: `Error occurred while managing quotes, please try again or contact the owner in ${exports.defaultoptions.invite}.`,
      spanish: `Se ha producido un error al gestionar los quotes, por favor inténtelo de nuevo o contacta con el dueño en ${exports.defaultoptions.invite}.`
    },
    GET: {
      english: (number, text) => `Quote #${number}: ${text}`,
      spanish: (number, text) => `Quote #${number}: ${text}`
    },
    MISSING: {
      english: (number) => `Quote #${number} doesn't exist.`,
      spanish: (number) => `El quote #${number} no existe.`
    },
    NO_MODE: {
      english: (mode) => `Mode \`${mode}\` doesn't exist.`,
      spanish: (mode) => `El modo \`${mode}\` no existe.`
    },
    NO_PERMISSION: {
      english: (number) => `You don't have permission to remove quote #${number}.`,
      spanish: (number) => `No tienes permiso para eliminar quote #${number}.`
    },
    NO_TEXT: {
      english: "Quote empty, add text after the command.",
      spanish: "Quote vacío, añade texto después del comando."
    },
    NOT_READY: {
      english: "Quotes aren't ready yet in this server, please wait a few more seconds and try again.",
      spanish: "Los quotes no están listos todavía para este servidor, por favor espera unos segundos más e inténtalo de nuevo"
    },
    REMOVED: {
      english: (number) => `Removed quote #${number}.`,
      spanish: (number) => `El quote #${number} ha sido eliminado.`
    }
  },

  SERVER_LANGUAGE: {
    SET: {
      english: (language) => `Set the server language to ${language}.`,
      spanish: (language) => `El lenguaje del servidor ha sido asignado como ${language}.`
    }
  },

  SERVER_SETTINGS: {
    CLEAR: {
      english: "Cleared settings for this server.",
      spanish: "Las opciones del servidor han sido limpiadas."
    },
    GET: {
      english: (key, value) => `Settings for \`${key}\`: \`${value}\`.`,
      spanish: (key, value) => `Opciones para \`${key}\`: \`0${value}\`.`
    },
    REMOVE: {
      english: (key) => `Removed setting \`${key}\`.`,
      spanish: (key) => `Eliminada opción \`${key}\`.`
    },
    SET: {
      english: (key, value) => `Set \`${key}\` to \`${value}\`.`,
      spanish: (key, value) => `Establecida \`${key}\` como \`${value}\`.`
    }
  },

  SONG_TEXT_CHANNEL: {
    INVALID: {
      english: (channel) => `${channel} isn't a text channel.`,
      spanish: (channel) => `${channel} no es un canal de texto.`
    },
    NO_PERMISSION: {
      english: (channel) => `I don't have permission to send messages to ${channel}.`,
      spanish: (channel) => `No tengo permiso para enviar mensajes a ${channel}.`
    },
    REMOVED: {
      english: "Removed server's song text channel.",
      spanish: "Quitado el canal de texto de canciones de este servidor."
    },
    SET: {
      english: (channel) => `Set ${channel} as this server's song text channel.`,
      spanish: (channel) => `El canal de texto de canciones de este servidor ha sido asignado como ${channel}`
    }
  },

  SONG_VOICE_CHANNEL: {
    INVALID: {
      english: (channel) => `${channel} isn't a voice channel.`,
      spanish: (channel) => `${channel} no es un canal de voz.`
    },
    CANT_CONNECT: {
      english: (channel) => `I can't connect to ${channel}.`,
      spanish: (channel) => `No puedo conectarme a ${channel}.`
    },
    CANT_SPEAK: {
      english: "I can't speak in that voice channel.",
      spanish: "No puedo hablar en ese canal de voz."
    },
    REMOVED: {
      english: "Removed server's song voice channel.",
      spanish: "Quitado el canal de voz de canciones de este servidor."
    },
    SET: {
      english: (channel) => `Set ${channel} as this server's song voice channel.`,
      spanish: (channel) => `El canal de voz de canciones de este servidor ha sido asignado como ${channel}`
    }
  },

  WHOIS: {
    english: (user, member, joined, created) => stripIndents`
      Info on **${user.username}#${user.discriminator}** (ID: ${user.id})
      **❯ Member Details**
      ${member.nickname !== null ? ` • Nickname: ${member.nickname}` : " • No Nickname"}
       • Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(", ")}
       • Joined at: ${joined}

      **❯ User Details**
       • Created at: ${created}${user.bot ? "\n • Is a bot account" : ""}
       • Status: ${user.presence.status}
       • Game: ${user.presence.game ? user.presence.game.name : "None"}
    `,
    spanish: (user, member, joined, created) => stripIndents`
      Información sobre **${user.username}#${user.discriminator}** (ID: ${user.id})
      **❯ Detalles sobre el Miembro**
      ${member.nickname !== null ? ` • Apodo: ${member.nickname}` : " • Ningún Apodo"}
       • Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(", ")}
       • Se unió en: ${joined}

      **❯ Detalles del Usuario**
       • Se creó en: ${created}${user.bot ? "\n • Es una cuenta bot" : ""}
       • Estado: ${user.presence.status}
       • Juego: ${user.presence.game ? user.presence.game.name : "Ninguno"}
    `
  },

  YOUTUBE: {
    CANT_CONNECT: {
      english: (channel) => `I can't connect to \`${channel}\`.`,
      spanish: (channel) => `No puedo conectarme a \`${channel}\`.`
    },
    CANT_CONNECT_ANYMORE: {
      english: (channel) => `I can't connect to \`${channel}\` anymore, skipping song.`,
      spanish: (channel) => `Ya no puedo conectarme a \`${channel}\`, omitiendo canción.`
    },
    CANT_SPEAK: {
      english: (channel) => `I can't speak in \`${channel}\`.`,
      spanish: (channel) => `No puedo hablar en \`${channel}\`.`
    },
    CANT_SPEAK_ANYMORE: {
      english: (channel) => `I can't speak in \`${channel}\` anymore, skipping song.`,
      spanish: (channel) => `Ya no puedo hablar en \`${channel}\`, omitiendo canción.`
    },
    EMPTY_QUEUE: {
      english: "There are no songs in the queue.",
      spanish: "No hay canciones en cola."
    },
    ERROR: {
      english: "Error downloading song.",
      spanish: "Error descargando canción."
    },
    LEFT_VOICE: {
      english: "You aren't in a voice channel anymore, skipping song.",
      spanish: "Ya no estás en un canal de voz, omitiendo canción."
    },
    NEXT: {
      DISPATCHER_ERROR: {
        english: (title) => `Error playing ${title}, skipping song.`,
        spanish: (title) => `Error reproduciendo ${title}, omitiendo canción.`
      },
      ERROR: {
        english: (title) => `Couldn't play ${title}, skipping song.`,
        spanish: (title) => `Error al reproducir la canción ${title}, omitiendo canción.`
      },
      PLAY: {
        english: (title) => `Now playing: ${title}.`,
        spanish: (title) => `Ahora reproduciendo: ${title}.`,
      },
      REPEAT: {
        english: (title) => `Now repeating: ${title}.`,
        spanish: (title) => `Ahora repitiendo: ${title}.`
      }
    },
    NO_CURRENTLY_PLAYING: {
      english: "There is no currently playing song.",
      spanish: "No hay ninguna canción en reproducción."
    },
    NO_PAUSED: {
      english: "There is no currently paused song.",
      spanish: "No hay ninguna canción pausada.",
    },
    NO_PLAYING: {
      english: "There is no currently playing or paused song.",
      spanish: "No hay ninguna canción reproduciendose o pausada actualmente."
    },
    NOT_IN_VOICE_CHANNEL: {
      english: "You aren't in a voice channel.",
      spanish: "No estás en ningún canal de voz."
    },
    NOT_SAME_VOICE_CHANNEL: {
      english: "You aren't in the same voice channel.",
      spanish: "No estas en el mismo canal de voz."
    },
    PAUSE: {
      english: "Paused the current video.",
      spanish: "Vídeo pausado."
    },
    PLAY: {
      english: (title) => `Added ${title} to the queue.`,
      spanish: (title) => `${title} ha sido añadido a la cola.`
    },
    QUEUE: {
      english: (length) => `There are ${length} songs in the queue.`,
      spanish: (length) => `Hay ${length} canciones en la cola.`
    },
    RESUME: {
      english: "Resumed the current video.",
      spanish: "El vídeo ha sido reanudado."
    },
    SKIP: {
      ALREADY_VOTED: {
        english: "You already voted to skip this song.",
        spanish: "Ya has votado para omitir esta canción."
      },
      FAIL: {
        english: (votes, total) => oneLine`${votes} out of ${total} members want
          to skip the current video.`,
        spanish: (votes, total) => oneLine`${votes} de ${total} miembros quieren
          saltarse el vídeo actual.`
      },
      SUCCESS: {
        english: (votes, total) => oneLine`${votes} out of ${total} members voted
          to skip, skipped the current video.`,
        spanish: (votes, total) => oneLine`${votes} de ${total} miembros votaron
          para saltar este vídeo, saltado el vídeo actual.`
      }
    },
    STOP: {
      english: "Stopped the current video.",
      spanish: "El vídeo actual ha sido parado."
    },
    STOP_ALL: {
      english: "Stopped and removed all videos from the queue.",
      spanish: "Parados y quitados todos los vídeos en cola."
    },
    TOO_MANY_SONGS: {
      english: oneLine`You have submitted too many songs to the queue,
        wait until one of yours finishes.
      `,
      spanish: oneLine`Has enviado demasiadas canciones a la cola,
        espera hasta que una de las tuyas termine.
      `
    }
  }
},

exports.youtube = {
  STREAM_OPTIONS: { seek: 0, volume: 0.25, passes: 2 }
}


for(const lang in exports.mslanguages) {
  const language = exports.mslanguages[lang]

  for(const response in exports.responses) {
    for(const subresponse in exports.responses[response]) {
      if(typeof exports.responses[response][subresponse] === "object") {
        if(!exports.responses[response][subresponse][language]) {
          exports.responses[response][subresponse][language] = function(...args) {
            return exports.responses[response][subresponse]["english"](...args)
          }
        }
      }
    }
  }
}
