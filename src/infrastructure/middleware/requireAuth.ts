import type { RequestHandler } from "express";
import { auth } from "../../shared/utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { AppError } from "../../shared/utils/app.error.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
};
