import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";

export type User = {
  id: string;
  role: "admin" | "user";
  approved: boolean;
} | null;

export async function createContext() {
  const token =
    (await cookies()).get("app_jwt")?.value ?? (await headers()).get("x-auth");
  let user: User | null = null;

  if (token) {
    try {
      user = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret"
      ) as User;
    } catch {}
  }

  return {
    user,
    revalidatePath: (await import("next/cache")).revalidatePath,
    revalidateTag: (await import("next/cache")).revalidateTag,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
