const express = require('express');
require('dotenv').config();
const app = express();
require('./database/config');
const Cat = require('./database');
const port = process.env.PORT || 3000;

app.use(express.json());

// 1 GET - Retrieve all of the data from your table
app.get('/cats', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status('200').json(cats);
  } catch (err) {
    console.error(`error when loading from DB: ${err}`);
    res.sendStatus('500');
  }
});

// 2 GET - Retrieve specific fields (i.e. id, names, dates, etc.)
app.get('/cats/fields/:field', async (req, res) => {
  try {
    const field = req.params.field;
    const cats = await Cat.find().select(`${field} -_id`);
    const values = cats.map((cat) => cat[field]);
    res.status('200').json(values);
  } catch (err) {
    console.error(`error when loading from DB: ${err}`);
    res.sendStatus('500');
  }
});

// 3 GET - Retrieve a data set with the following filters (use one route per filter type):
// A filter for data that contains... (e.g. name containing the string 'wcs')
// A filter for data that starts with... (e.g. name beginning with 'campus')
// A filter for data that is greater than... (e.g. date greater than 18/10/2010)
app.get('/cats/filtered', async (req, res) => {
  const nameContains = req.query.nameContains;
  const nameStartsWith = req.query.nameStartsWith;
  const weightGreaterThan = req.query.weightGreaterThan;

  try {
    let query = Cat.find();
    if (weightGreaterThan) {
      query = query.where('weight').gt(weightGreaterThan);
    }
    if (nameContains) {
      query = query.where('name', new RegExp(nameContains, 'i'));
    }
    if (nameStartsWith) {
      query = query.where('name', new RegExp(`^${nameStartsWith}`, 'i'));
    }
    const cats = await query.exec();
    res.status('200').json(cats);
  } catch (err) {
    console.error(`error when loading from DB: ${err}`);
    res.sendStatus('500');
  }
});

// 4 GET - Ordered data recovery (i.e. ascending, descending) - The order should be passed as a route parameter
app.get('/cats/ordered', async (req, res) => {
  const orderedBy = req.query.by;
  const direction = req.query.direction;
  try {
    const sort = {};
    sort[orderedBy] = direction;
    const cats = await Cat.find().sort(sort);
    res.status('200').json(cats);
  } catch (err) {
    console.error(`error when loading from DB: ${err}`);
    res.sendStatus('500');
  }
});

// 5 POST - Insertion of a new entity
app.post('/cats', async (req, res) => {
  const cat = new Cat(req.body);
  try {
    const savedCat = await cat.save();
    res.status('201').json(savedCat);
  } catch (err) {
    console.error(`error when saving in DB: ${err}`);
    res.sendStatus('500');
  }
});

// 6 PUT - Modification of an entity
app.put('/cats/:id', async (req, res) => {
  const catId = req.params.id;
  const cat = req.body;
  try {
    const updatedCat = await Cat.findByIdAndUpdate(catId, cat, { new: true });
    if (updatedCat) {
      res.status('200').json(updatedCat);
    } else {
      res.sendStatus('404');
    }
  } catch (err) {
    console.error(`error when updating in DB: ${err}`);
    res.sendStatus('500');
  }
});

// 7 PUT - Toggle a Boolean value
app.put('/cats/:id/toggleHungry', async (req, res) => {
  const catId = req.params.id;
  try {
    const cat = await Cat.findById(catId);
    if (cat) {
      cat.isHungry = !cat.isHungry;
      await cat.save();
      res.status('200').json(cat);
    } else {
      res.sendStatus('404');
    }
  } catch (err) {
    console.error(`error when updating in DB: ${err}`);
    res.sendStatus('500');
  }
});

// 9 DELETE - Delete all entities where boolean value is false
app.delete('/cats/fed', async (req, res) => {
  try {
    await Cat.deleteMany({ isHungry: false });
    res.sendStatus('204');
  } catch (err) {
    console.error(`error when deleting from DB: ${err}`);
    res.sendStatus('500');
  }
});

// 8 DELETE - Delete an entity
app.delete('/cats/:id', async (req, res) => {
  const catId = req.params.id;
  try {
    const deletedCat = await Cat.findByIdAndDelete(catId);
    if (deletedCat) {
      res.status('200').json(deletedCat);
    } else {
      res.sendStatus('404');
    }
  } catch (err) {
    console.error(`error when deleting from DB: ${err}`);
    res.sendStatus('500');
  }
});

app.listen(port, (error) => {
  if (error) {
    console.error(`Error: ${error}`);
  } else {
    console.log(`Server is launching on port ${port}`);
  }
});
