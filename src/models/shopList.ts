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
    shopName: {
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
    categoryProductList: {
      type: Array,
      require: true
    }
  },
  {
    timestamps: true,
  }
);

const ShopList = mongoose.model<IShopList>('ShopList', shopListSchema);

export default ShopList;