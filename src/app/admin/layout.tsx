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
        <div className="mx-auto max-w-6xl px-5 py-2">
          <div className="flex h-10 items-center justify-between">
            <span className="font-extrabold">
              <span className="bg-gradient-to-r from-glow-700 to-glow-400 bg-clip-text text-transparent">
                {c.brand.name}
              </span>{' '}
              <span className="text-slate-400">Painel</span>
            </span>
            <form action={logoutAction} className="inline">
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-glow-300 hover:text-glow-600"
              >
                Sair
              </button>
            </form>
          </div>
          <nav className="mt-1 flex gap-5 overflow-x-auto pb-1 text-sm font-medium text-slate-600">
            <a href="/admin" className="whitespace-nowrap hover:text-glow-600">Dashboard</a>
            <a href="/admin/leads" className="whitespace-nowrap hover:text-glow-600">Leads</a>
            <a href="/admin/conteudo" className="whitespace-nowrap hover:text-glow-600">Conteúdo da LP</a>
            <a href="/" className="whitespace-nowrap hover:text-glow-600" target="_blank">Ver site ↗</a>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}