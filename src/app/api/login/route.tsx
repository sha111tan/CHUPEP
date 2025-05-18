import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch("http://localhost:8000/auth/jwt/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: formData.toString(),
  });

  let data: any = {};

  // Parse cookies from response
  const setCookie = response.headers.get("set-cookie");
  let token = null;

  if (setCookie) {
    // Extract token from cookie (this is a simple extraction, adjust as needed)
    const match = setCookie.match(/bonds=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  // If status not 204, try to parse JSON
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      data = {};
    }
  } else {
    // If status 204 - return success message and token
    data = { message: "Login successful", token };
  }

  // Change status to 200 to send response body
  const status = response.status === 204 ? 200 : response.status;
  const res = NextResponse.json({ ...data, token }, { status });

  // Forward set-cookie header if present
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }

  return res;
}
