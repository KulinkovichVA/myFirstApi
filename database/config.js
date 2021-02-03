const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(`connection error: ${error}`));
db.once('open', () => {
  console.log(`Connected to DB ${dbUrl}`);
});

module.exports = db;
