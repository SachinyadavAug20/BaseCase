import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccount, IAccoutDoc } from "./dataBase/account.model";
import { SignInSchema } from "./lib/validation";
import { IUserDoc } from "./dataBase/user.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validateField = SignInSchema.safeParse(credentials);
        if (validateField.success) {
          const { email, password } = validateField.data;
          const { data: existingAccount } =
            (await api.account.getByProviderAccountId(
              email,
            )) as ActionResponse<IAccoutDoc>;
          if (!existingAccount) return null;
          const { data: existingUser } = (await api.user.getById(
            existingAccount.userId.toString(),
          )) as ActionResponse<IUserDoc>;
          if (!existingUser) return null;
          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!,
          );
          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // do after oauth
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: ExistingAccount, success } =
          (await api.account.getByProviderAccountId(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId,
          )) as ActionResponse<IAccount>;
        if (!success || !ExistingAccount) return token;
        const userId = ExistingAccount.userId;
        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.type == "credentials") return true;
      if (!account || !user) return false;
      const userInfo = {
        name: user.name!, // information not null
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
        email: user.email!,
        image: user.image!,
      };
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google" | "apple",
        providerAccountId: account.providerAccountId as string,
      })) as ActionResponse;
      return !success ? false : true;
    },
  },
});
