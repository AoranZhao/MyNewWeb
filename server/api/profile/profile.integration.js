'use strict';

var app = require('../..');
import request from 'supertest';

var newProfile;

describe('Profile API:', function() {
  describe('GET /api/profiles', function() {
    var profiles;

    beforeEach(function(done) {
      request(app)
        .get('/api/profiles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          profiles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(profiles).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/profiles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/profiles')
        .send({
          name: 'New Profile',
          info: 'This is the brand new profile!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProfile = res.body;
          done();
        });
    });

    it('should respond with the newly created profile', function() {
      expect(newProfile.name).to.equal('New Profile');
      expect(newProfile.info).to.equal('This is the brand new profile!!!');
    });
  });

  describe('GET /api/profiles/:id', function() {
    var profile;

    beforeEach(function(done) {
      request(app)
        .get(`/api/profiles/${newProfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          profile = res.body;
          done();
        });
    });

    afterEach(function() {
      profile = {};
    });

    it('should respond with the requested profile', function() {
      expect(profile.name).to.equal('New Profile');
      expect(profile.info).to.equal('This is the brand new profile!!!');
    });
  });

  describe('PUT /api/profiles/:id', function() {
    var updatedProfile;

    beforeEach(function(done) {
      request(app)
        .put(`/api/profiles/${newProfile._id}`)
        .send({
          name: 'Updated Profile',
          info: 'This is the updated profile!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProfile = {};
    });

    it('should respond with the original profile', function() {
      expect(updatedProfile.name).to.equal('New Profile');
      expect(updatedProfile.info).to.equal('This is the brand new profile!!!');
    });

    it('should respond with the updated profile on a subsequent GET', function(done) {
      request(app)
        .get(`/api/profiles/${newProfile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let profile = res.body;

          expect(profile.name).to.equal('Updated Profile');
          expect(profile.info).to.equal('This is the updated profile!!!');

          done();
        });
    });
  });

  describe('PATCH /api/profiles/:id', function() {
    var patchedProfile;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/profiles/${newProfile._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Profile' },
          { op: 'replace', path: '/info', value: 'This is the patched profile!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProfile = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProfile = {};
    });

    it('should respond with the patched profile', function() {
      expect(patchedProfile.name).to.equal('Patched Profile');
      expect(patchedProfile.info).to.equal('This is the patched profile!!!');
    });
  });

  describe('DELETE /api/profiles/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/profiles/${newProfile._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when profile does not exist', function(done) {
      request(app)
        .delete(`/api/profiles/${newProfile._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
