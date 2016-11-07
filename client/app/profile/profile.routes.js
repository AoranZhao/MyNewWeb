'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('profile', {
      url: '/profile',
      template: '<profile-list></profile-list>'
    })
    .state('profileView', {
    	url: '/profile-view',
    	template: '<profile-view></profile-view>'
    });
}
