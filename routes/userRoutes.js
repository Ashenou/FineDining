const express = require("express");
const router = express.Router();

// /user/login
module.exports = (db) => {


  // GET / -- View login page
  router.get("/", (req, res) => {
    res.render("login");
  });

  // POST / -- Checks if user exists in database
  router.post("/", (req, res) => {
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
  router.get("/orders", (req, res) => {
    db.query();
  });

  // POST :userid/orders Submits users' order
  router.post("/orders", (req, res) => {
    db.query();
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
