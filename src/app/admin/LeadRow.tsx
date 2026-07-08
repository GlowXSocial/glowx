'use client';

import { useState, useTransition } from 'react';
import type { ActionResult } from '@/app/actions';

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

const STATUSES = ['novo', 'contato', 'convertido', 'perdido'];
const STATUS_LABEL: Record<string, string> = {
  novo: 'Novo',
  contato: 'Em contato',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

export default function LeadRow({
  lead,
  statusColor,
  onStatus,
  onDelete,
}: {
  lead: Lead;
  statusColor: string;
  onStatus: (id: string, status: string) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(lead.status);
  const [error, setError] = useState<string | null>(null);
  const date = new Date(lead.created_at).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const wa = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\D/g, '')}`
    : '#';

  return (
    <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{lead.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
            {STATUS_LABEL[status] || status}
          </span>
        </div>
        <div className="mt-0.5 text-sm text-slate-500">
          {lead.interest && <span>{lead.interest} · </span>}
          {lead.email && <span>{lead.email} · </span>}
          {lead.phone && <span>{lead.phone}</span>}
        </div>
        {lead.message && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">“{lead.message}”</p>
        )}
        <span className="text-xs text-slate-400">{date}</span>
        {error && (
          <p className="mt-1 text-xs text-red-600">⚠️ {error}</p>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {wa !== '#' && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#25D366] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            💬 WhatsApp
          </a>
        )}
        <select
          value={status}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            setStatus(next);
            setError(null);
            startTransition(async () => {
              const res = await onStatus(lead.id, next);
              if (!res?.ok) {
                setStatus(lead.status); // reverte ao valor real salvo
                setError(res?.error || 'Não foi possível atualizar o status.');
              }
            });
          }}
          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <button
          disabled={pending}
          onClick={() => {
            if (confirm('Excluir este lead?')) {
              setError(null);
              startTransition(async () => {
                const res = await onDelete(lead.id);
                if (!res?.ok) setError(res?.error || 'Não foi possível excluir o lead.');
              });
            }
          }}
          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-500 hover:border-red-300 hover:text-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}