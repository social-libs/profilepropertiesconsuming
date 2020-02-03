function createJobOnEnvironment (lib, jobondestroyablelib, mylib) {
  'use strict';

  var JobOnDestroyableBase = jobondestroyablelib.JobOnDestroyableBase;

  function JobOnEnvironment (env, defer) {
    JobOnDestroyableBase.call(this, env, defer);
  }
  lib.inherit(JobOnEnvironment, JobOnDestroyableBase);
  JobOnEnvironment.prototype._destroyableOk = function () {
    if (!this.destroyable) {
      return false;
    }
    if (!this.destroyable.storages) {
      console.error('No storages in '+this.destroyable.constructor.name+', cannot continue');
      return false;
    }
    if (!this.destroyable.dataSources) {
      console.error('No dataSources in '+this.destroyable.constructor.name+', cannot continue');
      return false;
    }
    if (!this.destroyable.commands) {
      console.error('No commands in '+this.destroyable.constructor.name+', cannot continue');
      return false;
    }
    return true;
  };

  mylib.JobOnEnvironment = JobOnEnvironment;
}

module.exports = createJobOnEnvironment;
