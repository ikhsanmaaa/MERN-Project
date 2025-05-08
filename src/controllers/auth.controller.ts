import { Request, Response } from "express";
import * as yup from "yup";
import userModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

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
    /**
   #swagger.tags=['auth']
   */
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
      response.success(res, result, "Succes registration!");
    } catch (error) {
      response.error(res, error, "failed registration");
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.tags=['auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/LoginRequest"}
     }
     */
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
        return response.unauthorized(res, "user not found");
      }
      const userByIsActivate = await userModel.findOne({
        isActive: true,
      });
      if (!userByIsActivate) {
        return response.unauthorized(res, "user is not actived yet!");
      }
      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, "user not found");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });
      response.success(res, token, "login success");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, "login failed");
    }
  },
  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags=['auth']
     #swagger.security = [{
     "bearerAuth": []
     }]
     */
    try {
      const user = req.user;
      const result = await userModel.findById(user?.id);

      response.success(res, result, "success get user profile");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, "failed get user profile");
    }
  },
  async activation(req: Request, res: Response) {
    /**
     #swagger.tags=['auth']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/activation"}
     }
     */
    try {
      const { code } = req.body as { code: string };

      const user = await userModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );
      response.success(res, user, "user succesfully activated");
    } catch (error) {
      response.error(res, error, "failed to activate account");
    }
  },
};

const registerValidateSchema = yup.object({
  fullName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(6, "password must be at least 6 character")
    .test(
      "at-least-one-uppercase-letter",
      "Contains at least one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test("at-least-one-number", "Contains at least one number", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "password must be match"),
});
