import { Request, Response } from "express";
import * as yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

type Tregister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Tlogin = {
  identifier: string;
  password: string;
};

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as Tregister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await userModel.create({
        fullName,
        username,
        email,
        password,
      });

      res.status(200).json({
        message: "Succes registration!",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async login(req: Request, res: Response) {
    const { identifier, password } = req.body as unknown as Tlogin;
    try {
      // ambil data user berdasarkan 'identifier' (email dan username)
      const userByIdentifier = await userModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      });

      if (!userByIdentifier) {
        return res.status(403).json({
          message: "user not found!",
          data: null,
        });
      }

      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return res.status(403).json({
          message: "user not found!",
          data: null,
        });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });
      res.status(200).json({
        message: "login succes!",
        data: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await userModel.findById(user?.id);

      res.status(200).json({
        message: "succes get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};

const registerValidateSchema = yup.object({
  fullName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "password must be match"),
});
