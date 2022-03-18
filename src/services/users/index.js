import express from "express"
import UserModel from "./schema.js"
import { authenticateUser } from "../../auth/tools.js"

import createHttpError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/token.js"

const usersRouter = express.Router()

usersRouter.post("/register", async (req, res, next) => {
  try {
    console.log(req.body)
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    if (user) {
      const accessToken = await authenticateUser(user)
      res.status(201).send({ accessToken })
    } else {
      next(createHttpError(401, "not gonna happen"))
    }
  } catch (error) {
    next(error)
  }
})

// usersRouter.get("/", async (req, res, next) => {
//   try {
//     const user = await UserModel.find()
//     res.send(user)
//   } catch (error) {
//     next(error)
//   }
// })

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})

// usersRouter.get(
//   "/me/accomodation",
//   JWTAuthMiddleware,
//   async (req, res, next) => {
//     try {
//       const user = req.user
//       const accomodation = await AccomodatioModel.find({ users: user._id })
//       res.send(accomodation)
//     } catch (error) {
//       next(error)
//     }
//   }
// )

usersRouter.delete("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId
    if (userId === req.user._id) {
      const deleteUser = await UserModel.findByIdAndDelete(userId)
      if (deleteUser) {
        res.status(204).send()
      } else {
        next(createHttpError(404, `User with id ${userId} not found!`))
      }
    } else {
      next(createHttpError(401, `You can't delete another user :O`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
