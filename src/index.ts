import express from 'express';
import cors from 'cors';
import "dotenv/config"
import mongoose from 'mongoose';
import UserRoute from './routes/UserRoute'; //router
import RoleRoute from './routes/RoleRoute'; //router
import CategoryRoute from './routes/CategoryRoute';
import CouponRoute from './routes/CouponRoute';
import ProductRoute from './routes/ProductRouTe';
import ShopListRoute from './routes/ShopListRoute';
import OrderRoute from './routes/OrderRoute';

const cookieParser = require("cookie-parser");

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Kết nối với DB được rùi, zui lên nha!! 🎉"))

const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// app.get('/', async (req, res) => {
//     res.json({ message: "Hi" })
// });

app.use('/api/user', UserRoute)
app.use('/api/role', RoleRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/coupon', CouponRoute)
app.use('/api/product', ProductRoute)
app.use('/api/shop-list', ShopListRoute)
app.use('/api/order', OrderRoute)

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

