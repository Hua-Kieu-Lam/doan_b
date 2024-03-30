import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  products: Types.ObjectId[];
  status: 'Canceled' | 'Processing' | 'Succeed';
  total: number;
  coupon: Types.ObjectId;
  orderBy: Types.ObjectId;
}

const orderSchema: Schema = new Schema({
    products: [
        {
            product: {
                type: Types.ObjectId,
                ref: 'Product',
            }
        }
    ],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Canceled', 'Processing', 'Succeed'],
    },
    total: Number,
    coupon: {
        type: Types.ObjectId,
        ref: 'Coupon',
    },
    orderBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    paymentMethod:{
        type:String,
        enum:['COD','CARD'],
        default:'COD',
    },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;