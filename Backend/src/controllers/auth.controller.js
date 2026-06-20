import User from "../models/User.js";
import bcrypt from "bcryptjs"; //take note
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { CLIENT_URL } from "../lib/config.js";
import cloudinary from "../lib/cloudinary.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body; //take note
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and passoword are required."
        });
    }

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            }); //take note
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }

        //console.log("Request body:", req.body);
        //console.log("Email value:", email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //take note
        if (!emailRegex.test(
            email)) { //take note
            return res.status(400).json({
                message: "Invalid email format."
            });
        }
        const [localPart, domain] = email.split('@');
        const normalizedEmail = `${localPart}@${domain.toLowerCase()}`;
        //console.log("Regex test:", emailRegex.test(email));
        const user = await User.findOne({
            email: normalizedEmail
        }); //take note
        if (user)
            return res.status(400)
                .json({
                    message: "Email already exists."
                });

        const salt = await bcrypt.genSalt(10); //take note
        const hashedPassword = await bcrypt.hash(password, salt); //take note
        const newUser = new User({
            fullName: fullName.trim().replace(/\s+/g, " "), //take note
            email: normalizedEmail,
            password: hashedPassword
        });
        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            }); //take note

            try {
                await sendWelcomeEmail(newUser.email, newUser.fullName, CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email: ", error);
            }
        } else {
            res.status(400)
                .json({
                    message: "Invalid user data."
                });
        }
    } catch (error) {
        console.log("Error in controller: ", error);
        res.status(500)
            .json({
                message: "Internal Server Error."
            });
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email
        });
        if (!user)
            return res.status(400).json({
                message: "Invalid Credentials"
            });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({
                message: "Invalid Credentials"
            });

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in controller: ", error);
        res.status(500)
            .json({
                message: "Internal Server Error."
            });
    }
};

export const logout = async (_, res) => { //not using a request
    res.cookie("jwt", "", {
        maxAge: 0
    }); //erasing cookies by setting maximum age of jwt token generated for user to 0
    res.status(200).json({
        message: "Logged Out Successfully"
    });
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic)
            return res.status(400).json({
                message: "Profile pic required."
            });
        const userId = req.user._id; //take note, apparently not assigning the user the object from the request body makes this undefined, why do we do this?
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {
            returnDocument: "after"
        }); //updating the profilePic entry for that user on the db
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error encountered while updating profile: ", error);
        res.status(500)
            .json({
                message: "Internal Server Error."
            });
    }
};
