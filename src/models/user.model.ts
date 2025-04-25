import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilPicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: string;
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
      unique: true,
    },
    email: {
      type: schema.Types.String,
      required: true,
      unique: true,
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
  user.activationCode = encrypt(user.id);
  next();
});

userSchema.post("save", async function (doc, next) {
  try {
    const user = doc;
    console.log(`email activation was sent to: ${user.email}`);
    const contentMail = await renderMailHtml("registration-succes.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });
    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail,
    });
  } catch (error) {
    console.log(`error: ${error}`);
  } finally {
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
const userModel = mongoose.model("user", userSchema);

export default userModel;
