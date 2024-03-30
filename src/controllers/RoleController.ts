import { Request, Response } from "express"
import Role, { IRole } from "../models/role";
const asyncHandler = require("express-async-handler");

const handleCreateRole = asyncHandler(async (req: Request, res: Response) => {
    const { code, value } = req.body;
        if (!code || !value ) {
            return res.status(400).json({
            success: false,
            mes: "Missing params",
            });
        }
        const response = await Role.create(req.body);
        return res.status(200).json({
          success: response ? true : false,
          mes: response ? "Create role successfully" : "Something wrong",
        });
});

const handleDeleteRole = asyncHandler(async (req : Request, res : Response) => {
    const { rid } = req.params;
    if (!rid) {
      throw new Error("Missing params");
    }
    const role = await Role.findByIdAndUpdate(
        {
            _id: rid,
        },
        { isDeleted: true },
        { new: true }
    );
    return res.status(200).json({
      success: role ? true : false,
      mes: role ? `Role ${role.value} deleted` : "Role not found",
    });
});

const handleUpdateRole = asyncHandler(async (req :Request, res : Response) => {
    const { rid } = req.params;
    if (!rid || Object.keys(req.body).length === 0) {
      throw new Error("Missing input");
    }
    const role = await Role.findByIdAndUpdate(
        {
            _id: rid,
        },
        req.body,
        { new: true }
    );
    return res.status(200).json({
      success: role ? true : false,
      data: role ? role : "Something wrong",
      mes: role ? "Updated" : "Update fail",
    });
});

const handleGetRoles = asyncHandler(async (req: Request, res: Response) => {
        const roles = await Role.find();
        return res.status(200).json({
          success: roles ? true : false,
          data: roles ? roles : "Something wrong",
        });
});

export default {
    handleCreateRole,
    handleDeleteRole,
    handleUpdateRole,
    handleGetRoles
}