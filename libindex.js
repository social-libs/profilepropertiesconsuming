function createLib (execlib, jobondestroyablelib) {
  'use strict';

  var lib = execlib.lib,
    ret = {};

  require('./environment')(lib, jobondestroyablelib, ret);

  return ret;
}

module.exports = createLib;
