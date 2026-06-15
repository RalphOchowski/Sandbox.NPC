import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ //take note
    email: {
        type: String,
        required: true,
        unique: true

    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profilePic: {
        type: String,
    default:
        ""
    },
}, {
    timestamps: true //take note
});

const User = new mongoose.model("User", userSchema); //take note (also get clarification behind the first letter case incosistency)
export default User;
