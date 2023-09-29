const router = require("express").Router();
const bcrypt = require("bcrypt");
const database = require("./database");

router
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(async (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Empty!" });
    }
    try {
      const { name, email, password, rePassword } = req.body;

      // Check if the user already exists
      const existingUser = await database.User.findOne({ email });
      if (existingUser) {
        return res.render("signup", { message: "User already exists" });
      }

      // Check if the password and rePassword match
      if (password !== rePassword) {
        return res.render("signup", { message: "Passwords do not match" });
      }
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new database.User({
        name: name,
        email,
        password: hashedPassword,
      });
      await user.save();
      req.session.user = user;
      // res.status(201).json({ message: "User registered successfully" });
      res.redirect("/index");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed", error: error });
    }
  });

router
  .route("/login")
  .get((req, res) => {
    const currentPath = req.originalUrl;

    if (req.session.user) res.redirect("dashboard");
    else res.render("login");
  })
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by username
      const user = await database.User.findOne({ email });

      if (!user) {
        return res.render("login", {
          message: "Email or Password not Correct!",
        });
      }

      // Compare the provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.render("login", {
          message: "Email or Password not Correct!",
        });
      }

      req.session.user = user;
      if (user.role === "user") res.redirect("/dashboard");
      if (user.role === "admin") res.redirect("/admin");
    } catch (error) {
      res.status(500).json({ message: "Authentication failed", error });
    }
  });

router.get("/logout", (req, res) => {
  // Implement your logout logic here (e.g., clearing the token or session)
  // Redirect the user to the login page
  req.session.destroy();
  res.redirect("login");
});
module.exports = router;
