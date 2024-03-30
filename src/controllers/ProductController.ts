import { Request, Response } from "express"
import Product, { IProduct } from "../models/product";
const asyncHandler = require("express-async-handler");
import slugify from "slugify";

interface CustomRequest extends Request {
    files: any;
    user: any;
}

const handleCreateProduct = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { name, brand, description, price, shopListId,quantity,categoryId, sold, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.image?.map((item: any) => item.path);

  if (!(name && brand && description && price && categoryId && color && sold && quantity && shopListId)) {
    throw new Error("Missing input");
  }

  if (req.body && req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  if (thumb) {
    req.body.thumb = thumb;
  }
  if (images) {
    req.body.images = images;
  }
    

  const product = await Product.create(req.body);

  return res.status(200).json({
    success: product ? true : false,
    product: product,
    mes: product ? "Create a product successfully" : "Create a product failed",
      });
})

const handleGetProductById = asyncHandler(async (req : Request, res: Response) => {
    const { pid } = req.params;
    if (!pid) {
      throw new Error("Missing product id");
    }
    const product = await Product.findById({ _id: pid }).populate({
      path: "rating",
      populate: {
        path: "postedBy",
        select: "username avatar",
      },
    });
    return res.status(200).json({
      success: product ? true : false,
      product: product ? product : "Get a product failed",
    });
});

const handleGetAllProduct = asyncHandler(async (req: Request, res: Response) => {
    const queries = { ...req.query };
    //Tach cac truong dat biet ra khoi query
    const excludeFields = ["limit", "page", "fields", "sort"];
    excludeFields.forEach((el) => delete queries[el]);
  
    //Fortmat lai cho dung cu phap cua mongoose
    let queryString = JSON.stringify(queries); //Chuyen thanh Json
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // Chuyen ve lai doi tuong js
    const formatQuery = JSON.parse(queryString);
  
    //Filtering
    if (queries?.name) {
      formatQuery.name = { $regex: queries.name, $options: "i" };
    }
  
    if (queries?.category) {
      formatQuery.category = { $regex: queries.category, $options: "i" };
    }
  
    let colorQueryObject = {};
    if (queries?.color) { //blue,red
      delete formatQuery.color;
      const colorArr: string[] = queries?.color?.toString()?.split(","); //[blue,red]
      const colorQuery = colorArr.map((item : any) => ({
        color: { $regex: item, $options: "i" },
      }));
      colorQueryObject = { $or: colorQuery };
    }
  
    let queryObj = {};
    if (queries?.q) {
      delete formatQuery.q;
      queryObj = {
        $or: [
          { title: { $regex: queries.q, $options: "i" } },
          { category: { $regex: queries.q, $options: "i" } },
          { brand: { $regex: queries.q, $options: "i" } },
        ],
      };
    }
  
    const qr = { ...colorQueryObject, ...formatQuery, ...queryObj };
  
    let queryCommand = Product.find(qr);
  
    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort?.toString().split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }
  
    //Limit fields
    if (req.query.fields) {
      const fields = req.query.fields?.toString().split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    }
  
    //Pagination
    const page = Number(req.query.page) * 1 || 1; // so count truyen vao
    const limit = Number(req.query.limit) * 1 || 10; //(tham so limit);
    const skip = (page - 1) * limit;
  
    queryCommand = queryCommand.skip(skip).limit(limit);
  
    queryCommand
      .then(async (products) => {
        const counts = await Product.find(qr).countDocuments();
        return res.status(200).json({
          success: products ? true : false,
          products: products ? products : "Get all product failed",
          counts,
        });
      })
      .catch((err) => {
        throw new Error(err.message);
      });
});

const handleUpdateProductById = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { pid } = req.params;
    if (!pid) {
      throw new Error("Missing product id");
    }
    const files = req?.files;
    if (files?.thumb) {
      req.body.thumb = files?.thumb[0]?.path;
    }
    if (files?.image) {
      req.body.images = files?.image?.map((item: any) => item.path);
    }
    if (req.body && req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
  
    const product = await Product.findByIdAndUpdate({ _id: pid }, req.body, {
      new: true,
    });
  
    return res.status(200).json({
      success: product ? true : false,
      data: product ? product : "Update a product failed",
      mes: product ? "Updated success" : "Update a product failed",
    });
});

const handleDeleteProductById = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { pid } = req.params;
    if (!pid) {
      throw new Error("Missing product id");
    }
  
    const product = await Product.findByIdAndUpdate({ _id: pid }, {
        isDeleted: true
    }, {
      new: true,
    });
  
    return res.status(200).json({
      success: product ? true : false,
      data: product ? product : "Delete a product failed",
      mes: product ? "Deleted success" : "Delete a product failed",
    });
});

const handleRatings = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
    if (!star || !pid) {
      throw new Error("Missing input");
    }
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.rating?.find(
      (el) => el.postedBy.toString() === _id
    );
  
    if (alreadyRating) {
      //update star and comment
      await Product.updateOne(
        {
          rating: { $elemMatch: alreadyRating },
        },
        {
          $set: {
            "rating.$.star": star,
            "rating.$.comment": comment,
            "rating.$.updatedAt": updatedAt,
          },
        },
        { new: true }
      );
    } else {
      //add star and comment
      await Product.findByIdAndUpdate(
        pid,
        {
          $push: {
            rating: {
              star: star,
              comment: comment,
              postedBy: _id,
              updatedAt,
            },
          },
        },
        { new: true }
      );
    }
  
    //Sum rating
    const updateProduct: any = await Product.findById(pid);
    const ratingCount = updateProduct.rating.length;
    const sumRating = updateProduct.rating.reduce(
      (sum: Number, ele: any) => sum + ele.star,
      0
    );
    updateProduct.totalRating = Math.round((sumRating * 10) / ratingCount) / 10;
  
    await updateProduct.save();
    return res.status(200).json({
      success: true,
      mes: "You had rating successfully",
    });
});



export default {
    handleCreateProduct,
    handleGetProductById,
    handleGetAllProduct,
    handleUpdateProductById,
    handleDeleteProductById,
    handleRatings
}