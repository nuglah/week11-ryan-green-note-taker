const express = require("express");
const path = require("path");
const notesDB = require("./db/db.json") || [];
// require for uniqid which generates a unique id.
var uniqid = require("uniqid");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
// GET route for the notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// receives the data from notesDB which contains the note data.
app.get("/api/notes", (req, res) => res.json(notesDB));
// POST that sets the id to a unique generated id and pushes it to db.json and writes it to the file so it stays in the db.json
app.post("/api/notes", (req, res) => {
  const { body } = req;
  body.id = uniqid();
  notesDB.push(body);
  res.json(notesDB);
  writeToFile("./db/db.json", notesDB);
});
// the fs write file function
const writeToFile = (destination, content) => {
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
