'use strict';

import mongoose from 'mongoose';

var SkillSchema = new mongoose.Schema({
	skill: String,
	score: {
		type: Number,
		default: 0
	},
  created_date: {
    type: Date,
    default: Date.now
  }
});

var ExperienceSchema = new mongoose.Schema({
	title: String,
	company: String,
	description: String,
	start: Date,
	end: Date,
  created_date: {
    type: Date,
    default: Date.now
  }
});

var CoordinateSchema = new mongoose.Schema({
	address: String,
	city: String,
	state: String,
	zip: String,
	country: String
});

var EducationSchema = new mongoose.Schema({
  title: String,
  school: String,
  description: String,
  start: Date,
  end: Date,
  created_date: {
    type: Date,
    default: Date.now
  }
});

var ProfileSchema = new mongoose.Schema({
  lname: String,
  fname: String,
  description: String,
  phone: String,
  portrait: String,
  skills: {
  	type: [SkillSchema],
  	default: []
  },
  experiences: {
  	type: [ExperienceSchema],
  	default: []
  },
  coordinate: CoordinateSchema,
  email: String,
  authId: {
  	type: mongoose.Schema.Types.ObjectId
  },
  educations: {
    type: [EducationSchema],
    default: []
  },
  created_date: {
  	type: Date,
  	default: Date.now
  }
});

ProfileSchema.virtual('fullname').get(function() {
	return this.fname + ' ' + this.lname;
})

ProfileSchema.methods = {

};

export default mongoose.model('Profile', ProfileSchema);
