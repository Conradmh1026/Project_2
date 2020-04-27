const models = require('../models');

const { Grave } = models;

const makerPage = (req, res) => {
  Grave.GraveModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), Graves: docs });
  });
  // res.render('app');
};

const makeGrave = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const GraveData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };
  const newGrave = new Grave.GraveModel(GraveData);

  const GravePromise = newGrave.save();

  GravePromise.then(() => res.json({ redirect: '/maker' }));

  GravePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Form aready exists.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });

  return GravePromise;
};

const getGraves = (request, response) => {
  const req = request;
  const res = response;

  return Grave.GraveModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ Graves: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getGraves = getGraves;
module.exports.make = makeGrave;
