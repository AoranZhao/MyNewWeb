/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/photos              ->  index
 * POST    /api/photos              ->  create
 * GET     /api/photos/:id          ->  show
 * PUT     /api/photos/:id          ->  upsert
 * PATCH   /api/photos/:id          ->  patch
 * DELETE  /api/photos/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Photo from './photo.model';
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
// function saveFile(res, file) {
//   return function(entity) {
//     var newPath = '/assets/uploads/' + path.basename(file.path);
//     entity.imgUrl = newPath;
//     return entity.save();
//   }
// }

// export function upload(req, res) {
//   if (!req.files.file) {
//     return handleError(res)('File not provided');
//   };

//   return Profile.findById(req.params.id).exec()
//     .then(handleEntityNotFound(res))
//     .then(saveFile(res, req.files.file))
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// Gets a list of Photos
export function index(req, res) {
  return Photo.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Photo from the DB
export function show(req, res) {
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Photo in the DB
export function create(req, res) {
  if (!req.files.file) {
    return handleError(res)('File not provided');
  }
  req.body.imgUrl = '/assets/uploads/' + path.basename(req.files.file.path);
  return Photo.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Photo in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Photo.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Photo in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Photo from the DB
export function destroy(req, res) {
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function showByAuthId(req, res) {
  return Photo.find({authId: req.params.authId}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
