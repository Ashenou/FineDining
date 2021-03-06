/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
  //console.log(req.cookies)
  templateVars = {user: req.cookies.user}
  res.render("index", templateVars);
});

module.exports = router;

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
