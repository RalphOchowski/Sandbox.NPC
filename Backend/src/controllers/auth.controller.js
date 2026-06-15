import User from "../models/User.js";
import bcrypt from "bcryptjs"; //take note
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { CLIENT_URL } from "../lib/config.js";

export const signup = async(req, res) => {
    const { fullName, email, password } = req.body; //take note

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
        const [localPart, domain] = email.split('@');
        const normalizedEmail = `${localPart}@${domain.toLowerCase()}`;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //take note

        if (!emailRegex.test(
                normalizedEmail)) { //take note
            return res.status(400).json({
                message: "Invalid email format."
            });
        }
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
            fullName: fullName.trim().replace(/\s+/g, " "), //gets rid of excessive spaces between first and last names
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
			}
			catch(error){
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
