import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("bonds")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the token with your backend
    const response = await fetch("http://localhost:8000/htoya/", {
      headers: {
        Cookie: `bonds=${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      // Token is invalid
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Token is valid
    const userData = await response.json();
    return NextResponse.json(
      {
        authenticated: true,
        user: userData,
        token: token, // Return the token so client can update state
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Authentication check failed:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error: "Authentication check failed",
      },
      { status: 500 }
    );
  }
}
