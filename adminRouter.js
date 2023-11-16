const { Plan, User } = require("./database");

// const contentRouter = require("express").Router();
const router = require("express").Router();
// const planRouter = require("express").Router();
// const adminRouter = require("express").Router();

// function isAdmin(req, res, next) {}

// contentRouter.use((req, res, next) => {
//   next();
// });
// planRouter.use((req, res, next) => {
//   next();
// });
router.use("/admin*", (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Access forbidden");
  }
});

router.post("/admin/role", async (req, res) => {
  const body = req.body;

  await User.findOneAndUpdate(
    { email: body.email },
    { $set: { role: req.body.role } }
  ).then((r) => {
    res.send("ok");
  });
});
router.route("/admin/plan").post(async (req, res) => {
  const body = req.body;
  if (!body) return res.redirect("/admin/plan");
  try {
    const result = await Plan.create(body);
    return res.redirect("/admin/plan");
  } catch (err) {
    console.log(err);
  }
});

router.route(["/admin/:section", "/admin"]).get((req, res) => {
  const user = req.session.user;
  const section = req.params.section;
  if (section) res.render("adminDashboard", { user, section: section });
  else res.render("adminDashboard", { user, section: "main" });
});

// contentRouter.use("/content", contentRouter);
// planRouter.use("/plan", planRouter);
// adminRouter.use("/admin", adminRouter);

module.exports = { router };
