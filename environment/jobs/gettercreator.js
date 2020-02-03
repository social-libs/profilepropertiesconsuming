function createUserProfileGetterJob (lib, mylib) {
  'use strict';

  var JobOnEnvironment = mylib.JobOnEnvironment;

  function UserProfileGetterJob (env, storagename, username, profilepropname, defer) {
    JobOnEnvironment.call(this, env, defer);
    this.storagename = storagename;
    this.username = username;
    this.profilepropname = profilepropname;
  }
  lib.inherit(UserProfileGetterJob, JobOnEnvironment);
  UserProfileGetterJob.prototype.destroy = function () {
    this.profilepropname = null;
    this.username = null;
    this.storagename = null;
    JobOnEnvironment.prototype.destroy.call(this);
  };
  UserProfileGetterJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.destroyable.getFromStorageSafe(this.storagename, this.username, null).then(
      this.onGet.bind(this),
      this.reject.bind(this)
    );
    return ok.val;
  };
  UserProfileGetterJob.prototype.onGet = function (profhash) {
    if (!this.okToProceed()) {
      return;
    }
    if (lib.isVal(profhash)) {
      this.resolve(lib.isVal(this.profilepropname) ? profhash[this.profilepropname] : profhash);
      return;
    }
    this.resolve(null);
  };

  mylib.UserProfileGetterJob = UserProfileGetterJob;
}

module.exports = createUserProfileGetterJob;
