import "dotenv/config";
const reqEnv = ["MONGO_URI", "JWT_SECRET", "RESEND_API_KEY", "EMAIL_FROM", "EMAIL_NAME", "CLIENT_URL", "PORT", "NODE_ENV", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_SECRET", "CLOUDINARY_API_KEY", "ARCJET_KEY", "ARCJET_ENV"];
reqEnv.forEach((key) => {
	if (!process.env[key]) {
    throw new Error(`${key} is not set in .env`);
  }
}); //take note

export const { MONGO_URI, JWT_SECRET, RESEND_API_KEY, EMAIL_FROM, EMAIL_NAME, CLIENT_URL, PORT, NODE_ENV, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, ARCJET_KEY, ARCJET_ENV } = process.env;