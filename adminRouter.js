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
    { $set: { role: body.role } }
  ).then(() => {
    res.redirect("/admin/adminManager");
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

router.route(["/admin/:section", "/admin"]).get(async (req, res) => {
  const user = req.session.user;
  const section = req.params.section;
  if (section === "plan") {
    const plans = await Plan.find().then((plans) => {
      return plans;
    });

    return res.render("adminDashboard", {
      user,
      section: section,
      plans: plans,
    });
  }
  if (section === "adminManager") {
    const admins = await User.find({ role: "admin" });
    return res.render("adminDashboard", {
      user,
      section: section,
      admins: admins,
    });
  }
  if (section) res.render("adminDashboard", { user, section: section });
  else res.render("adminDashboard", { user, section: "main" });
});

// contentRouter.use("/content", contentRouter);
// planRouter.use("/plan", planRouter);
// adminRouter.use("/admin", adminRouter);

module.exports = { router };
