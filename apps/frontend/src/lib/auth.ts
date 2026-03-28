import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          //WE WILL UNCOMMENT IT WHEN THE REAL BACKEND API IS READY
          // const { data } = await axios.post(
          //   `${process.env.BACKEND_URL}/auth/login`,
          //   { email: credentials?.email, password: credentials?.password }
          // );
          // if (data.accessToken) {
          //   return { ...data.user, accessToken: data.accessToken };
          // }
           if (
      credentials?.email === "demo@gmail.com" &&
      credentials?.password === "demo123"
    ) {
      return {
        id: "1",
        name: "Demo User",
        email: "demo@gmail.com",
        accessToken: "fake-token-123",
      };
    }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as unknown as Record<string, unknown>).accessToken as string;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as unknown as Record<string, unknown>).accessToken = token.accessToken;
      if (session.user) (session.user as unknown as Record<string, unknown>).id = token.id;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
