'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('photo', {
      url: '/photo',
      template: '<photo-list></photo-list>'
    })
    .state('photoAdd', {
    	url: '/photo-add',
    	template: '<photo-add></photo-add>'
    })
    .state('photoView', {
      url: '/photo-view',
      template: '<photo-view></photo-view>'
    });
}
