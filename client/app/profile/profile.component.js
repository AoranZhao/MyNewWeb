'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './profile.routes';

export class ProfileComponent {
  profile = {};
  newEducation = {
    title: '',
    school: '',
    description: '',
    start: new Date(),
    end: new Date()
  };
  newExperience = {
    title: '',
    company: '',
    description: '',
    start: new Date(),
    end: new Date()
  }
  newSkill = {
    skill: '',
    score: 0
  }
  popupNewEduStart = { opened: false };
  popupNewEduEnd = { opened: false };
  openEduStartDatePickers = [];
  openEduEndDatePickers = [];
  popupNewExpStart = { opened: false };
  popupNewExpEnd = { opened: false };
  openExpStartDatePickers = [];
  openExpEndDatePickers = [];
  changePortrait = false;
  addEducation = false;
  addExperience = false;
  addSkill = false;

  /*@ngInject*/
  constructor(Auth, $http, $state, Upload, $timeout, $window) {
    'ngInject';
    this.$http = $http;
    this.Auth = Auth;
    this.$state = $state;
    this.Upload = Upload;
    this.$timeout = $timeout;
    this.$window = $window;
    this.getProfileAlpha();
  }

  // createProfile(id) {
  //   this.$http.post('/api/profiles/', {authId: id}).then(profile => {
  //     this.$state.go('main');
  //   })
  //   .catch(err => {
  //     console.log(err.message);
  //   })
  // }

  getProfileAlpha() {
    this.$http.get('/api/profiles/').then(profile => {
      this.profile = profile.data[0];
      console.log("profile:", this.profile);
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  getProfile() {
    this.Auth.getCurrentUser().then(user => {
      var id = user._id;
      this.$http.get('/api/profiles/auth/' + id).then(profile => {
        this.profile = profile.data[0];
        console.log("profile:", this.profile);
      })
      .catch(err => {
        console.log(err.messsage);
      })
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  updateProfile() {
    this.$http.put('/api/profiles/' + this.profile._id, this.profile).then(profile => {
      // this.getProfile();
      this.$state.reload();
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  saveProfile(form) {
    if (form.$valid) {
      this.updateProfile();
    }
  }

  showPortraitChanger() {
    this.changePortrait = this.changePortrait ? false : true;
  }

  showEducationAdder() {
    this.addEducation = this.addEducation ? false : true;
  }

  closeEducationAdder() {
    this.showEducationAdder();
    this.newEducation = {
      title: '',
      school: '',
      description: '',
      start: new Date(),
      end: new Date()
    };
  }

  showExperienceAdder() {
    this.addExperience = this.addExperience ? false : true;
  }

  closeExperienceAdder() {
    this.showExperienceAdder();
    this.newExperience = {
      title: '',
      company: '',
      description: '',
      start: new Date(),
      end: new Date()
    }
  }

  showSkillAdder() {
    this.addSkill = this.addSkill ? false : true;
  }

  closeSkillAdder() {
    this.showSkillAdder();
    this.newSkill = {
      skill: '',
      score: 0
    }
  }

  openNewEduStart() {
    this.popupNewEduStart.opened = true;
  }

  openNewEduEnd() {
    this.popupNewEduEnd.opened = true;
  }

  openEduStartTime(event, index) {
    event.preventDefault();
    if (this.openEduStartDatePickers[index] == true) {
      this.openEduStartDatePickers.length = 0;
    } else {
      this.openEduStartDatePickers.length = 0;
      this.openEduStartDatePickers[index] = true;
    }
  }

  openEduEndTime(event, index) {
    event.preventDefault();
    if (this.openEduEndDatePickers[index] == true) {
      this.openEduEndDatePickers.length = 0;
    } else {
      this.openEduEndDatePickers.length = 0;
      this.openEduEndDatePickers[index] = true;
    }
  }

  uploadPortrait(file) {
    file.upload = this.Upload.upload({
      url: '/api/profiles/' + this.profile._id + '/upload',
      file: file
    });
    var $state = this.$state;

    file.upload.then(function(response) {
      $state.reload();
    }, function(response) {
    }, function(evt) {
      console.log("Three:", evt);
    })
  }

  saveEducation(form) {
    if (form.$valid) {
      if (!this.profile.educations) 
        this.profile.educations = [];
      this.profile.educations.push(this.newEducation);
      this.updateProfile();
      this.closeEducationAdder();
    }
  }

  updateEducation() {
    this.updateProfile();
  }

  removeEducation(education) {
    console.log("delete:", education);
    var confirm = this.$window.confirm('delete?');
    if (confirm) {
      this.profile.educations.splice(this.profile.educations.indexOf(education), 1);
      this.updateProfile();
    }
    
  }

  openNewExpStart() {
    this.popupNewExpStart.opened = true;
  }

  openNewExpEnd() {
    this.popupNewExpEnd.opened = true;
  }

  openExpStartTime(event, index) {
    event.preventDefault();
    if (this.openExpStartDatePickers[index] == true) {
      this.openExpStartDatePickers.length = 0;
    } else {
      this.openExpStartDatePickers.length = 0;
      this.openExpStartDatePickers[index] = true;
    }
  }

  openExpEndTime(event, index) {
    event.preventDefault();
    if (this.openExpEndDatePickers[index] == true) {
      this.openExpEndDatePickers.length = 0;
    } else {
      this.openExpEndDatePickers.length = 0;
      this.openExpEndDatePickers[index] = true;
    }
  }

  saveExperience(form) {
    if (form.$valid) {
      if (!this.profile.experiences)
        this.profile.experiences = [];
      this.profile.experiences.push(this.newExperience);
      this.updateProfile();
      this.closeExperienceAdder();
    }
  }

  updateExperience() {
    this.updateProfile();
  }

  removeExperience(experience) {
    var confirm = this.$window.confirm('delete?');
    if (confirm) {
      this.profile.experiences.splice(this.profile.experiences.indexOf(experience), 1);
      this.updateProfile();
    }
  }

  saveSkill(form) {
    if (form.$valid) {
      if (!this.profile.skills)
        this.profile.skills = [];
      this.profile.skills.push(this.newSkill);
      this.updateProfile();
      this.closeSkillAdder();
    }
  }

  updateSkill() {
    this.updateProfile();
  }

  removeSkill(skill) {
    var confirm = this.$window.confirm('delete?');
    if (confirm) {
      this.profile.skills.splice(this.profile.skills.indexOf(skill), 1);
      this.updateSkill();
    }
  }
}

export default angular.module('myWebApp.profile', [uiRouter])
  .config(routes)
  .component('profileList', {
    template: require('./template/profile-list.html'),
    controller: ProfileComponent,
    controllerAs: 'pc'
  })
  .component('profileView', {
    template: require('./template/profile-view.html'),
    controller: ProfileComponent,
    controllerAs: 'pc'
  })
  .directive('formateEduDate', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ctrl) {
        scope.education.start = new Date(scope.education.start);
        scope.education.end = new Date(scope.education.end);
      }
    }
  })
  .directive('formateExpDate', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ctrl) {
        scope.experience.start = new Date(scope.experience.start);
        scope.experience.end = new Date(scope.experience.end);
      }
    }
  })
  .factory('ProfileInit', ProfileComponent.createProfile)
  .name;
