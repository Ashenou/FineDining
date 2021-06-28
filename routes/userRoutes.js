const express = require('express');
const router = express.Router();





module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  })
  router.post("/", (req,res) => {
    db.query(`SELECT * FROM users WHERE email = $1 AND passowrd = $2;`, [req.body.email, req.body.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
    console.log(err.message);
    })
});
return router;
}




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
