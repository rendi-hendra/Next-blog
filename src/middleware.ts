"use server";

import { NextResponse, NextRequest } from "next/server";
import { api } from "./lib/api";

export async function middleware(req: NextRequest) {
  const cekToken = async (token: string | undefined) => {
    try {
      await api.get("/users/current", {
        headers: { Authorization: token },
      });
      return true;
    } catch {
      return false;
    }
  };

  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Halaman yang tidak memerlukan autentikasi
  const publicRoutes = ["/login", "/"];

  // Halaman yang memerlukan autentikasi
  const protectedRoutes = ["/dashboard", "/dashboard/post"];

  let userToken = false;
  if (token) {
    userToken = await cekToken(token);
  }

  const response = NextResponse.next();

  // Jika halaman yang diakses adalah halaman yang dilindungi
  if (protectedRoutes.includes(pathname)) {
    if (!userToken) {
      // Redirect ke halaman login jika tidak ada token atau token tidak valid
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Jika halaman yang diakses adalah halaman yang tidak memerlukan autentikasi
  if (publicRoutes.includes(pathname) && userToken) {
    // Redirect ke halaman dashboard jika sudah login dan mencoba mengakses halaman public
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jika tidak ada kondisi yang terpenuhi, lanjutkan ke rute tujuan
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
