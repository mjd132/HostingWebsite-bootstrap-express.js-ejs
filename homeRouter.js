const router = require("express").Router();

router.get(["/", "/index"], (req, res) => {
  const user = req.session.user;

  res.render("index", { user });
});
router.get("/price", (req, res) => {
  res.render("price");
});
module.exports = router;
