import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for login page and API routes
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check for admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("bonds")?.value;
    if (!token) {
      // Redirect to login if no token
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Fetch user data to check is_superuser status
    try {
      const response = await fetch("http://localhost:8000/htoya/", {
        headers: {
          Cookie: `bonds=${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const userData = await response.json();

      if (!userData.is_superuser) {
        // Redirect to login page if not a superuser
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Check for profile routes
  if (pathname.startsWith("/profile")) {
    const token = req.cookies.get("bonds")?.value;
    if (!token) {
      // Add query parameter for auth modal
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("requireAuth", "true");
      return NextResponse.redirect(url);
    }

    // Verify token with backend
    const response = await fetch("http://localhost:8000/htoya/", {
      headers: {
        Cookie: `bonds=${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      // Add query parameter for auth modal
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("requireAuth", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
};
