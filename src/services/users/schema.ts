import bcrypt from "bcrypt"

import { Model, Schema, model } from 'mongoose';
import { IUser } from "../../types";

export const ROLE_HOST = "host"
export const ROLE_GUEST = "guest"

interface UserModel extends Model<IUser> {
  checkCredentials(email: string, plainPW: string): Promise<IUser | null> ;
}

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String },
    avatar: {type:String},
    email: { type: String },
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
  console.log(this)
  const userDocument = this
  const userObject = userDocument.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

UserSchema.statics.checkCredentials = async function (email: string, plainPW: string) : Promise<IUser | null> {
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

const User = model<IUser, UserModel>('User', UserSchema);

export default User
