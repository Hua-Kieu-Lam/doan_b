const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
import { Request, Response, NextFunction } from "express"
import User, { IUser } from "../models/user";

const key = process.env.JWT_KEY_PRIVATE as string;

interface CustomRequest extends Request {
  user: any;
}

export const verifyJWT = asyncHandler(async (req: CustomRequest , res: Response, next: NextFunction) => {
  // headers: {
  //     authorization: Bearer token
  // }
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, key, (error : any, decode : any) => {
      if (error) {
        return res.status(401).json({
          success: false,
          mes: "Invalid access token",
        });
      }

      req.user = decode; // giai ma token thanh lai data da gui vao
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication",
    });
  }
});

export const isAdmin = asyncHandler(async (req: CustomRequest , res: Response, next: NextFunction) => {
  console.log("Check user mid: ", req.user);
  const { role } = req.user;
  const user : any = await User.findOne({ roleId: role }).populate("roleId", "value");
  console.log("Check obj user: ", user);
  if (user?.roleId?.value !== "admin") {
    return res.status(401).json({
      success: false,
      mes: "Require is admin role",
    });
  }
  next();
});


