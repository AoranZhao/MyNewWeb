'use strict';

var express = require('express');
var controller = require('./photo.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

var uploadOptions = { autoFile: true, uploadDir: 'client/assets/uploads/' }
var multipart = require('connect-multiparty');

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/auth/:authId', auth.isAuthenticated(), controller.showByAuthId);
router.post('/', auth.isAuthenticated(), multipart(uploadOptions), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);


// router.post('/:id/upload', multipart(uploadOptions), controller.upload);

module.exports = router;
