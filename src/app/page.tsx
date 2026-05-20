export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-6">
      <div className="text-center space-y-4 max-w-lg">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Sonic <span className="text-accent">Analytics</span>
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          AI-First music streaming analytics dashboard. Connect your wallet or
          Spotify account to get started.
        </p>
      </div>
    </div>
  );
}
