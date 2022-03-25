import express from "express"
import UserModel from "./schema.js"
import { authenticateUser } from "../../auth/tools.js"

import createHttpError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/token.js"
import { HostonlyMiddleware } from "../../auth/HostMiddleware.js"
import passport from "passport"

const usersRouter = express.Router()

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body)
    const newUser = await UserModel.find()
    res.status(201).send(newUser)
  } catch (error) {
    next(error)
  }
})


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
    const user:IUser = await UserModel.checkCredentials(email, password)
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


usersRouter.get("/googleLogin",passport.authenticate("google", { scope: ["email", "profile"] })) 

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log("TOKENS: ", req.user.token)
      
      res.redirect(
        `${process.env.FE_URL}?accessToken=${req.user.token}`
      )
    } catch (error) {
      next(error)
    }
  }
)


usersRouter.get(
  "/me/accomodation",
  JWTAuthMiddleware, HostonlyMiddleware,
  async (req, res, next) => {
    try {
      const user = req.user
      const accomodation = await UserModel.find({ users: user._id })
      res.send(accomodation)
    } catch (error) {
      next(error)
    }
  }
)

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
