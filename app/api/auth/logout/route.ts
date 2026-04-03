import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("labmedix-role");
  cookieStore.delete("labmedix-email");

  return NextResponse.redirect(new URL("/", request.url));
}
