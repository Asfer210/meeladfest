import { useState } from "react";
import { Lock } from "lucide-react";

export function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!onLogin(username.trim(), password)) {
      setError("Incorrect username or password.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <form
        onSubmit={submit}
        className="login-panel w-full max-w-sm rounded-3xl border p-8 text-center"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border">
          <Lock className="size-5" />
        </div>
        <h1 className="mt-5 text-xl font-black tracking-[0.25em] uppercase">Admin Login</h1>

        <label className="mt-8 block text-left text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          autoComplete="username"
          className="adjust-input mt-2 w-full rounded-xl border px-4 py-3"
        />

        <label className="mt-5 block text-left text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          autoComplete="current-password"
          className="adjust-input mt-2 w-full rounded-xl border px-4 py-3"
        />

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="mt-7 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold tracking-[0.2em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
        >
          Login
        </button>
      </form>
    </main>
  );
}
