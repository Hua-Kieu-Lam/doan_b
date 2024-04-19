import { Request, Response } from "express"
import User, { IUser } from "../models/user";
const asyncHandler = require("express-async-handler");
import { createJWT } from "../middlewares/createJWT";

interface CustomRequest extends Request {
    user: any;
}

const handleCreateCurrentUser = async (req: Request, res: Response) => {
    /**
     * Ktra người dùng đã tồn tại hay chưa
     * Nếu chưa thì tạo mới
     */
    try {
        const { auth0Id } = req.body;
      const existingUser = await User.findOne({ auth0Id });
      
      const payload = {
        _id: existingUser && existingUser._id,
        auth0Id: auth0Id,
        role: existingUser ? existingUser.roleId : "R01",
      };
      //Tao access token
      const token = createJWT(payload);
        
      if (existingUser) {
          
          return res.status(200).json({
            success: true,
            access_token: token,
            mes: "User exist",
            data: existingUser,
          });
      }
      
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(200).json({
          success: true,
          access_token: token,
          data: newUser,
          mes: "Login successfully",
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Thất bại khi tạo người dùng! 😟" })
    }
}

const handleGetUserCurrent = asyncHandler (async(req: CustomRequest, res: Response): Promise<void> => {
  const { _id } = req.user;
  console.log("id:: ", _id);
    if (!_id) {
      res.status(400).json({
        success: false,
        mes: "Missing params",
      });
      return;
    }
    try {
      const user = await User.findById({ _id: _id }).select("-password");
      if (user) {
        res.status(200).json({
          success: true,
          mes: "Get user current successfully",
          data: user,
        });
      } else {
        throw new Error("User not exist");
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        mes: "Internal server error",
      });
    }
});
  

const handleRegister = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username, phoneNumber } = req.body;
  console.log("Check: ", req.body);
    if (!email || !password || !username || !phoneNumber) {
      return res.status(400).json({
        success: false,
        mes: "Missing params",
      });
  }
  const user = await User.findOne({ email: email });
    if (user) {
      throw new Error("User has existed");
    } else {
      const response = await User.create(req.body);
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Register user successfully" : "Something wrong",
      });
    }
});

const handleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing params",
    });
  }
  const user: any = await User.findOne({ email: email });
  if (user && (await user.checkPassword(password))) {
    const { password, roleId, ...userData } : {password: string, roleId: string} = user.toObject();


    const payload = {
      _id: user._id,
      role: roleId,
    };
    //Tao access token
    const token = createJWT(payload);

    return res.status(200).json({
      success: true,
      mes: "Login successfully",
      access_token: token,
      data: userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const handleDeleteUser = asyncHandler(async (req : Request, res : Response) => {
  const { uid } = req.params;
  if (!uid) {
    throw new Error("Missing params");
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: uid,
    },
    {isDeleted: true},
    { new: true }
  ).select("-password -roleId");
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? `User with email ${user.email} deleted` : "User not found",
  });
});

const handleUpdateUser = asyncHandler(async (req : CustomRequest, res : Response) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: _id,
    },
    req.body,
    { new: true }
  ).select("-password -roleId");
  return res.status(200).json({
    success: user ? true : false,
    data: user ? user : "Something wrong",
  });
});

const handleUpdateUserByAdmin = asyncHandler(async (req :Request, res : Response) => {
  const { uid } = req.params;
  if (!uid || Object.keys(req.body).length === 0) {
    throw new Error("Missing input");
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: uid,
    },
    req.body,
    { new: true }
  ).select("-password -roleId");
  return res.status(200).json({
    success: user ? true : false,
    data: user ? user : "Something wrong",
    mes: user ? "Updated" : "Update fail",
  });
});

const handleGetAllUser = asyncHandler(async (req: Request, res: Response) => {
  const queries = { ...req.query };
  //Tach cac truong dat biet ra khoi query
  const excludeFields = ["limit", "page", "fields", "sort"];
  excludeFields.forEach((el) => delete queries[el]);

  //Fortmat lai cho dung cu phap cua mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formatQuery = JSON.parse(queryString);

  //Filtering
  if (queries?.username) {
    formatQuery.username = { $regex: queries.username, $options: "i" };
  }

  if (req.query.q) {
    delete formatQuery.q;
    formatQuery["$or"] = [
      { username: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
    ];
  }

  let queryCommand = User.find(formatQuery);

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.toString().split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  //Limit fields
  if (req.query.fields) {
    const fields = req.query.fields.toString().split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  const page = Number(req.query.page) * 1 || 1; // so count truyen vao
  const limit = Number(req.query.limit) * 1 || 10; //(tham so limit);
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  queryCommand
    .then(async (users) => {
      const counts = await User.find(formatQuery).countDocuments();
      return res.status(200).json({
        success: users ? true : false,
        users: users ? users : "Get all users failed",
        counts,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});


const handleUpdateAddress = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user;
  if (!req.body.address) {
    throw new Error("Missing input");
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: _id,
    },
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -roleId");
  return res.status(200).json({
    success: user ? true : false,
    data: user ? user : "Something wrong",
  });
});


const handleUpdateCart = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user;
  const { pid, quantity = 1, color, thumbnail, title, price } = req.body;
  if (!pid || !color) {
    throw new Error("Missing input");
  }
  const userCart = await User.findById(_id);

  const alreadyProduct = userCart?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (alreadyProduct) {
    if (alreadyProduct.color == color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": +alreadyProduct.quantity + +quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        data: response ? "Added to cart" : "Something wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        {
          _id: _id,
        },
        {
          $push: {
            cart: { product: pid, quantity, color, thumbnail, title, price },
          },
        },
        { new: true }
      ).select("-password -roleId");
      return res.status(200).json({
        success: response ? true : false,
        data: response ? "Added to cart" : "Something wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      {
        _id: _id,
      },
      {
        $push: {
          cart: { product: pid, quantity, color, thumbnail, title, price },
        },
      },
      { new: true }
    ).select("-password -roleId");
    return res.status(200).json({
      success: response ? true : false,
      data: response ? "Added to cart" : "Something wrong",
    });
  }
});

const handleRemoveInCart = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user;
  const { pid, color } = req.params;

  const userCart = await User.findById(_id);
  const alreadyProduct = userCart?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (!alreadyProduct) {
    return res.status(200).json({
      success: true,
      data: "Updated your cart"
    });
  }
  const response = await User.findByIdAndUpdate(
    {
      _id: _id,
    },
    { $pull: { cart: { product: pid, color } } },
    { new: true }
  ).select("-password -roleId");
  return res.status(200).json({
    success: response ? true : false,
    data: response ? "Updated your cart" : "Something wrong",
  });
});


export default {
    handleCreateCurrentUser,
    handleGetUserCurrent,
    handleRegister,
    handleLogin,
    handleDeleteUser,
    handleUpdateUser,
    handleUpdateUserByAdmin,
    handleGetAllUser,
    handleUpdateAddress,
    handleUpdateCart,
    handleRemoveInCart
}