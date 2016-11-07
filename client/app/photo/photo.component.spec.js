'use strict';

describe('Component: PhotoComponent', function() {
  // load the controller's module
  beforeEach(module('myWebApp.photo'));

  var PhotoComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PhotoComponent = $componentController('photo', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
