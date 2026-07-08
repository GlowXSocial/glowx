'use client';

import { useEffect } from 'react';

/**
 * Boundary global de erros client-side.
 * Impede a tela branca "Application error: a client-side exception has occurred"
 * e mostra uma mensagem amigável com o detalhe do erro (para depuração) +
 * botões para tentar de novo ou recarregar.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro client-side captado pelo boundary:', error);
  }, [error]);

  return (
    <div className="glow-section min-h-[60vh] py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Algo deu errado 😕</h1>
        <p className="mt-2 text-sm text-slate-500">
          Ocorreu um erro ao renderizar esta tela. Tente novamente — se persistir, recarregue a
          página.
        </p>

        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
          <p className="text-xs text-red-700">
            <strong>Erro:</strong> {error?.message || 'desconhecido'}
          </p>
          {error?.digest && (
            <p className="mt-1 text-[11px] text-red-500">digest: {error.digest}</p>
          )}
          {error?.stack && process.env.NODE_ENV !== 'production' && (
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[11px] text-red-600">
              {error.stack}
            </pre>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => reset()} className="glow-btn">
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-glow-300"
          >
            Recarregar página
          </button>
        </div>
      </div>
    </div>
  );
}