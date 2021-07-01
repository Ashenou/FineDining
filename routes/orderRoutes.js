const express = require("express");
const router = express.Router();
//var cookie = require('cookie')
const formatArrayObject = require("../public/helper/helper");

module.exports = (db) => {
  // GET :/orders Display's' orders for the restaurant portal
  router.get("/", (req, res) => {
    let user = req.cookies.user;
    //Check if account is user's or restaurant's account
    //let data = {};



    if (user) {
    if (user.restaurant_account) {
      db.query(`SELECT orders.id ,created_at,completed_at,accepted_at, user_id, (items.name) as item_name
          FROM orders
          JOIN users on users.id=user_id
          JOIN order_items on order_id = orders.id
          JOIN items on items.id = order_items.item_id
          WHERE completed_at IS NULL
          GROUP BY orders.id,item_name,user_id;`
      )
        .then((result) => {
          //formatting the Array of objects
          const data = formatArrayObject(result.rows);

          const templateVars = {
            data,
            user
          }

          res.render("restaurant_orders", templateVars);
        })
        .catch((err) => {
          console.log(err.message);
        });
      //this is to show the timer for the current order in process and order information.
    } else {
      //Orders route for user display

      db.query(`SELECT orders.id, accepted_at, completed_at, user_id, (items.name) as item_name
      FROM orders
      JOIN users on users.id = user_id
      JOIN order_items on order_id = orders.id
      JOIN items on items.id = order_items.item_id
      WHERE completed_at IS NULL AND user_id = $1
      GROUP BY orders.id,item_name,user_id;`, [`${user.id}`])
      .then((result) => {

        const data = formatArrayObject(result.rows);

        const templateVars = {
          data,
          user
        }
        console.log(result.rows)
        res.render('user_orders', templateVars);
      })
      .catch((err) => {
        console.log(err.message);
      })
    }
  } else {
      res.redirect('/login')
    }
  });

  router.post("/accepted",(req,res)=>{
    let id = req.body.orderid;
    db.query(`update orders set accepted_at = current_timestamp where id = $1`,[id])
    .then((result)=>{
      res.redirect("/orders");
    });
  });

  return router;
};
