const twilio = require("twilio");
const express = require('express');
const router = express.Router();
const formatArrayObject = require('../public/helper/Format_ArrayObject')

module.exports = (db, accountSid, authToken) => {
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
          GROUP BY orders.id,item_name,user_id;`)
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

  // router.post("/accepted", (req, res) => {
  //   let id = req.body.orderid;
  //   db.query(`update orders set accepted_at = current_timestamp where id = $1`, [id])
  //     .then((result) => {
  //       res.redirect("/orders");
  //     });
  // });

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
      id = $2 RETURNING *;`, [new Date().toISOString().slice(0, 19).replace("T", " "), req.body.orderId]).then((updateResult) => {

        //Query for getting user details for sending a sms.
        db.query(`SELECT * FROM users
        JOIN orders ON user_id=users.id
        WHERE orders.id=$1;`, [req.body.orderId]).then((resultUserOrder) => {
          const twilioClient = new twilio(accountSid, authToken);

          twilioClient.messages
            .create({
              body: `Your food is being prepared stay tuned!`,
              to: `${resultUserOrder.rows[0].phone_number}`, // Text this number
              from: "+17052425790", // From a valid Twilio number
            })
            .then((message) => message.sid);
        });


        db.query(`SELECT orders.id,created_at,completed_at,accepted_at, user_id, (items.name) as item_name
          FROM orders
          JOIN users on users.id=user_id
          JOIN order_items on order_id = orders.id
          JOIN items on items.id = order_items.item_id
          WHERE completed_at IS NULL
          GROUP BY orders.id,item_name,user_id;`)
          .then((resultAllOrders) => {

            //formatting the Array of objects
            const data = formatArrayObject(resultAllOrders.rows);
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
};
