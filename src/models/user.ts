import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth0Id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    phonenumber: {
        type: Number,
    },
    address: {
        type: String,
    }
});

const User = mongoose.model("User", userSchema);

export default User;