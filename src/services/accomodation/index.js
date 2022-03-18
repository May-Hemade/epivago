import express from "express";
import createHttpError from "http-errors";
import AccomodationsModel from "./schema.js";

const accomodationsRouter = express.Router();

accomodationsRouter.post("/", async (req, res, next) => {
  try {
    const newAccomodation = new AccomodationsModel(req.body);
    const { _id } = await newAccomodation.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
accomodationsRouter.get("/", async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find();
    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.get("/:accomodationId", async (req, res, next) => {
  try {
    const accomodationId = req.params.accomodationId;
    const accomodation = await AccomodationsModel.findById(
      accomodationId
    ).populate({
      path: "user",
      select: "email,password,role",
    });
    if (accomodation) {
      res.send(accomodation);
    } else {
      next(
        createHttpError(
          404,
          `accomandation with id ${accomodationId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.put("/:accomandationId", async (req, res, next) => {
  try {
    const accomodationId = req.params.accomodationId;
    const updatedAccomodation = await AccomodationsModel.findByIdAndUpdate(
      accomodationId,
      req.body,
      {
        new: true,
      }
    );
    if (updatedAccomodation) {
      res.send(updatedAccomodation);
    } else {
      next(
        createHttpError(
          404,
          `accomodation with id ${accomodationId} not found!`
        )
      );
    }
  } catch (error) {
    {
    }
    next(error);
  }
});
accomodationsRouter.delete("/:accomodationId", async (req, res, next) => {
  try {
    const accomodationId = req.params.accomodationId;
    const deletedAccomodation = await AccomodationsModel.findByIdAndDelete(
      accomodationId
    );
    if (deletedAccomodation) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `accomodation with id ${accomodationId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
export default accomodationsRouter;
