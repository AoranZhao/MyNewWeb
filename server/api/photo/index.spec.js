'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var photoCtrlStub = {
  index: 'photoCtrl.index',
  show: 'photoCtrl.show',
  create: 'photoCtrl.create',
  upsert: 'photoCtrl.upsert',
  patch: 'photoCtrl.patch',
  destroy: 'photoCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var photoIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './photo.controller': photoCtrlStub
});

describe('Photo API Router:', function() {
  it('should return an express router instance', function() {
    expect(photoIndex).to.equal(routerStub);
  });

  describe('GET /api/photos', function() {
    it('should route to photo.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'photoCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/photos/:id', function() {
    it('should route to photo.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'photoCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/photos', function() {
    it('should route to photo.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'photoCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/photos/:id', function() {
    it('should route to photo.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'photoCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/photos/:id', function() {
    it('should route to photo.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'photoCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/photos/:id', function() {
    it('should route to photo.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'photoCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
