const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /login -- View login page
  router.get("/", (req, res) => {
    let templateVars = {};

    //// implement login login with req.id and req.restaurant_check

    db.query(
      `SELECT items.* , item_type.name as item_type_name
    FROM items
    JOIN item_type ON items.type_id = item_type.id ;`
    )
      .then((result) => {
        //console.log(result.rows);
        templateVars["items"] = result.rows;
        console.log("line 18", templateVars["items"]);
        return res.render("items", templateVars);
      })
      .catch((err) => console.log(err));
  });

  // POST /login -- Checks if user exists in database
  router.post("/items", (req, res) => {
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
