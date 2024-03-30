import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
}

const brandSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export default Brand;