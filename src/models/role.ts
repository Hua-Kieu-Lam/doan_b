import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  code: string;
  value: string;
}

const roleSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    value: {
      type: String,
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

const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role;