import { getContent } from '@/lib/content';
import { logoutAction } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await getContent();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <span className="font-extrabold">
              <span className="bg-gradient-to-r from-glow-700 to-glow-400 bg-clip-text text-transparent">
                {c.brand.name}
              </span>{' '}
              <span className="text-slate-400">Painel</span>
            </span>
            <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
              <a href="/admin" className="hover:text-glow-600">Dashboard</a>
              <a href="/admin/leads" className="hover:text-glow-600">Leads</a>
              <a href="/admin/conteudo" className="hover:text-glow-600">Conteúdo da LP</a>
              <a href="/" className="hover:text-glow-600" target="_blank">Ver site ↗</a>
            </nav>
          </div>
          <form action={logoutAction} className="inline">
            <button
              type="submit"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-glow-300 hover:text-glow-600"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}