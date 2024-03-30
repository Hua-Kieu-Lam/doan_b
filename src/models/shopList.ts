import mongoose, { Schema, Document } from 'mongoose';

export interface IShopList extends Document {
  address: string;
  nameShop: string;
  slug: string;
}

const shopListSchema: Schema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    nameShop: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    thumb: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ShopList = mongoose.model<IShopList>('ShopList', shopListSchema);

export default ShopList;