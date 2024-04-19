import { Request, Response } from "express"
import ShopList, { IShopList } from "../models/shopList";
const asyncHandler = require("express-async-handler");
import slugify from "slugify";


interface CustomRequest extends Request {
    files: any;
    file: any
}

const handleCreateShopList = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { address, shopName, categoryProductList } = req.body;
    const thumb = req?.file?.path;
    console.log("Check thumb: ", thumb);
    if (!address || !shopName || !categoryProductList) {
        return res.status(400).json({
            success: false,
            mes: "Missing params",
        });
    }

    if (thumb) {
        req.body.thumb = thumb;
    }

    if (req.body.shopName) {
        req.body.slug = slugify(req.body.shopName);
    }

    console.log("Check body: ", req.body);

    const response = await ShopList.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Create shop list successfully" : "Something wrong",
    });
});

const handleDeleteShopList = asyncHandler(async (req : Request, res : Response) => {
    const { sid } = req.params;
    if (!sid) {
      throw new Error("Missing params");
    }
    const shopList = await ShopList.findByIdAndUpdate(
        {
            _id: sid,
        },
        { isDeleted: true },
        { new: true }
    );
    return res.status(200).json({
      success: shopList ? true : false,
      mes: shopList ? `Shop list ${shopList.nameShop} deleted` : "Shop list not found",
    });
});

const handleUpdateShopList = asyncHandler(async (req :CustomRequest, res : Response) => {
    const { sid } = req.params;
    if (!sid || Object.keys(req.body).length === 0) {
      throw new Error("Missing input");
    }

    const thumb = req?.files?.thumb[0]?.path;
        
    if (thumb) {
        req.body.thumb = thumb;
    }

    const shopList = await ShopList.findByIdAndUpdate(
        {
            _id: sid,
        },
        req.body,
        { new: true }
    );
    return res.status(200).json({
      success: ShopList ? true : false,
      data: ShopList ? ShopList : "Something wrong",
      mes: ShopList ? "Updated" : "Update fail",
    });
});

const handleGetShopLists = asyncHandler(async (req: Request, res: Response) => {
        const shopLists = await ShopList.find();
        return res.status(200).json({
          success: shopLists ? true : false,
          data: shopLists ? shopLists : "Something wrong",
        });
});

const handleGetShopListById = asyncHandler(async (req: Request, res: Response) => {
    const { sid } = req.params;
    if (!sid) {
        throw new Error("Missing shop list id");
    }
    const shopLists = await ShopList.findById({ _id: sid });
    return res.status(200).json({
      success: shopLists ? true : false,
      data: shopLists ? shopLists : "Something wrong",
    });
});

export default {
    handleCreateShopList,
    handleDeleteShopList,
    handleUpdateShopList,
    handleGetShopLists,
    handleGetShopListById
}