import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string[];
  brand: string;
  price: number;
  categoryId: Types.ObjectId;
  shopListId: Types.ObjectId;
  thumb: string;
  quantity: number;
  sold: number;
  images: string[];
  color: string;
  rating: {
    star: number;
    postedBy: Types.ObjectId;
    comment: string;
    updatedAt: Date;
  }[];
  totalRating: number;
  variants: {
    color: string;
    price: number;
    thumb: string;
    images: string[];
    title: string;
    sku: string;
  }[];
}

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Role",
    },
    shopListId: {
      type: Types.ObjectId,
      ref: "ShopList",
    },
    thumb: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
    },
    color: {
      type: String,
    },
    rating: [
      {
        star: { type: Number },
        postedBy: {
          type: Types.ObjectId,
          ref: "User",
        },
        comment: { type: String },
        updatedAt: {
          type: Date,
        },
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    variants: [
      {
        color: String,
        price: Number,
        thumb: String,
        images: [String],
        title: String,
        sku: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;