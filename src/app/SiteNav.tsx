'use client';

import { useState } from 'react';

type Props = {
  brandName: string;
  logoUrl?: string;
};

const LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

/**
 * Cabeçalho/navegação da LP. No desktop mostra os links na barra; no mobile
 * mostra um botão hambúrguer que abre o menu (antes os links eram
 * `hidden md:flex` e ficavam inacessíveis no celular).
 */
export default function SiteNav({ brandName, logoUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-glow-100/60 bg-white/80 backdrop-blur">
      <nav className="glow-section flex h-16 items-center justify-between">
        <a href="#topo" className="flex items-center gap-2 font-extrabold">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brandName} className="h-9 w-auto" />
          ) : (
            <span className="text-2xl">
              <span className="bg-gradient-to-r from-glow-700 to-glow-400 bg-clip-text text-transparent">
                {brandName}
              </span>
            </span>
          )}
        </a>

        {/* Links no desktop */}
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-glow-600">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href="#contato" className="glow-btn !px-5 !py-2.5 !text-sm">
            Falar agora
          </a>
          {/* Hambúrguer no mobile */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
          >
            <span className="text-xl leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-glow-100 bg-white md:hidden">
          <div className="glow-section flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-glow-50 hover:text-glow-700"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}