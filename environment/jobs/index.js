function createEnvironmentJobs (lib, jobondestroyablelib) {
  'use strict';

  var ret = {};

  require('./onenvironmentcreator')(lib, jobondestroyablelib, ret);
  require('./onestablishedenvironmentcreator')(lib, ret);
  require('./gettercreator')(lib, ret);
  require('./updatercreator')(lib, ret);

  return ret;
}

module.exports = createEnvironmentJobs;

