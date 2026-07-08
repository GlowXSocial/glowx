import { supabaseAdmin } from '@/lib/supabase';
import { updateLeadStatusAction, deleteLeadAction } from '@/app/actions';
import LeadRow from './LeadRow';

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

const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-glow-100 text-glow-700',
  contato: 'bg-blue-100 text-blue-700',
  convertido: 'bg-green-100 text-green-700',
  perdido: 'bg-slate-200 text-slate-600',
};

export default async function Dashboard() {
  let sb;
  let leads: Lead[] = [];
  let total = 0;
  let convertidos = 0;
  let dbOk = true;

  try {
    sb = supabaseAdmin();
    const [r1, r2, r3] = await Promise.all([
      sb.from('leads').select('*').order('created_at', { ascending: false }).limit(500),
      sb.from('leads').select('*', { count: 'exact', head: true }),
      sb
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'convertido'),
    ]);
    leads = (r1.data || []) as Lead[];
    total = r2.count || 0;
    convertidos = r3.count || 0;
  } catch (e: any) {
    dbOk = false;
    console.error('Dashboard: banco indisponível:', e?.message);
  }

  const list = leads;

  // leads por serviço de interesse
  const byInterest = list.reduce<Record<string, number>>((acc, l) => {
    const k = l.interest || 'Não informado';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const maxInterest = Math.max(1, ...Object.values(byInterest));

  // últimos 7 dias
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = list.filter((l) => l.created_at.slice(0, 10) === key).length;
    days.push({
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      count,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  const taxa = total ? Math.round(((convertidos || 0) / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-slate-500">Acompanhe leads e conversão da sua LP.</p>
      </div>

      {!dbOk && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          ⚠️ Banco de dados ainda não conectado. Configure as variáveis do Supabase e rode o
          <code className="mx-1 rounded bg-amber-100 px-1">supabase/schema.sql</code> no seu projeto para começar a capturar leads.
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Leads totais" value={total || 0} accent />
        <Kpi label="Convertidos" value={convertidos || 0} />
        <Kpi label="Taxa de conversão" value={`${taxa}%`} />
        <Kpi label="Últimos 7 dias" value={days.reduce((s, d) => s + d.count, 0)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico simples 7 dias */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-bold">Leads nos últimos 7 dias</h2>
          <div className="flex h-44 items-end gap-2">
            {days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-glow-600 to-glow-400"
                  style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: '4px' }}
                  title={`${d.count} leads`}
                />
                <span className="text-[10px] text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Por interesse */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-bold">Leads por serviço</h2>
          <div className="space-y-3">
            {Object.entries(byInterest).length === 0 && (
              <p className="text-sm text-slate-400">Sem leads ainda.</p>
            )}
            {Object.entries(byInterest)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-glow-600 to-glow-400"
                      style={{ width: `${(v / maxInterest) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tabela de leads */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-bold">Leads recentes</h2>
        </div>
        {list.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            Nenhum lead ainda. Quando alguém preencher o formulário, aparece aqui. ✨
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {list.map((l) => (
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

function Kpi({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? 'border-glow-200 bg-glow-50' : 'border-slate-200 bg-white'}`}>
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${accent ? 'text-glow-700' : ''}`}>{value}</div>
    </div>
  );
}