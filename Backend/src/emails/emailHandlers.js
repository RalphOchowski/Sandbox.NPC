import { CLIENT_URL, EMAIL_NAME, EMAIL_FROM } from "../lib/config.js";
import { resendClient } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
	const { data, error } = await resendClient.emails.send({
		from: `${EMAIL_NAME} <${EMAIL_FROM}>`,
		to: email,
		subject: "Welcome To Sandbox.NPC",
		html: createWelcomeEmailTemplate(name, CLIENT_URL)
	});

	if (error) {
		console.error("Error sending welcome email:", error);
		throw new Error("Failed Sending Welcome Email.");
	}

	console.log("Email sent successfully ", data);
};