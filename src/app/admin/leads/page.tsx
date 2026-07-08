import { supabaseAdmin } from '@/lib/supabase';
import { updateLeadStatusAction, deleteLeadAction } from '@/app/actions';
import LeadRow from '../LeadRow';
import AutoRefresh from '../AutoRefresh';

export const dynamic = 'force-dynamic';

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ['novo', 'contato', 'convertido', 'perdido'] as const;
const STATUS_LABEL: Record<string, string> = {
  novo: 'Novo',
  contato: 'Em contato',
  convertido: 'Convertido',
  perdido: 'Perdido',
};
const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-glow-100 text-glow-700',
  contato: 'bg-blue-100 text-blue-700',
  convertido: 'bg-green-100 text-green-700',
  perdido: 'bg-slate-200 text-slate-600',
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  let leads: Lead[] = [];
  let counts: Record<string, number> = { novo: 0, contato: 0, convertido: 0, perdido: 0 };
  let total = 0;
  let dbOk = true;

  try {
    const sb = supabaseAdmin();
    const filter = searchParams.status && STATUSES.includes(searchParams.status as any)
      ? (searchParams.status as string)
      : null;

    const listQ = sb.from('leads').select('*').order('created_at', { ascending: false }).limit(1000);
    if (filter) listQ.eq('status', filter);
    const { data, error } = await listQ;
    if (error) throw error;
    leads = (data || []) as Lead[];

    const { count: totalAll } = await sb
      .from('leads')
      .select('*', { count: 'exact', head: true });
    total = totalAll || 0;

    // contagens por status (uma query por status é simples e suficiente aqui)
    await Promise.all(
      STATUSES.map(async (s) => {
        const { count } = await sb
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', s);
        counts[s] = count || 0;
      }),
    );
  } catch (e: any) {
    dbOk = false;
    console.error('Leads: banco indisponível:', e?.message);
  }

  const active = searchParams.status || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Leads</h1>
        <p className="text-sm text-slate-500">
          Todos os leads capturados pela LP. {total > 0 && <span>{total} no total.</span>}
        </p>
      </div>

      <AutoRefresh />

      {!dbOk && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          ⚠️ Banco de dados indisponível. Verifique as variáveis do Supabase (a project pode ter
          pausado no free tier — ative de novo no painel do Supabase).
        </div>
      )}

      {/* Filtros por status */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="Todos" count={total} active={active === ''} href="/admin/leads" />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABEL[s]}
            count={counts[s]}
            active={active === s}
            href={`/admin/leads?status=${s}`}
          />
        ))}
      </div>

      {/* Lista */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {leads.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            Nenhum lead {active ? `com status "${STATUS_LABEL[active] || active}"` : 'ainda'}.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((l) => (
              <LeadRow
                key={l.id}
                lead={l}
                statusColor={STATUS_COLORS[l.status] || STATUS_COLORS.novo}
                onStatus={updateLeadStatusAction}
                onDelete={deleteLeadAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  href,
}: {
  label: string;
  count: number;
  active: boolean;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-glow-300 bg-glow-50 text-glow-700'
          : 'border-slate-200 bg-white text-slate-600 hover:border-glow-300 hover:text-glow-700'
      }`}
    >
      {label} <span className="text-xs text-slate-400">{count}</span>
    </a>
  );
}