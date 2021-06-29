const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /login -- View login page
  router.get("/orders", (req, res) => {
    db.query(
      `SELECT *
    FROM items
    JOIN item_type ON items.type_id = item_type.id ;`
    )
      .then((result) => console.log(result.rows[0]))
      .catch((err) => console.log(err));
    return res.render("orders");
  });

  // POST /login -- Checks if user exists in database
  router.post("/orders", (req, res) => {
    // const email = req.body.email;
    // const password = req.body.password;
    // db.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`, [
    //   email,
    //   password,
    // ])
    //   .then((result) => {
    //     //console.log(result.rows[0])
    //     res.cookie("user", result.rows[0]);
    //     return res.redirect("/");
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
  });

  return router;
};
