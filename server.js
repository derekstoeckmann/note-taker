// Node modules
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
// NPM modules
const express = require('express');
const uuid = require('uuid/v4');
// Server
const app = express();
const PORT = process.env.PORT || 8080;
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/notes', async (req, res) => {
  const db = JSON.parse(await readFileAsync(__dirname + '/db/db.json', 'utf8'));

  res.json(db);
});

app.post('/api/notes', async (req, res) => {
  const db = JSON.parse(await readFileAsync(__dirname + '/db/db.json', 'utf8'));
  const note = { ...req.body, id: uuid() };

  db.push(note);
  fs.writeFile(__dirname + '/db/db.json', JSON.stringify(db), err => {
    if (err) throw err;
    res.json(note);
  });
});

app.delete('/api/notes/:id', async (req, res) => {
  const db = JSON.parse(await readFileAsync(__dirname + '/db/db.json', 'utf8'));
  const id = req.params.id;
  const newDb = db.filter(note => {
    return note.id !== id;
  });

  fs.writeFile(__dirname + '/db/db.json', JSON.stringify(newDb), err => {
    if (err) console.log(err);
    res.json({ ok: true })
  });
});

app.get('*', (req, res) => {
  res.redirect('/');
});

// Server listening
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
})