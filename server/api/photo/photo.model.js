'use strict';

import mongoose from 'mongoose';

var CommentSchema = new mongoose.Schema({
  comment: {
  	type: String,
  	default: ''
  },
  created_date: {
  	type: Date,
  	default: Date.now
  }
})

var PhotoSchema = new mongoose.Schema({
  title: {
  	type: String,
  	default: ''
  },
  description: {
  	type: String,
  	default: ''
  },
  imgUrl: {
  	type: String,
  	default: ''
  },
  authId: {
    type: mongoose.Schema.Types.ObjectId
  },
  comments: {
  	type: [CommentSchema],
  	defualt: ''
  },
  created_date: {
  	type: Date,
  	default: Date.now
  }
});

export default mongoose.model('Photo', PhotoSchema);
