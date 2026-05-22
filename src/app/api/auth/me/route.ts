import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.cookies.get("spotify_session")?.value;

  if (!raw) {
    return Response.json({ user: null });
  }

  try {
    const session = JSON.parse(raw) as {
      user: {
        id: string;
        display_name: string;
        email: string;
        image: string | null;
      };
      expires_at: number;
    };

    if (Date.now() > session.expires_at) {
      return Response.json({ user: null });
    }

    return Response.json({ user: session.user });
  } catch {
    return Response.json({ user: null });
  }
}
