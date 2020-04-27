
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let GraveModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const GraveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,

  },
  level: {
    type: Number,
    min: 1,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});
GraveSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level
});

GraveSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return GraveModel.find(search).select('name age').lean().exec(callback);
};

GraveModel = mongoose.model('Grave', GraveSchema);

module.exports.GraveModel = GraveModel;
module.exports.GraveSchema = GraveSchema;
