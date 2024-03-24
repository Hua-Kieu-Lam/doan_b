import { Request, Response } from "express"
import User from "../models/User";
const createCurrentUser = async (req: Request, res: Response) => {
    /**
     * Ktra người dùng đã tồn tại hay chưa
     * Nếu chưa thì tạo mới
     */
    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });
        const newUser = new User(req.body);

        if (existingUser) {
            res.status(200).send()
        }
        await newUser.save();
        res.status(201).json(newUser.toObject());
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Thất bại khi tạo người dùng! 😟" })
    }
}
export default {
    createCurrentUser
}