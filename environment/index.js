function createEnvironment (lib, jobondestroyablelib, mylib) {
  'use strict';


  mylib.environment = mylib.environment || {};
  mylib.environment.jobs = require('./jobs')(lib, jobondestroyablelib);
  mylib.environment.mixin = require('./mixincreator')(lib, mylib.environment.jobs);
}

module.exports = createEnvironment;
