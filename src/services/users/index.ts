import express from "express"
import { authenticateUser } from "../../auth/tools"
import { Request, Response, NextFunction} from 'express'

import createHttpError from "http-errors"
import { JWTAuthMiddleware } from "../../auth/token"
import { HostonlyMiddleware } from "../../auth/HostMiddleware"
import passport from "passport"
import User from "./schema"
import { IRequest } from "../../types"

const usersRouter = express.Router()

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body)
    const newUser = await User.find()
    res.status(201).send(newUser)
  } catch (error) {
    next(error)
  }
})


usersRouter.post("/register", async (req, res, next) => {
  try {
    console.log(req.body)
    const user = new User(req.body)
    const newUser = await user.save()
    if(newUser){
      res.status(201).send(newUser)
    }else{
      res.status(400).send({message:"something bad happened!"})
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await User.checkCredentials(email, password)
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
//     const user = await User.find()
//     res.send(user)
//   } catch (error) {
//     next(error)
//   }
// })


usersRouter.get("/me", JWTAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as IRequest

    if(request.user){
      const user = await User.findById(request.user._id)
      res.send(user)
    }
    
  } catch (error) {
    next(error)
  }
})


usersRouter.get("/googleLogin",passport.authenticate("google", { scope: ["email", "profile"] })) 

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req as IRequest

      console.log("TOKENS: ", request.user.token)
      
      res.redirect(
        `${process.env.FE_URL}?accessToken=${request.user.token}`
      )
    } catch (error) {
      next(error)
    }
  }
)


usersRouter.get(
  "/me/accomodation",
  JWTAuthMiddleware, HostonlyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req as IRequest
      const user = request.user
      const accomodation = await User.find({ users: user._id })
      res.send(accomodation)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.delete("/:userId", JWTAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as IRequest
    const userId = request.params.userId
    if (userId === request.user._id) {
      const deleteUser = await User.findByIdAndDelete(userId)
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
