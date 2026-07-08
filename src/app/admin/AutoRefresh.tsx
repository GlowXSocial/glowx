'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Atualiza o painel sozinho: chama router.refresh() num intervalo,
 * re-buscando os dados no servidor (sem recarregar a página toda).
 * Pausa quando a aba está em segundo plano pra não bater no banco à toa.
 */
export default function AutoRefresh({ intervalMs = 10000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [last, setLast] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    setLast(new Date());
    window.setTimeout(() => setRefreshing(false), 600);
  }, [router]);

  useEffect(() => {
    setLast(new Date());
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      id = setInterval(refresh, intervalMs);
    };
    const stop = () => id && clearInterval(id);
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        refresh();
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) start();
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, refresh]);

  const hhmmss = last
    ? last.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <button
        onClick={refresh}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-600 hover:border-glow-300 hover:text-glow-600"
      >
        <span className={refreshing ? 'animate-spin' : ''}>↻</span> Atualizar agora
      </button>
      <span>
        {refreshing ? 'Atualizando…' : `Atualizado ${hhmmss}`} · a cada {Math.round(intervalMs / 1000)}s
      </span>
    </div>
  );
}