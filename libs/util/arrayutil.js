"use strict"

class ArrayUtil {
  constructor() {};
};

ArrayUtil.prototype.clone = function(obj) {
  if(null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
  };
  return copy;
};

ArrayUtil.prototype.contains = function(array, contains) {
  return array.indexOf(contains) > -1;
};

module.exports = ArrayUtil;
