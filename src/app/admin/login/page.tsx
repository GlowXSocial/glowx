import { loginAction } from '@/app/actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-glow-50 to-white px-5">
      <div className="w-full max-w-sm rounded-3xl border border-glow-100 bg-white p-8 shadow-glow">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-glow-50 text-2xl">
            🔐
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Painel GlowX</h1>
          <p className="mt-1 text-sm text-slate-500">Digite a senha de administrador</p>
        </div>

        {searchParams.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
            Senha incorreta. Tente novamente.
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <input
            name="password"
            type="password"
            required
            autoFocus
            className="glow-input"
            placeholder="Senha"
          />
          <button type="submit" className="glow-btn w-full">Entrar</button>
        </form>
      </div>
    </main>
  );
}