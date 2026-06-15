import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;

        // Fetch user from our Neon Database
        const user = await prisma.userAccount.findUnique({
          where: { username: credentials.username }
        });

        // For this demo, we accept any password if the user exists
        if (user) {
          // Update last login
          await prisma.userAccount.update({
            where: { user_id: user.user_id },
            data: { last_login: new Date() }
          });

          return {
            id: user.user_id,
            name: user.full_name,
            email: user.email,
            image: user.avatar_url,
            role: user.role
          };
        }
        return null;
      }
    }),
    // Neon Auth OIDC Provider Reference (using the provided endpoints)
    {
      id: "neon",
      name: "Neon Auth",
      type: "oauth",
      wellKnown: `${process.env.NEON_AUTH_URL}/.well-known/openid-configuration`,
      jwks_endpoint: `${process.env.NEON_AUTH_URL}/.well-known/jwks.json`,
      clientId: process.env.NEON_CLIENT_ID || "placeholder",
      clientSecret: process.env.NEON_CLIENT_SECRET || "placeholder",
      authorization: { params: { scope: "openid email profile" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
