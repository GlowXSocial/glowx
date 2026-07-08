import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function Obrigado() {
  const c = await getContent();
  const clean = (c.brand.whatsappNumber || '').replace(/\D/g, '');
  const waLink = `https://wa.me/${clean}?text=${encodeURIComponent(
    c.thankYou.whatsappMessage
  )}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-glow-50 to-white px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-glow-100 bg-white p-8 text-center shadow-glow md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-glow-50 text-4xl">
          🎉
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">{c.thankYou.title}</h1>
        <p className="mt-3 text-slate-600">{c.thankYou.subtitle}</p>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white transition hover:scale-[1.02]"
        >
          💬 Abrir conversa no WhatsApp
        </a>

        <a href="/" className="mt-4 inline-block text-sm text-slate-500 hover:text-glow-600">
          ← Voltar para o site
        </a>
      </div>
    </main>
  );
}