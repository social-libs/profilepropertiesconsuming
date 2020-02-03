(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var lR = ALLEX.execSuite.libRegistry;

lR.register('social_profilepropertiesconsuminglib', require('./libindex')(
  ALLEX,
  lR.get('allex_jobondestroyablelib')
));

},{"./libindex":9}],2:[function(require,module,exports){
function createEnvironment (lib, jobondestroyablelib, mylib) {
  'use strict';


  mylib.environment = mylib.environment || {};
  mylib.environment.jobs = require('./jobs')(lib, jobondestroyablelib);
  mylib.environment.mixin = require('./mixincreator')(lib, mylib.environment.jobs);
}

module.exports = createEnvironment;

},{"./jobs":4,"./mixincreator":8}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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


},{"./gettercreator":3,"./onenvironmentcreator":5,"./onestablishedenvironmentcreator":6,"./updatercreator":7}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
function createProfilePropertiesMixin (lib, jobs) {
  'use strict';

  var q = lib.q,
    qlib = lib.qlib,
    _storagename = 'socialuserprofiles';

  function SocialProfilePropertiesMixin (options) {
    this.createStorage(_storagename);
  };
  SocialProfilePropertiesMixin.prototype.destroy = function () {
  };
  SocialProfilePropertiesMixin.prototype.getUserProfile = function (username, profilepropname) {
    return this.jobs.run('.', new jobs.UserProfileGetterJob(this, _storagename, username, profilepropname));
  };
  SocialProfilePropertiesMixin.prototype.updateUserProfile = function (username, profilehash) {
    return this.jobs.run('.', new jobs.UserProfileUpdaterJob(this, _storagename, username, profilehash));
  };
  SocialProfilePropertiesMixin.prototype.onLastSocialProfileUpdate = function (upd) {
    if (!(lib.isArray(upd) && upd.length===2)) {
      return;
    }
    console.log('social profile updated', upd[0], upd[1]);
    this.updateUserProfile(upd[0], upd[1]);
  };
  SocialProfilePropertiesMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, SocialProfilePropertiesMixin
      ,'getUserProfile'
      ,'updateUserProfile'
      ,'onLastSocialProfileUpdate'
    );
  };

  return SocialProfilePropertiesMixin;
}

module.exports = createProfilePropertiesMixin;

},{}],9:[function(require,module,exports){
function createLib (execlib, jobondestroyablelib) {
  'use strict';

  var lib = execlib.lib,
    ret = {};

  require('./environment')(lib, jobondestroyablelib, ret);

  return ret;
}

module.exports = createLib;

},{"./environment":2}]},{},[1]);
