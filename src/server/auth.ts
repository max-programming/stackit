"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";

export async function registerAction(data: RegisterRequest) {
  await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
}

export async function loginAction(data: LoginRequest) {
  await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });
}

export async function logoutAction() {
  await auth.api.signOut({ headers: await headers() });
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
