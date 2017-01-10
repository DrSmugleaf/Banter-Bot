//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"

function _rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).toUpperCase().slice(1)
}

String.prototype.toHex = function() {
  let decimalregex = /( *([0-9]+), *([0-9]+), *([0-9]+) *)/g
  let hexregex = /[A-F0-9]{6}|[A-F0-9]{3}/i
  let match

  while((match = decimalregex.exec(this)) !== null) {
    if(match.index === decimalregex.lastIndex) {
      decimalregex.lastIndex++
    }
    return _rgbToHex(parseInt(match[2]), parseInt(match[3]), parseInt(match[4]))
  }
  if(hexregex.test(this)) {
    return "#" + this.match(hexregex).toString(16).toUpperCase()
  }
  return null
}

class RGB {
  constructor() {}
}

module.exports = RGB
