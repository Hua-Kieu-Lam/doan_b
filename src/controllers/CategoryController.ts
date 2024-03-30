import { Request, Response } from "express"
import Category, { ICategory } from "../models/category";
const asyncHandler = require("express-async-handler");
import slugify from "slugify";

const handleCreateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, brand, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                mes: "Missing params",
            });
        }
        if (req.body && req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
        const response = await Category.create(req.body);
        return res.status(200).json({
          success: response ? true : false,
          mes: response ? "Create category successfully" : "Something wrong",
        });
});

const handleDeleteCategory = asyncHandler(async (req : Request, res : Response) => {
    const { cid } = req.params;
    if (!cid) {
      throw new Error("Missing params");
    }
    const category = await Category.findByIdAndUpdate(
        {
            _id: cid,
        },
        { isDeleted: true },
        { new: true }
    );
    return res.status(200).json({
      success: category ? true : false,
      mes: category ? `Category ${category.name} deleted` : "Role not found",
    });
});

const handleUpdateCategory = asyncHandler(async (req :Request, res : Response) => {
    const { cid } = req.params;
    console.log("Check: ", req.body)
    if (!cid || Object.keys(req.body).length === 0) {
      throw new Error("Missing input");
    }
    if (req.body && req.body.name) {
        req.body.slug = slugify(req.body.name);
    }
    const category = await Category.findByIdAndUpdate(
        {
            _id: cid,
        },
        req.body,
        { new: true }
    );
    return res.status(200).json({
      success: category ? true : false,
      data: category ? category : "Something wrong",
      mes: category ? "Updated" : "Update fail",
    });
});

const handleGetCategories = asyncHandler(async (req: Request, res: Response) => {
        const categories = await Category.find();
        return res.status(200).json({
          success: categories ? true : false,
          data: categories ? categories : "Something wrong",
        });
});

export default {
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    handleGetCategories
}