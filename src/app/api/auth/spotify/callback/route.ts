import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  cookieStore.delete("spotify_oauth_state");

  const baseUrl = new URL("/", request.url).toString();

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}?error=auth_failed`);
  }

  // Exchange code → tokens
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${baseUrl}?error=token_failed`);
  }

  const tokens = await tokenRes.json();

  // Fetch Spotify profile
  const profileRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!profileRes.ok) {
    return NextResponse.redirect(`${baseUrl}?error=profile_failed`);
  }

  const profile = await profileRes.json();

  const session = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + tokens.expires_in * 1000,
    user: {
      id: profile.id,
      display_name: profile.display_name ?? profile.id,
      email: profile.email ?? "",
      image: (profile.images as { url: string }[])?.[0]?.url ?? null,
    },
  };

  // Use NextResponse so the Set-Cookie header is included in the redirect
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("spotify_session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
