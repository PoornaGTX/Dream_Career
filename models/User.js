import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "lastName",
    },
    type: {
      type: String,
      required: [true, "please provide account type."],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "my city",
    },
  },
  { timestamps: true }
);

//password hashing
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await crypto
    .createHash("sha1")
    .update(this.password)
    .digest("hex");
});

export default mongoose.model("User", UserSchema);
