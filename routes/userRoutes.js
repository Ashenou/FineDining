const express = require('express');
const router = express.Router();
var cookie = require('cookie')

// /user/login
module.exports = (db) => {
  // GET /login -- View login page
  router.get("/", (req, res) => {
    templateVars = { user: req.cookies.user }
    res.render("login", templateVars);
  });

  // POST /login -- Checks if user exists in database
  router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`, [
        email,
        password,
      ])
      .then((result) => {
        //console.log(result.rows[0])
        res.cookie("user", result.rows[0]);
        return res.redirect("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
  return router;
}
