import { Request, Response } from "express"
import Coupon, { ICoupon } from "../models/coupon";
const asyncHandler = require("express-async-handler");

const handleCreateCoupon = asyncHandler(async (req : Request, res: Response) => {
    const { name, discount, expires } = req.body;
    if (!name || !discount || !expires) {
        throw new Error('Missing input');
    }
    const coupon = await Coupon.create({
        ...req.body,
        expires: Date.now() + +expires * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
        success: coupon ? true : false,
        mes: coupon ? 'Create a coupon successfully' : 'Create a coupon failed'
    })
})

const handleGetAllCoupon = asyncHandler(async (req : Request, res: Response) => {
    const coupon = await Coupon.find();
    return res.status(200).json({
        success: coupon ? true : false,
        coupon: coupon ? coupon : 'Get coupons failed'
    })
})

const handleUpdateCouponById = asyncHandler(async (req : Request, res: Response) => {
    const { cid } = req.params;
    if (!cid) {
        throw new Error('Missing coupon id');
    }

    if (req.body.expires) {
        req.body.expires = Date.now() + +req.body.expires * 24 * 60 * 60 * 1000;
    }
    const coupon = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    
    return res.status(200).json({
        success: coupon ? true : false,
        data: coupon ? coupon : 'Update a coupon failed'
    })
})

const handleDeleteCouponById = asyncHandler(async (req : Request, res: Response) => {
    const { cid } = req.params;
    if (!cid) {
        throw new Error('Missing coupon id');
    }
    const coupon = await Coupon.findByIdAndUpdate(
        {
            _id: cid,
        },
        { isDeleted: true },
        { new: true }
    );
    return res.status(200).json({
        success: coupon ? true : false,
        mes: coupon ? 'Delete a coupon successfully' : 'Delete a coupon failed'
    })
})

export default {
    handleCreateCoupon,
    handleGetAllCoupon,
    handleUpdateCouponById,
    handleDeleteCouponById,
}
