import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { IRequest } from "../types";

export const HostonlyMiddleware: RequestHandler = (req, res, next) => {
  const request = req as IRequest
  if (request.user.role === "host") {
    next()
  } else {
    next(createHttpError(403, "Only host is allowed!"))
  }
}