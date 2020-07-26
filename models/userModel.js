const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: Buffer,
  },
  email: {
    type: String,
    required: true,
  },
  aboutme: {
    type: String,
  },
  gender: {
    type: String,
    require: true,
  },
  zip: {
    type: Number,
    require: true,
  },
  password: {
    type: String,
    required: true,
    min: 3,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide password"],
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "tutor", "admin"],
  },
  passwordChangedAt: Date,
});

// userSchema.pre("save", async function (next) {

//   this.image =

//   next();
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
