import { api } from "@/lib/api";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// type User = {
//   email: string;
//   password: string;
// };

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // const user: any = {
        //   email: email,
        //   password: password,
        // };

        const user: any = await api
          .post("/users/login", {
            email: email,
            password: password,
          })
          .catch(() => {
            return null;
          });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: JWT; user: User | AdapterUser }) {
      if (user) {
        token.email = user.email;
      }

      return token;
      // if (account?.provider === "credentials") {
      //   token.email = user.email;
      // }
      // return token;
    },

    async session({ session, token }: any) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
