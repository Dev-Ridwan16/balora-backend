import { auth } from "../utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { AppError } from "../utils/app.error.js";
export const requireAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (!session) {
            throw new AppError("Unauthorized: No active session found.", 401);
        }
        req.user = session.user;
        req.session = session.session;
        next();
    }
    catch (error) {
        next(error);
    }
};
