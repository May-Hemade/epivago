// import passport from "passport"
// import GoogleStrategy  from "passport-google-oauth20"
// import userSchema from "../services/users/schema.js"
// import { UserProfile } from "../types.js"
// import { authenticateUser } from "./tools.js"
// const googleStrategy = new GoogleStrategy({
//     clientID: process.env.GOOGLE_ID,
//     clientSecret: process.env.GOOGLE_SECRET,
//     callbackURL: `${process.env.API_URL}/user/googleRedirect`
// },
// async (accessToken:string ,refresh:string,  profile:UserProfile, passportNext:(error: any, user?: any, info?: any) => void ) => {
//     try {
     
//       console.log(profile)

//       if(profile.emails && profile.emails.length > 0 ) {
//         const user = await userSchema.findOne({ email: profile.emails[0] })

//       if (user) {
//         const token = await authenticateUser(user)
//         passportNext(null, { token, role: user.role })
//       } else {
//         // 4. Else if the user is not in our db --> add the user to db and then create token(s) for him/her

//         const newUser = new userSchema({
//           name: profile.name,
//           surname: profile.familyName,
//           email: profile.emails[0],
//           googleId: profile.googleUserId,
//         })

//         const savedUser = await newUser.save()
//         const token = await authenticateUser(savedUser)

//         passportNext(null, { token })
//       }
//       }


      
//     } catch (error) {
//       passportNext(error)
//     }
//   }
// )


// passport.serializeUser((data, passportNext) => {
//   passportNext(null, data)
// })

// export default googleStrategy