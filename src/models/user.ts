import mongoose, { Schema, Document, Types } from "mongoose";
const bcrypt = require('bcrypt');

export interface IUser extends Document {
  auth0Id: string;
  email: string;
  username?: string;
  phoneNumber?: number;
  address?: string;
  avatar?: string;
  roleId: Types.ObjectId;
  cart: {
    product: Types.ObjectId;
    quantity: number;
    color: string;
  }[];
  wishlist: Types.ObjectId[];
  isBlocked: boolean;
}

const userSchema: Schema = new Schema({
  auth0Id: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  avatar: {
    type: String,
  },
  roleId: {
    type: Types.ObjectId,
    ref: "Role",
    default: "66040f28932be7b90be90fbb"
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      color: String,
    },
  ],
  wishlist: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  isBlocked: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
},{
    timestamps: true,
  });

  userSchema.pre("save", function (next) {
    if (this.isModified(("password"))) {
      next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  });
  
  userSchema.methods = {
    checkPassword: async function (password : any) {
      return await bcrypt.compare(password, this.password);
    }
  };

const User = mongoose.model<IUser>("User", userSchema);


export default User;