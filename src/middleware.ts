"use server";

import { NextResponse, NextRequest } from "next/server";
import { api } from "./lib/api";

const cekToken = async (token: string | undefined) => {
  try {
    const response = await api.get("/users/current", {
      headers: { Authorization: token },
    });
    return response.data.data; // Mengembalikan data pengguna, termasuk peran
  } catch {
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const queryAuthor = req.nextUrl.searchParams.get("author");
  const queryCategory = req.nextUrl.searchParams.get("category");
  const parts = pathname.split("/");
  const slug = parts[parts.length - 1];

  // Halaman yang tidak memerlukan autentikasi
  const publicRoutes = ["/login", "/"];

  // Halaman yang memerlukan autentikasi
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/admin",
    "/dashboard/post",
    "/dashboard/profile",
    `/dashboard/post/${slug}`,
    `/dashboard/post/${queryAuthor}`,
    `/dashboard/post/${queryCategory}`,
  ];

  let userData = null;
  if (token) {
    userData = await cekToken(token);
  }

  // Jika halaman yang diakses adalah halaman yang dilindungi
  if (protectedRoutes.includes(pathname)) {
    if (!userData) {
      // Redirect ke halaman login jika tidak ada token atau token tidak valid
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }

    // Cek akses admin
    if (
      pathname.startsWith("/dashboard/admin") &&
      userData.role !== "Admin" &&
      userData.role !== "Super Admin"
    ) {
      // Redirect ke halaman dashboard jika pengguna bukan admin
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Jika halaman yang diakses adalah halaman yang tidak memerlukan autentikasi
  if (publicRoutes.includes(pathname) && userData) {
    // Redirect ke halaman dashboard jika sudah login dan mencoba mengakses halaman public
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jika tidak ada kondisi yang terpenuhi, lanjutkan ke rute tujuan
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
