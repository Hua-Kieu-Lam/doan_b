import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  name: string;
  discount: number;
  expires: Date;
}

const couponSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;