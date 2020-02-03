function createUserProfileUpdaterJob (lib, mylib) {
  'use strict';

  var JobOnEnvironment = mylib.JobOnEnvironment,
    qlib = lib.qlib;

  function UserProfileUpdaterJob (env, storagename, username, profilehash, defer) {
    JobOnEnvironment.call(this, env, defer);
    this.storagename = storagename;
    this.username = username;
    this.profilehash = profilehash;
  }
  lib.inherit(UserProfileUpdaterJob, JobOnEnvironment);
  UserProfileUpdaterJob.prototype.destroy = function () {
    this.profilehash = null;
    this.username = null;
    this.storagename = null;
    JobOnEnvironment.prototype.destroy.call(this);
  };
  UserProfileUpdaterJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    var ret = this.destroyable.getFromStorageSafe(this.storagename, this.username, null).then(
      this.onOriginal.bind(this),
      this.reject.bind(this)
    );
    return ok.val;
  };
  UserProfileUpdaterJob.prototype.onOriginal = function (profhash) {
    if (!this.okToProceed()) {
      return;
    }
    qlib.promise2defer(this.destroyable.putToStorage(this.storagename, this.username, lib.extend({}, profhash, this.profilehash)), this);
  };

  mylib.UserProfileUpdaterJob = UserProfileUpdaterJob;
}

module.exports = createUserProfileUpdaterJob;
