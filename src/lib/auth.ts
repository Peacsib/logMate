import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Reg Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const identifier = (credentials.email as string).trim()
        const password = credentials.password as string

        try {
          // Check by email or registration number
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier.toLowerCase() },
                { regNumber: identifier.toUpperCase() },
              ],
            },
          })

          if (user && user.passwordHash) {
            const isValid = await bcrypt.compare(password, user.passwordHash)
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: "student",
                image: user.avatar || undefined,
              }
            }
          }
        } catch (dbErr) {
          console.error("Database auth check error:", dbErr)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "student"
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = (token.role as string) || "student"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "logmate-work-learn-log-secret-key-2026",
})
