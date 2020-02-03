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
