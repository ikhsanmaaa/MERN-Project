import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilPicture: string;
  isActive: boolean;
  activationCode: string;
}

const schema = mongoose.Schema;
const userSchema = new schema<User>(
  {
    fullName: {
      type: schema.Types.String,
      required: true,
    },
    username: {
      type: schema.Types.String,
      required: true,
    },
    email: {
      type: schema.Types.String,
      required: true,
    },
    password: {
      type: schema.Types.String,
      required: true,
    },
    role: {
      type: schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilPicture: {
      type: schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
const userModel = mongoose.model("user", userSchema);

export default userModel;
