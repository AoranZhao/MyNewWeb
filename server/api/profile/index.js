'use strict';

var express = require('express');
var controller = require('./profile.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/auth/:id', auth.isAuthenticated(), controller.showByAuthId);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

var uploadOptions = { autoFile: true, uploadDir: 'client/assets/uploads/' }
var multipart = require('connect-multiparty');
router.post('/:id/upload', multipart(uploadOptions), controller.upload);

module.exports = router;
