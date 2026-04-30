import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const ALLOWED_EMAILS = [
  "demo@gmail.com",
  "zakabusiness2020@gmail.com",
  "klaaswijnands00@gmail.com",
  "infozemmarketing@gmail.com",
  "absami.us@gmail.com",
  "martingarciaburgueno@gmail.com",
];

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
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { data } = await axios.post(
            `${process.env.BACKEND_URL}/auth/login`,
            { email: credentials.email, password: credentials.password },
          );
          if (data?.token) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              accessToken: data.token,
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
    async signIn({ user }) {
      if (!ALLOWED_EMAILS.includes(user.email ?? "")) {
        return "/login?error=not_allowed";
      }
      return true;
    },
    // jwt receives `account` on first sign-in — the only reliable place to call
    // the backend for OAuth providers (mutations to `user` in signIn don't persist here)
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        // First Google sign-in: upsert the user in our DB and store the backend JWT
        const url = `${process.env.BACKEND_URL}/auth/google`;
        console.log("[NextAuth][google] calling backend:", url, "email:", user.email);
        try {
          const { data } = await axios.post(url, {
            email: user.email,
            name: user.name,
            googleId: account.providerAccountId,
          });
          const d = data as { token: string; user: { id: string } };
          token.accessToken = d.token;
          token.id = d.user.id;
          console.log("[NextAuth][google] user upserted, id:", d.user.id);
        } catch (err) {
          const e = err as { response?: { status?: number; data?: unknown }; message?: string };
          console.error(
            "[NextAuth][google] backend call failed:",
            e?.response?.status,
            JSON.stringify(e?.response?.data ?? e?.message),
          );
        }
      } else if (user) {
        // Credentials provider — accessToken and id already set by authorize()
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
