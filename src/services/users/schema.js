import mongoose from "mongoose"

import bcrypt from "bcrypt"

const { Schema, model } = mongoose

export const ROLE_HOST = "host"
export const ROLE_GUEST = "guest"

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: String,
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: [ROLE_GUEST, ROLE_HOST], default: ROLE_GUEST },
  },

  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function (next) {
  const newUser = this
  const plainPw = newUser.password

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPw, 10)
    newUser.password = hash
  }

  next()
})

UserSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email })
  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)

    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

export default model("User", UserSchema)
