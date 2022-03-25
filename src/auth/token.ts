import { RequestHandler } from "express";
import createHttpError from "http-errors";
import createError from "http-errors";
import { verifyJWTToken } from "./tools.js";

export const JWTAuthMiddleware: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createError(401, "Please provide bearer token in authorization header!")
    );
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer ", "");

      const payload = await verifyJWTToken(token);
      if (!payload) return next(createHttpError(401, "Invalid Details"));
      req.user = {
        _id: payload._id,
        role: payload.role,
      };
      next();
    } catch (error) {
      console.log(error);
      next(createError(401, "Token not valid!"));
    }
  }
};
