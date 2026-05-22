const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
].join(" ");

export async function GET(): Promise<Response> {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_REDIRECT_URI) {
    return Response.json(
      { error: "Spotify credentials not configured." },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  return Response.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
