const mongoose = require("mongoose");

// Connect to MongoDB (change the connection URL to your MongoDB instance)
mongoose.connect("mongodb://127.0.0.1:27017/ali_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const plan = new mongoose.Schema({
  name: String,
  cpu: String,
  Storage: String,
  Ram: String,
  Price: String,
  Traffic: String,
  Database: String,
  space: String,
  addon: String,
  price: String,
  country: String,
  categoryName: String,
  code: Number,
});
const basketShop = new mongoose.Schema({
  plans: plan,
  month: Number,
});
const order = new mongoose.Schema({
  userOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateRegistered: String,
  status: {
    type: String,
    enum: ["processed", "notProcess", "processing", "active", "off"],
  },
  sumPrices: String,
  plan: [plan],
});

// Create a mongoose schema for your User model
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  orders: [order],
  basketShop: [basketShop],
});

const content = new mongoose.Schema({});
// Create a user schema and model
const User = mongoose.model("User", userSchema);
const Plan = mongoose.model("Plan", plan);
const Order = mongoose.model("Order", order);

module.exports = { User, Plan, Order };
