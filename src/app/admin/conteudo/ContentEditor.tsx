'use client';

import { useState, useTransition } from 'react';
import type { Content, Service } from '@/lib/content';
import { saveContentAction, type ActionResult } from '@/app/actions';

type Props = { initial: Content; dbConfigured?: boolean };
type Path = (string | number)[];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Atualiza um campo aninhado passando o caminho explícito (ex.: ['brand','name']). */
function patch<T>(state: T, path: Path, value: unknown): T {
  const next: any = structuredClone(state);
  let obj: any = next;
  for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
  obj[path[path.length - 1]] = value;
  return next;
}

export default function ContentEditor({ initial, dbConfigured = true }: Props) {
  const [c, setC] = useState<Content>(initial);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (path: Path, value: unknown) => {
    setC((prev) => patch(prev, path, value));
    setSaved(false);
  };

  const save = () => {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res: ActionResult = await saveContentAction(c);
      if (res?.ok) {
        setSaved(true);
      } else {
        setError(res?.error || 'Não foi possível salvar.');
      }
    });
  };

  // helpers específicos
  const updateService = (i: number, p: Partial<Service>) =>
    setC((prev) => {
      const arr = [...prev.services];
      arr[i] = { ...arr[i], ...p };
      return { ...prev, services: arr };
    });
  const addService = () =>
    setC((prev) => ({
      ...prev,
      services: [...prev.services, { id: uid(), icon: '✨', title: 'Novo serviço', description: 'Descrição do serviço.' }],
    }));
  const removeService = (i: number) =>
    setC((prev) => ({ ...prev, services: prev.services.filter((_, j) => j !== i) }));

  const removeDiff = (i: number) =>
    setC((prev) => ({ ...prev, differentials: { ...prev.differentials, items: prev.differentials.items.filter((_, j) => j !== i) } }));
  const addDiff = () =>
    setC((prev) => ({ ...prev, differentials: { ...prev.differentials, items: [...prev.differentials.items, { id: uid(), text: 'Novo diferencial' }] } }));

  const removePoint = (i: number) =>
    setC((prev) => ({ ...prev, about: { ...prev.about, points: prev.about.points.filter((_, j) => j !== i) } }));
  const addPoint = () =>
    setC((prev) => ({ ...prev, about: { ...prev.about, points: [...prev.about.points, 'Novo ponto'] } }));

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Conteúdo da Landing Page</h1>
          <p className="text-sm text-slate-500">
            Edite os textos, cores, logo e WhatsApp. As mudanças refletem na LP na hora.
          </p>
        </div>
        <button onClick={save} disabled={pending} className="glow-btn">
          {pending ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </div>

      {saved && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          ✓ Conteúdo salvo e publicado.
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {!dbConfigured && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          ⚠️ Banco de dados não configurado. As edições não serão persistidas — defina as
          variáveis do Supabase no <code className="mx-1 rounded bg-amber-100 px-1">.env.local</code>.
        </div>
      )}

      {/* MARCA */}
      <Section title="Marca & contato" desc="Nome, logo, número de WhatsApp e cores usadas em toda a LP.">
        <Field label="Nome da marca">
          <input className="admin-input" value={c.brand.name} onChange={(e) => update(['brand', 'name'], e.target.value)} />
        </Field>
        <Field label="Tagline (frase curta)">
          <input className="admin-input" value={c.brand.tagline} onChange={(e) => update(['brand', 'tagline'], e.target.value)} />
        </Field>
        <Field label="URL do logo (deixe vazio para usar o nome estilizado)">
          <input className="admin-input" value={c.brand.logoUrl} onChange={(e) => update(['brand', 'logoUrl'], e.target.value)} placeholder="https://…/logo.png" />
        </Field>
        <Field label="Número de WhatsApp (com DDI e DDD, só números)">
          <input className="admin-input" value={c.brand.whatsappNumber} onChange={(e) => update(['brand', 'whatsappNumber'], e.target.value)} placeholder="5511999999999" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Cor principal">
            <div className="flex items-center gap-2">
              <input type="color" value={c.brand.primaryColor} onChange={(e) => update(['brand', 'primaryColor'], e.target.value)} className="h-10 w-12 rounded border border-slate-200" />
              <input className="admin-input" value={c.brand.primaryColor} onChange={(e) => update(['brand', 'primaryColor'], e.target.value)} />
            </div>
          </Field>
          <Field label="Cor de destaque">
            <div className="flex items-center gap-2">
              <input type="color" value={c.brand.accentColor} onChange={(e) => update(['brand', 'accentColor'], e.target.value)} className="h-10 w-12 rounded border border-slate-200" />
              <input className="admin-input" value={c.brand.accentColor} onChange={(e) => update(['brand', 'accentColor'], e.target.value)} />
            </div>
          </Field>
        </div>
      </Section>

      {/* HERO */}
      <Section title="Topo (Hero)" desc="A primeira seção que o visitante vê.">
        <Field label="Badge (etiqueta superior)">
          <input className="admin-input" value={c.hero.badge} onChange={(e) => update(['hero', 'badge'], e.target.value)} />
        </Field>
        <Field label="Título (parte fixa)">
          <input className="admin-input" value={c.hero.title} onChange={(e) => update(['hero', 'title'], e.target.value)} />
        </Field>
        <Field label="Destaque do título (texto colorido)">
          <input className="admin-input" value={c.hero.highlight} onChange={(e) => update(['hero', 'highlight'], e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <textarea rows={3} className="admin-input" value={c.hero.subtitle} onChange={(e) => update(['hero', 'subtitle'], e.target.value)} />
        </Field>
        <Field label="Texto do botão principal">
          <input className="admin-input" value={c.hero.ctaText} onChange={(e) => update(['hero', 'ctaText'], e.target.value)} />
        </Field>
        <Field label="URL da imagem do topo">
          <input className="admin-input" value={c.hero.imageUrl} onChange={(e) => update(['hero', 'imageUrl'], e.target.value)} placeholder="https://…" />
        </Field>

        <div className="border-t border-slate-100 pt-4">
          <div className="mb-2 text-sm font-semibold text-slate-700">Estatísticas (3)</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {c.stats.map((st, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3">
                <input
                  className="admin-input mb-2 font-bold"
                  value={st.value}
                  onChange={(e) => update(['stats', i, 'value'], e.target.value)}
                />
                <input
                  className="admin-input text-xs"
                  value={st.label}
                  onChange={(e) => update(['stats', i, 'label'], e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVIÇOS */}
      <Section title="Serviços" desc="Cards de serviços exibidos na LP. Adicione, edite ou remova.">
        <div className="space-y-3">
          {c.services.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <input
                  className="admin-input w-16 text-center text-2xl"
                  value={s.icon}
                  title="Emoji/ícone"
                  onChange={(e) => updateService(i, { icon: e.target.value })}
                />
                <input
                  className="admin-input font-bold"
                  value={s.title}
                  placeholder="Título"
                  onChange={(e) => updateService(i, { title: e.target.value })}
                />
                <button
                  onClick={() => removeService(i)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:border-red-300 hover:text-red-600"
                >
                  Remover
                </button>
              </div>
              <textarea
                rows={2}
                className="admin-input mt-3"
                value={s.description}
                placeholder="Descrição"
                onChange={(e) => updateService(i, { description: e.target.value })}
              />
            </div>
          ))}
          <button
            onClick={addService}
            className="rounded-lg border border-dashed border-glow-300 px-4 py-2 text-sm font-medium text-glow-700 hover:bg-glow-50"
          >
            + Adicionar serviço
          </button>
        </div>
      </Section>

      {/* DIFERENCIAIS */}
      <Section title="Diferenciais" desc="Lista de pontos fortes e o título da seção.">
        <Field label="Título da seção">
          <input className="admin-input" value={c.differentials.title} onChange={(e) => update(['differentials', 'title'], e.target.value)} />
        </Field>
        <div className="space-y-2">
          {c.differentials.items.map((it, i) => (
            <div key={it.id} className="flex gap-2">
              <input
                className="admin-input"
                value={it.text}
                onChange={(e) => update(['differentials', 'items', i, 'text'], e.target.value)}
              />
              <button
                onClick={() => removeDiff(i)}
                className="rounded-lg border border-slate-200 px-3 text-slate-500 hover:border-red-300 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addDiff}
            className="rounded-lg border border-dashed border-glow-300 px-4 py-2 text-sm font-medium text-glow-700 hover:bg-glow-50"
          >
            + Adicionar
          </button>
        </div>
      </Section>

      {/* SOBRE */}
      <Section title="Sobre" desc="Seção institucional.">
        <Field label="Título">
          <input className="admin-input" value={c.about.title} onChange={(e) => update(['about', 'title'], e.target.value)} />
        </Field>
        <Field label="Texto">
          <textarea rows={4} className="admin-input" value={c.about.text} onChange={(e) => update(['about', 'text'], e.target.value)} />
        </Field>
        <div className="space-y-2">
          {c.about.points.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="admin-input"
                value={p}
                onChange={(e) => update(['about', 'points', i], e.target.value)}
              />
              <button
                onClick={() => removePoint(i)}
                className="rounded-lg border border-slate-200 px-3 text-slate-500 hover:border-red-300 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addPoint}
            className="rounded-lg border border-dashed border-glow-300 px-4 py-2 text-sm font-medium text-glow-700 hover:bg-glow-50"
          >
            + Adicionar ponto
          </button>
        </div>
      </Section>

      {/* DEPOIMENTO */}
      <Section title="Depoimento" desc="Card de prova social (opcional).">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={c.testimonial.enabled}
            onChange={(e) => update(['testimonial', 'enabled'], e.target.checked)}
          />{' '}
          Exibir depoimento
        </label>
        <Field label="Frase">
          <textarea rows={3} className="admin-input" value={c.testimonial.quote} onChange={(e) => update(['testimonial', 'quote'], e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Autor">
            <input className="admin-input" value={c.testimonial.author} onChange={(e) => update(['testimonial', 'author'], e.target.value)} />
          </Field>
          <Field label="Cargo / empresa">
            <input className="admin-input" value={c.testimonial.role} onChange={(e) => update(['testimonial', 'role'], e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* FORMULÁRIO */}
      <Section title="Formulário" desc="Textos do formulário e opções de interesse.">
        <Field label="Título">
          <input className="admin-input" value={c.form.title} onChange={(e) => update(['form', 'title'], e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <input className="admin-input" value={c.form.subtitle} onChange={(e) => update(['form', 'subtitle'], e.target.value)} />
        </Field>
        <Field label="Texto do botão">
          <input className="admin-input" value={c.form.buttonText} onChange={(e) => update(['form', 'buttonText'], e.target.value)} />
        </Field>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">Opções de interesse (uma por linha)</div>
          <textarea
            rows={5}
            className="admin-input"
            value={c.form.interests.join('\n')}
            onChange={(e) =>
              update(
                ['form', 'interests'],
                e.target.value.split('\n').map((x) => x.trim()).filter(Boolean)
              )
            }
          />
        </div>
      </Section>

      {/* OBRIGADO */}
      <Section title="Página de obrigado" desc="Mensagem e botão de WhatsApp após o envio.">
        <Field label="Título">
          <input className="admin-input" value={c.thankYou.title} onChange={(e) => update(['thankYou', 'title'], e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <textarea rows={2} className="admin-input" value={c.thankYou.subtitle} onChange={(e) => update(['thankYou', 'subtitle'], e.target.value)} />
        </Field>
        <Field label="Mensagem do WhatsApp (texto que abre no botão)">
          <textarea rows={2} className="admin-input" value={c.thankYou.whatsappMessage} onChange={(e) => update(['thankYou', 'whatsappMessage'], e.target.value)} />
        </Field>
      </Section>

      {/* RODAPÉ */}
      <Section title="Rodapé" desc="Texto final e link do Instagram.">
        <Field label="Texto">
          <input className="admin-input" value={c.footer.text} onChange={(e) => update(['footer', 'text'], e.target.value)} />
        </Field>
        <Field label="URL do Instagram">
          <input className="admin-input" value={c.footer.instagramUrl} onChange={(e) => update(['footer', 'instagramUrl'], e.target.value)} />
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-5 border-t border-slate-200 bg-white/90 px-5 py-3 backdrop-blur">
        <div className="flex justify-end">
          <button onClick={save} disabled={pending} className="glow-btn">
            {pending ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {desc && <p className="mb-4 text-sm text-slate-500">{desc}</p>}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}