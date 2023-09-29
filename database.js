const mongoose = require("mongoose");

// Connect to MongoDB (change the connection URL to your MongoDB instance)
mongoose.connect("mongodb://127.0.0.1:27017/ali_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
});

// Create a user schema and model
const User = mongoose.model("User", userSchema);

module.exports = { User };
