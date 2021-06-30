const express = require('express');
const router = express.Router();
var cookie = require('cookie');

const { formatArrayObject, orderTimer } = require('../public/helper/helper')

module.exports = (db) => {
  // GET :/orders Display's' orders for the restaurant portal
  router.get("/", (req, res) => {
    let user = req.cookies.user;
    //Check if account is user's or restaurant's account
    if (user.restaurant_account) {

      db.query(`SELECT orders.id,created_at,completed_at,accepted_at, user_id, (items.name) as item_name
          FROM orders
          JOIN users on users.id=user_id
          JOIN order_items on order_id = orders.id
          JOIN items on items.id = order_items.item_id
          WHERE completed_at IS NULL
          GROUP BY orders.id,item_name,user_id;`)
        .then((result) => {

          //formatting the Array of objects
          const data = formatArrayObject(result.rows);

          const templateVars = {
            data
          }
          res.render("restaurant_orders", templateVars);
        })
        .catch((err) => {
          console.log(err.message);
        })
        //this is to show the timer for the current order in process and order information.
    } else {
      //Orders route for user display
      return res.redirect('/');
    }
  });

  // POST :/orders Display's' orders for the restaurant after orders are accepted/completed from restaurant
  router.post("/", (req, res) => {
    let user = req.cookies.user;
    //Check if account is user's or restaurant's account
    if (user.restaurant_account) {
      //This query would update the order as accepted and create a timestamp for it.
      db.query(`UPDATE orders
      SET
      accepted_at = $1
      WHERE
      id = $2;`, [new Date().toISOString().slice(0, 19).replace("T", " "), req.body.orderId]).then((result) => {

        db.query(`SELECT orders.id,created_at,completed_at,accepted_at, user_id, (items.name) as item_name
          FROM orders
          JOIN users on users.id=user_id
          JOIN order_items on order_id = orders.id
          JOIN items on items.id = order_items.item_id
          WHERE completed_at IS NULL
          GROUP BY orders.id,item_name,user_id;`)
          .then((result) => {

            //formatting the Array of objects
            const data = formatArrayObject(result.rows);
            const templateVars = {
              data
            }
            res.render("restaurant_orders", templateVars);
          })
          .catch((err) => {
            console.log(err.message);
          })
      });

      //this is to show the timer for the current order in process and order information.
    } else {
      //Orders route for user display
      return res.redirect('/');
    }

  });



  return router;
}
