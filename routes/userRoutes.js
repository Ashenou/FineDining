const express = require("express");
const router = express.Router();

const twilio = require("twilio");

module.exports = (db, accountSid, authToken) => {
  // GET /login -- View login page
  router.get("/login", (req, res) => {
    let templateVars = { user: req.cookies.user };
    res.render("login", templateVars);
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
        if (result.rows[0]) {
          res.cookie("user", result.rows[0]);
          return res.redirect("/");
        } else {
          console.log("login error");
          return res.redirect("/users/login");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  /// GET /items Shows restaurant's menu to user
  router.get("/items", (req, res) => {
    //// implement login login with req.id and req.restaurant_check
    //let userId = req.cookies["user"].id;
    //console.log("Line 62 ", userId);
    const user = req.cookies.user;
    if (req.cookies["user"]) {
      let templateVars = { user };
      db.query(
        `SELECT items.* , item_type.name as item_type_name
    FROM items
    JOIN item_type ON items.type_id = item_type.id ;`
      )
        .then((result) => {
          templateVars["items"] = result.rows;
          return res.render("items", templateVars);
        })
        .catch((err) => console.log(err));
    } else {
      res.redirect("/users/login");
    }
  });

  //// POST :userid/orders Submits users' order
  // async here is to be able to use await for the variable
  router.post("/items", async (req, res) => {
    // insert a new order in database and get back the id;
    // convert js date to sql date
    //let createdOrderId = await ;
    let restaurantId = 1;
    let userId = req.cookies.user.id;
    let orderFilled = false;

    let createdOrderId = await db
      .query(
        `INSERT INTO ORDERS(created_at,user_id) VALUES ($1,$2) RETURNING *;`,
        [new Date().toISOString().slice(0, 19).replace("T", " "), userId]
      )
      .then((res) => {
        return res.rows[0].id;
      })
      .catch((err) => console.log(err.message));

    // Returns an array of objects from select query where it checks the quantity and the name items in the user's order
    let textbodyObj = await Promise.all([
      (() => {
        for (const item in req.body) {
          // loop through all items in the form -- item is id of item in database and it's value is the quantity
          // Loop through each item in the form and get back the quantity for each
          if (req.body[item] !== "") {
            orderFilled = true;

            for (let index = 0; index < req.body[item]; index++) {
              db.query(
                `INSERT INTO order_items(order_id,item_id,customer_id,restaurant_id) VALUES($1,$2,$3,$4) RETURNING *;`,
                [createdOrderId, item, userId, restaurantId]
              )
                .then()
                .catch((err) => console.log("line 74", err.message));
            }
          }
        }
      })(),
    ])
      .then(() => {
        return db
          .query(
            `select items.name,order_items.order_id,count(*) as quantity
      from order_items
      join items on order_items.item_id = items.id
      where order_items.order_id=$1 group by items.name,order_id,item_id;`,
            [createdOrderId]
          )
          .then((result) => {
            return result.rows;
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));

    // Message body forming
    let textString = `${createdOrderId}`;
    for (const key in textbodyObj) {
      textString +=
        "\nx" + textbodyObj[key].quantity + " " + textbodyObj[key].name;
    }

    //Checks if order was not empty
    if (orderFilled) {
      // Twilio Implementation
      let userName = req.cookies["user"].name;
      const twilioClient = new twilio(accountSid, authToken);
      db.query(
        `SELECT phone_number FROM users where name='Fine Dine' AND restaurant_account=true ;`
      )
        .then((result) => {
          twilioClient.messages
            .create({
              body: `\n Customer: ${userName}  has submitted order:# ${textString} \n 😋😋`,
              to: `${result.rows[0].phone_number}`, // Text this number
              from: "+16572247880", // From a valid Twilio number
            })
            .then((message) => message.sid);
        })
        .catch((err) => console.log(err.message));
    }
    res.redirect("/users/items");
  });
  return router;
};
