const router = require("express").Router();
const database = require("./database");
const bcrypt = require("bcrypt");
// Middleware to verify Session
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.use("/dashboard/", isAuthenticated);

// router.get("/dashboard", (req, res) => {
//   const user = req.session.user;
//   res.render("dashboard", { user, section: "main" });
// });

router
  .route(["/dashboard/:section", "/dashboard"])
  .get((req, res) => {
    const user = req.session.user;
    const section = req.params.section;
    if (section) res.render("dashboard", { user, section: section });
    else res.render("dashboard", { user, section: "main" });
  })
  .post(async (req, res) => {
    const user = req.session.user;
    const body = req.body;
    if (body.name === "" || body.email === "")
      return res.render("dashboard", {
        user,
        section: "profile",
        error: "email or name cant empty!",
      });

    if (body.pass && body.rePass && body.oldPass) {
      const isPassValid = await bcrypt.compare(body.oldPass, user.password);
      if (!isPassValid)
        return res.render("dashboard", {
          user,
          section: "profile",
          error: "Old password not correct!",
        });
      if (body.pass !== body.rePass)
        return res.render("dashboard", {
          user,
          section: "profile",
          error: "repeat password and new password not equal!",
        });

      const hashedPass = await bcrypt.hash(body.pass, 10);
      const newUser = {
        email: body.email,
        name: body.name,
        password: hashedPass,
      };
      await database.User.findOneAndUpdate(
        { email: user.email },
        { $set: newUser },
        { new: true }
      )
        .then((user) => {
          req.session.user = user;
          return res.redirect("/dashboard/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const newUser = {
        email: body.email,
        name: body.name,
      };
      await database.User.findOneAndUpdate(
        { email: user.email },
        { $set: newUser },
        { new: true }
      )
        .then((user) => {
          console.log(user);
          req.session.user = user;
          return res.redirect("/dashboard/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

router.post("/basket/:planCode/:month", async (req, res) => {
  const planCode = req.params.planCode;
  const month = req.params.month;
  const user = req.session.user;

  await database.Plan.findOne({ code: planCode })
    .then((plan) => {
      const basket = { plan: plan, month: month };
      database.User.updateOne(
        { email: user.email },
        { $set: { basketShop: basket } }
      )
        .then((user) => {
          req.session.user = user;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.delete("/basket", async (req, res) => {
  const body = req.body;
  const user = req.session.user;
  const basket = user.basketShop.splice(body.indexPlan, 1);
  await database.User.findOneAndUpdate(
    { email: user.email },
    { $set: { basketShop: [basket] } }
  )
    .then((user) => {
      req.session.user = user;
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.route(["/admin/:section", "/admin"]).get((req, res) => {
//   const user = req.session.user;
//   const section = req.params.section;
//   if (section) res.render("adminDashboard", { user, section: section });
//   else res.render("adminDashboard", { user, section: "main" });
// });

module.exports = router;
