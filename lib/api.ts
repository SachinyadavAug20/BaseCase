// fetchHandler(`${BASE_URL_PATH}/account/${id}`, {
//   method: "GET",
//   body:JSON.stringify({
//     name:"Sachin",
//     id:"12"
//   }),
//   timeout:2000
// }).then((res) => console.log(res));
//
//
// THIS IS good can do more ==>
//
//
// api.createAccount({name:"Sachin",id:"12"})
// api.getAccounts()

import { IUser } from "@/dataBase/user.model";
import { fetchHandler } from "./handlers/fetch";
import { IAccount } from "@/dataBase/account.model";
import { Provider } from "@radix-ui/react-toast";
import { SignInWithOAuthParams } from "@/types/action";
import ROUTES from "@/constant/routes";
import { APIResponse } from "@/types/global";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// if method not provided it will be GET
export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  user: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email/`, {
        method: "POST",
        body: JSON.stringify({ email: email }),
      }),
    create: (userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, { method: "DELETE" }),
  },
  account: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProviderAccountId: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider/`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId: providerAccountId }),
      }),
    create: (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, { method: "DELETE" }),
  },
  ai: {
    getAnswer: (question: string, content: string, userAnswer?: string) =>
      fetchHandler(`${API_BASE_URL}/ai/answers`, {
        method: "POST",
        body: JSON.stringify({ question, content, userAnswer }),
      }),
  },
};
