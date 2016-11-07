'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './photo.routes';
import mongoose from 'mongoose';

export class PhotoComponent {

  Photos = {};
  currentPhoto = {};
  newPhoto = {
    title: '',
    description: '',
    imgUrl: '',
    comments: []
  };

  /*@ngInject*/
  constructor(Auth, $state, $http, Upload, $stateParams, $rootScope) {
    'ngInject';
    this.message = 'Hello';
    this.$state = $state;
    this.$http = $http;
    this.Auth = Auth;
    this.Upload = Upload;
    this.$stateParams = $stateParams;
    this.$rootScope = $rootScope;
  }

  showAddPage() {
    this.$state.go("photoAdd");
  }

  closeAddPage() {
    this.$state.go("photo");
    this.newPhoto = {
      title: '',
      description: '',
      imgUrl: '',
      comments: []
    }
  }

  savePhoto(form) {
    this.Auth.getCurrentUser().then(user => {
      this.newPhoto.authId = user._id;
      if (this.photo) {
        this.photo.upload = this.Upload.upload({
          url: 'api/photos/',
          file: this.photo,
          data: this.newPhoto
        });

        this.photo.upload.then(function(response) {
          this.$state.go("photo");
        }, function(response) {
          console.log("Two:", response);
        }, function(evt) {
          console.log("Three:", evt);
        })
      }
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  getAllPhoto() {
    this.$http.get('/api/photos').then(photos => {
      this.Photos = photos.data;
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  getAllPhotoByUser() {
    this.Auth.getCurrentUser().then(user => {
      this.$http.get('/api/photos/auth/' + user._id).then(photos => {
        this.Photos = photos.data;
      })
      .catch(err => {
        console.log(err.message);
      })
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  backTo(state) {
    this.$state.go(state);
  }

  // getPhoto(id) {
  //   this.$http.get('/api/photos/' + id).then(photo => {
  //     this.currentPhoto = photo.data;
  //   })
  //   .catch(err => {
  //     console.log(err.message);
  //   })
  // }

  showPhotoDetail(id) {
    this.$http.get('/api/photos/' + id).then(photo => {
      this.$state.go("photoView");
      this.$rootScope.currentPhoto = photo.data;
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  initPhotoDetail() {
    this.currentPhoto = this.$rootScope.currentPhoto;
  }
}

export default angular.module('myWebApp.photo', [uiRouter])
  .config(routes)
  .component('photoList', {
    template: require('./templates/photo-list.html'),
    controller: PhotoComponent,
    controllerAs: 'phc'
  })
  .component('photoAdd', {
    template: require('./templates/add-photo.html'),
    controller: PhotoComponent,
    controllerAs: 'phc'
  })
  .component('photoView', {
    template: require('./templates/photo-view.html'),
    controller: PhotoComponent,
    controllerAs: 'phc'
  })
  .component('photoManage', {
    template: require('./templates/photo-manage.html'),
    controller: PhotoComponent,
    controllerAs: 'phc'
  })
  .name;
