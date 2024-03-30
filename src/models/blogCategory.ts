import mongoose, { Schema, Document } from 'mongoose';

interface IBlogCategory extends Document {
  title: string;
  slug: string;
}

const blogCategorySchema: Schema = new Schema(
  {
    title: {
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
  },
  {
    timestamps: true,
  }
);

const BlogCategory = mongoose.model<IBlogCategory>('BlogCategory', blogCategorySchema);

export default BlogCategory;