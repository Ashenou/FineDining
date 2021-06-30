// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
// const sass       = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
const fs = require("fs");
const sass = require("sass");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/styles", sass({
//   src: __dirname + "/styles",
//   dest: __dirname + "/public/styles",
//   debug: true,
//   outputStyle: 'expanded'
// }));

app.get("/styles/:css_file", (req, res, next) => {
  const cssFilename = req.params.css_file.replace(/\.[^/.]+$/, "");
  const rendered = sass.renderSync({
    file: `${__dirname}/styles/${cssFilename}.scss`,
    outFile: `${__dirname}/public/styles/${cssFilename}.css`,
    debug: true,
    outputStyle: "expanded",
  });
  fs.writeFileSync(
    `${__dirname}/public/styles/${cssFilename}.css`,
    rendered.css.toString()
  );
  next();
});

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const apiRoutes = require("./routes/apiRoutes");
// app.use("/", apiRoutes);

// /restaurant/endpoints
const restaurantRoutes = require("./routes/restaurantRoutes");
// app.use('/', homePageRoutes);

// /users/endpoints
const userRoutes = require("./routes/userRoutes");
app.use('/users', userRoutes(db));

// ///users/:id/items/endpoints **CORRECT THIS
//const itemsRoutes = require("./routes/itemsRoutes");
//app.use('/items', itemsRoutes(db));

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
