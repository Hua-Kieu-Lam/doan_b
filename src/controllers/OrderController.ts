import { Request, Response } from "express"
import Order, { IOrder } from "../models/order";
import User, { IUser } from "../models/user";
import Coupon, { ICoupon } from "../models/coupon";
const asyncHandler = require("express-async-handler");
import slugify from "slugify";

interface CustomRequest extends Request {
    user: any;
}


const handleCreateOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { _id } = req.user;
    const { couponId } = req.body; // id cua coupon
    const userCart: any = await User.findById(_id)
      .select("cart")
      .populate("cart.product", "name price");
    
    console.log("Check: ", userCart);
  
    const products = userCart?.cart?.map((el: any) => {
      return {
        product: el.product._id,
        count: el.quantity,
        color: el.color,
      };
    });

    let total = userCart?.cart?.reduce((sum : any, cur: any) => {
        const productPrice = cur.product.price;
        return productPrice * cur.quantity + sum;
    }, 0);
  
    const data = {
      products,
      total,
      orderBy: _id,
      couponId: ""
    };
  
    if (couponId) {
      const selectedCoupon = await Coupon.findById(couponId);
      total = Math.round(Number(total) * (1 - Number(selectedCoupon?.discount) / 100)) || total;
  
      data.total = total;
      data.couponId = couponId;
    }
  
    const response = await Order.create(data);
  
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? response : "Somethings wrong",
      cart: userCart,
    });
});

const handleUpdateStatusOrder = asyncHandler(async (req: Request, res: Response) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) {
      throw new Error("Missing status");
    }
    const response = await Order.findByIdAndUpdate(
      oid,
      { status },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? response : "Somethings wrong",
    });
});

const handleGetOrderByUser = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id });
    return res.status(200).json({
      success: response ? true : false,
      order: response ? response : "Somethings wrong",
    });
});

const handleGetOrderByAdmin = asyncHandler(async (req: Request, res: Response) => {
    const response = await Order.find();
    return res.status(200).json({
      success: response ? true : false,
      orders: response ? response : "Somethings wrong",
    });
  });

export default {
    handleCreateOrder,
    handleUpdateStatusOrder,
    handleGetOrderByUser,
    handleGetOrderByAdmin
}