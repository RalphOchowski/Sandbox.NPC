import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async(req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429)
                .json({
                    message: "Too many requests."
                });
            } else if (decision.reason.isBot) {
                res.status(403)
                .json({
                    message: "Bot access denied."
                });
            } else {
                res.status(403)
                .json({
                    message: "Access denied by security policy." //why are we using the else clause here seems too vague? take note anyways
                });
            }

            if (decision.results.some(isSpoofedBot)) {
                res.status(403)
                .json({
                    error: "Spoofed bot detected",
                    message: "Malicious bot detected."
                });
            }
        }
		next();
    } catch (error) {
        console.log("Arcjet protection error: ", error);
    }
};
