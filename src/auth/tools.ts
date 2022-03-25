import jwt from "jsonwebtoken"

export const authenticateUser = async (user:IUser) => {
  // given the user returns a token for him/her
  const accessToken = await generateJWTToken({ _id: user._id, role: user.role })
  return accessToken
}

const generateJWTToken = (payload:{_id:string, role:string}) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )

export const verifyJWTToken = (token:string): Promise<IPayload> =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) rej(err)
      else res(payload as IPayload)
    })
  )
