import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const HostonlyMiddleware:RequestHandler = (req, res, next) => {
  if (req.user.role === "host") {
    next()
  }else{
    next(createHttpError(403, "Only host is allowed!"))
  }
}