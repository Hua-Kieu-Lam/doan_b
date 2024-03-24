import express from 'express';
import cors from 'cors';
import "dotenv/config"
import mongoose from 'mongoose';
import UserRoute from './routes/UserRoute'; //router

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Kết nối với DB được rùi, zui lên nha!! 🎉"))

const app = express();
app.use(express.json())
app.use(cors())

// app.get('/', async (req, res) => {
//     res.json({ message: "Hi" })
// });

app.use('/api/user', UserRoute)

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

