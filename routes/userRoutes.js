const twilio = require("twilio");
const express = require("express");
const router = express.Router();

// Twilio api require

module.exports = (db, accountSid, authToken) => {
  // GET /login -- View login page
  router.get("/login", (req, res) => {
    return res.render("login");
  });

  // POST /login -- Checks if user exists in database
  router.post("/login", (req, res) => {
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

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // GET :userid/orders Shows restaurant's menu to user
  ////// Correct route for GET AND POST to "/:id/orders"
  router.get("/items", (req, res) => {
    //// implement login login with req.id and req.restaurant_check
    let userId = req.cookies;
    console.log("Line 62 ", userId);

    let templateVars = {};
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

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // POST :userid/orders Submits users' order
  // async here is to be able to use await for the variable
  router.post("/items", async (req, res) => {
    // insert a new order in database and get back the id;
    // convert js date to sql date
    //let createdOrderId = await ;
    let restaurantId = 1;
    let userId = 1;
    let orderFilled = false;
    //userId = req.cookies;
    console.log("Line 62 ", userId);

    let createdOrderId = await db
      .query(
        `INSERT INTO ORDERS(created_at,user_id) VALUES ($1,1) RETURNING *;`,
        [new Date().toISOString().slice(0, 19).replace("T", " ")]
      )
      .then((res) => {
        return res.rows[0].id;
      })
      .catch((err) => console.log(err.message));

    // [ ] Finalize adding items to order_items table
    console.log("createdOrderId :>>zz ", createdOrderId);

    // loop through all items in the form -- item is id of item in database and it's value is the quantity
    for (const item in req.body) {
      //console.log("Line 81 This is item id in database",item);
      //console.log("Line 82 This is the quantity of items in database",req.body[item]);

      // Loop through each item in the form and get back the quantity for each
      if (req.body[item] !== "") {
        orderFilled = true;
        for (let index = 0; index < req.body[item]; index++) {
          db.query(
            `INSERT INTO order_items(order_id,item_id,customer_id,restaurant_id) VALUES($1,$2,$3,$4)`,
            [createdOrderId, item, userId, restaurantId]
          )
            .then(() => {
              console.log("👍  order was submitted successfully");
            })
            .catch((err) => console.log("line 74", err.message));
        }
      }
    }
    if (orderFilled) {
      // Twilio Implementation
      const twilioClient = new twilio(accountSid, authToken);

      twilioClient.messages
        .create({
          body: `Your order was created please wait 45 minutes until it's ready 👻`,
          to: "+13439976090", // Text this number
          from: "+16572247880", // From a valid Twilio number
        })
        .then((message) => message.sid);
    }
    res.redirect("/users/items");
  });
  return router;
};

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+16572247880',
//      to: '+15558675310'
//    })
//   .then(message => console.log(message.sid));

// module.exports = (db) => {
// //   router.get("/", (req, res) =>
// //   {
// //       res.render("index");
// //     // db.query(`SELECT * FROM users;`)
// //     //   .then(data => {
// //     //     const users = data.rows;
// //     //     res.json({ users });
// //     //   })
// //     //   .catch(err => {
// //     //     res
// //     //       .status(500)
// //     //       .json({ error: err.message });
// //     //   });
// //   });
// router.get("/", (req, res) => {
//   res.render("index");
// });
//   return router;
// };
