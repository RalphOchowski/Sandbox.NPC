import { Resend } from "resend";
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_NAME} from "./config.js";

export const resendClient = new Resend(RESEND_API_KEY);

export const sender = {
	email: EMAIL_FROM,
	name: EMAIL_NAME,
};
