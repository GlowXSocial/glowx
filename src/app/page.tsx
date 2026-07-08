import { getContent } from '@/lib/content';
import { submitLead } from '@/app/actions';

export const dynamic = 'force-dynamic';

function whatsappLink(number: string, message: string) {
  const clean = (number || '').replace(/\D/g, '');
  const msg = encodeURIComponent(message || '');
  return `https://wa.me/${clean}?text=${msg}`;
}

export default async function Home() {
  const c = await getContent();
  const waLink = whatsappLink(
    c.brand.whatsappNumber,
    'Olá! Vim pelo site da GlowX e quero saber mais sobre marketing para a minha clínica. 🌟'
  );

  const styleVars = {
    '--glow-primary': c.brand.primaryColor,
    '--glow-accent': c.brand.accentColor,
  } as React.CSSProperties;

  return (
    <main style={styleVars}>
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-glow-100/60 bg-white/80 backdrop-blur">
        <nav className="glow-section flex h-16 items-center justify-between">
          <a href="#topo" className="flex items-center gap-2 font-extrabold">
            {c.brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.brand.logoUrl}
                alt={c.brand.name}
                className="h-9 w-auto"
              />
            ) : (
              <span className="text-2xl">
                <span className="bg-gradient-to-r from-glow-700 to-glow-400 bg-clip-text text-transparent">
                  {c.brand.name}
                </span>
              </span>
            )}
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#servicos" className="hover:text-glow-600">Serviços</a>
            <a href="#diferenciais" className="hover:text-glow-600">Diferenciais</a>
            <a href="#sobre" className="hover:text-glow-600">Sobre</a>
            <a href="#contato" className="hover:text-glow-600">Contato</a>
          </div>
          <a href="#contato" className="glow-btn !px-5 !py-2.5 !text-sm">
            Falar agora
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="topo" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-glow-50 via-white to-white" />
        <div
          className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: c.brand.accentColor }}
        />
        <div className="glow-section grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-glow-200 bg-white px-4 py-1.5 text-sm font-medium text-glow-700">
              ✨ {c.hero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {c.hero.title}{' '}
              <span className="bg-gradient-to-r from-glow-700 to-glow-400 bg-clip-text text-transparent">
                {c.hero.highlight}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">{c.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contato" className="glow-btn">{c.hero.ctaText}</a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:border-glow-300 hover:text-glow-700"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {c.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-extrabold text-glow-700 md:text-3xl">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 md:text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            {c.hero.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.hero.imageUrl}
                alt="GlowX"
                className="aspect-square w-full rounded-[2.5rem] object-cover shadow-glow"
              />
            )}
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-glow md:block">
              <div className="text-sm font-semibold text-slate-700">Leads esta semana</div>
              <div className="text-2xl font-extrabold text-glow-700">+128 📈</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="glow-section py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">O que a GlowX faz por você</h2>
          <p className="mt-3 text-slate-600">
            Um pacote completo de aquisição e conversão, pensado para clínicas de estética.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.map((s) => (
            <div key={s.id} className="glow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-glow-50 text-2xl">
                {s.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="bg-slate-50 py-16 md:py-24">
        <div className="glow-section grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">{c.differentials.title}</h2>
            <ul className="mt-8 space-y-4">
              {c.differentials.items.map((it) => (
                <li key={it.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-glow-100 text-sm text-glow-700">
                    ✓
                  </span>
                  <span className="text-slate-700">{it.text}</span>
                </li>
              ))}
            </ul>
            <a href="#contato" className="glow-btn mt-8">Quero começar</a>
          </div>
          {c.testimonial.enabled && (
            <figure className="rounded-3xl border border-glow-100 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(168,27,179,0.25)]">
              <div className="text-5xl leading-none text-glow-200">“</div>
              <blockquote className="-mt-4 text-lg font-medium text-slate-800">
                {c.testimonial.quote}
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-bold">{c.testimonial.author}</div>
                <div className="text-sm text-slate-500">{c.testimonial.role}</div>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="glow-section py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <h2 className="text-3xl font-extrabold md:text-4xl">{c.about.title}</h2>
          <div>
            <p className="text-lg text-slate-600">{c.about.text}</p>
            <ul className="mt-6 space-y-3">
              {c.about.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="text-glow-600">★</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FORM / CONTATO */}
      <section id="contato" className="relative overflow-hidden bg-slate-50 py-16 md:py-24">
        <div
          className="absolute -left-20 top-0 -z-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: c.brand.primaryColor }}
        />
        <div className="glow-section grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">{c.form.title}</h2>
            <p className="mt-3 text-lg text-slate-600">{c.form.subtitle}</p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:scale-[1.03]"
            >
              💬 Ou fale direto no WhatsApp
            </a>
          </div>

          <form action={submitLead} className="rounded-3xl border border-glow-100 bg-white p-6 shadow-glow md:p-8">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nome *</label>
                <input name="name" required className="glow-input" placeholder="Seu nome" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
                  <input name="phone" className="glow-input" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
                  <input name="email" type="email" className="glow-input" placeholder="voce@email.com" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tenho interesse em</label>
                <select name="interest" className="glow-input" defaultValue="">
                  <option value="" disabled>Selecione…</option>
                  {c.form.interests.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mensagem (opcional)</label>
                <textarea name="message" rows={3} className="glow-input" placeholder="Conte um pouco sobre a sua clínica" />
              </div>
              <button type="submit" className="glow-btn w-full">{c.form.buttonText}</button>
              <p className="text-center text-xs text-slate-400">
                Seus dados estão seguros. Sem spam, prometido. 🤝
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-glow-100 bg-white">
        <div className="glow-section flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="font-extrabold">
            <span className="bg-gradient-to-r from-glow-700 to-glow-400 bg-clip-text text-transparent">
              {c.brand.name}
            </span>
            <span className="ml-2 text-sm font-normal text-slate-500">{c.footer.text}</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <a href={c.footer.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-glow-600">
              Instagram
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-glow-600">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}