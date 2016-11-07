/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/profiles              ->  index
 * POST    /api/profiles              ->  create
 * GET     /api/profiles/:id          ->  show
 * PUT     /api/profiles/:id          ->  upsert
 * PATCH   /api/profiles/:id          ->  patch
 * DELETE  /api/profiles/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Profile from './profile.model';
import path from 'path';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Upload 
function saveFile(res, file) {
  return function(entity) {
    var newPath = '/assets/uploads/' + path.basename(file.path);
    entity.portrait = newPath;
    return entity.save();
  }
}


export function upload(req, res) {
  if (!req.files.file) {
    return handleError(res)('File not provided');
  };

  return Profile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveFile(res, req.files.file))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Profiles
export function index(req, res) {
  return Profile.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Profile from the DB
export function show(req, res) {
  return Profile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Profile in the DB
export function create(req, res) {
  return Profile.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Profile in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Profile.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Profile in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Profile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Profile from the DB
export function destroy(req, res) {
  return Profile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function showByAuthId(req, res) {
  return Profile.find({authId: req.params.id})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
