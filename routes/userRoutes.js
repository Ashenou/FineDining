const express = require('express');
const router = express.Router();
var cookie = require('cookie')
const formatArrayObject = require('../helper')

// /user/login
module.exports = (db) => {
  // GET / -- View login page
  router.get("/", (req, res) => {
      res.render("login");
    })
    // POST / -- Checks if user exists in database
  router.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`, [email, password])
      .then((result) => {
        //Check if account is user or restaurant account
        res.cookie('user', result.rows[0])
        if (result.rows[0].restaurant_account === true) {

          db.query(`SELECT orders.id,created_at,completed_at, user_id,order_status, (items.name) as item_name
          FROM orders
          JOIN users on users.id=user_id
          JOIN order_items on order_id = orders.id
          JOIN items on items.id = order_items.item_id
          WHERE completed_at IS NULL
          GROUP BY orders.id,item_name,user_id;`)
            .then((result) => {

              //formatting the object
              const data = formatArrayObject(result.rows);

              const templateVars = {
                data
              }
              res.render("restaurant_orders", templateVars);
            })
        } else {
          return res.redirect('/');
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
  });
  return router;
}
