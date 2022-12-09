import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLEOAUTH_ID,
      clientSecret: process.env.GOOGLEOAUTH_SECRET
    })
  ],
  secret: process.env.JWT_SECRET
})