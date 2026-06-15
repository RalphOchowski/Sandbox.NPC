import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ //take note
    email: {
        type: String,
        required: true,
        unique: true,
		trim: true
    },
    fullName: {
        type: String,
        required: true,
		trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
    default:
        ""
    },
}, {
    timestamps: true //take note
});// even though the schema is defined in this manner, why can the JSON transfer values in a different order to mongoose?

const User = new mongoose.model("User", userSchema); //take note (also get clarification behind the first letter case incosistency)
export default User;
