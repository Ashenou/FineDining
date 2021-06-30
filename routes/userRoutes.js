const express = require("express");
const router = express.Router();

module.exports = (db) => {
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

  // [  ] save res.rows[0].id inside createdOrderId
  // POST :userid/orders Submits users' order
  router.post("/items", (req, res) => {
    // insert a new order in database and get back the id;
    // convert js date to sql date
    let createdOrderId = 1;
    let restaurantId = 1;
    let userId = req.cookies("user").id;
    db.query(
      `INSERT INTO ORDERS(created_at,user_id) VALUES ('${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}',1) RETURNING *;`
    )
      .then(
        (res) =>
          //console.log(`res.rows[0].id`, res.rows[0].id);
          res.rows[0].id
      )
      .catch((err) => console.log(err.message));


    // [ ] Finalize adding items to order_items table
    console.log("createdOrderId :>>zz ", createdOrderId);
    // loop through all items in the form -- item is id of item in database and it's value is the quantity
    for (const item in req.body) {
      console.log(item);
      console.log(req.body[item]);
      if (req.body[item] !== "") {
        db.query(
          `INSERT INTO items_orders(order_id,item_id,customer_id,restaurant_id) VALUES($1,$2,$3,$4)`,
          [createdOrderId, item, userId, restaurantId]
        )
          .then(console.log("order was submitted successfully"))
          .catch((err) => console.log("line 74", err.message));
      }
    }
  });
  return router;
};

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
