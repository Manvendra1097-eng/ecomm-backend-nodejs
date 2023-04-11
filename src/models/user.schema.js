import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import AuthRoles from "../utils/authRoles";
import config from "../config/index.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be empty"],
      trim: true,
      maxLength: [true, "Maximum length allowed is 20 chars"],
    },
    email: {
      type: String,
      required: [true, "Email can't be empty"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password  can't be empty"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiery: Date,
  },
  { timestamps: true }
);

// pre hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// methods

userSchema.methods = {
  // compare password
  comparePassword: async function (entredPassword) {
    return await bcrypt.compare(entredPassword, this.password);
  },

  // generate JWT token
  getJWTtoken: function () {
    JWT.sign({ _id: this_id, role: this.role }, config.JWT_TOKEN, {
      expiresIn: config.JWT_EXPIREY,
    });
  },

  //   generate forgot password token
  getForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20, "hex");
    // hash token by crypto
    this.forgotPasswordToken = crypto
      .createHash("sah256")
      .update(forgotToken)
      .digest("hex");

      this.forgotPasswordExpiery = Date.now()+20*60*1000;

      return forgotToken;
  },
};

export default mongoose.model("User", userSchema);
