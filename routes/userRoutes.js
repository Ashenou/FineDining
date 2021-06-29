const express = require("express");
const router = express.Router();


module.exports = (db) => {


  // GET /login -- View login page
  router.get('/login', (req, res) => {
    return res.render("login");
  });

  // POST /login -- Checks if user exists in database
  router.post('/login', (req, res) => {
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


  // GET :userid/orders Shows restaurant's menu to user
  ////// Correct route for GET AND POST to "/:id/orders"
  router.get('/orders', (req, res) => {
    //db.query();
    //console.log("/user/orders");
    //req.cookie("user")
  });

  // POST :userid/orders Submits users' order
  router.post('/orders', (req, res) => {
    //db.query();
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
