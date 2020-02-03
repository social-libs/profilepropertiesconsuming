function createJobOnEnvironment (lib, mylib) {
  'use strict';

  var JobOnEnvironment = mylib.JobOnEnvironment;

  function JobOnEstablishedEnvironment (env, defer) {
    JobOnEnvironment.call(this, env, defer);
  }
  lib.inherit(JobOnEstablishedEnvironment, JobOnEnvironment);
  JobOnEstablishedEnvironment.prototype._destroyableOk = function () {
    if (!JobOnEnvironment.prototype._destroyableOk.call(this)) {
      return false;
    }
    if (!this.destroyable.state === 'established') {
      console.error(this.destroyable.constructor.name+' is not in "established" state, cannot continue');
      return false;
    }
    return true;
  };

  mylib.JobOnEstablishedEnvironment = JobOnEstablishedEnvironment;
}

module.exports = createJobOnEnvironment;
