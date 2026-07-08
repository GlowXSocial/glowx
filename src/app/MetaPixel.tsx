'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Meta (Facebook) Pixel.
 * - Não carrega nas rotas /admin/* (não polui as métricas com visitas do painel).
 * - Dispara PageView em toda rota pública.
 * - O evento de Lead é disparado no envio do formulário (ver LeadForm).
 */
const META_PIXEL_ID = '3060450310815763';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: unknown;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Exclui o painel admin
    if (pathname?.startsWith('/admin')) return;

    const w = window as Window & typeof globalThis;
    if (!w.fbq) {
      // Base code: cria o stub e enfileira até o fbevents.js carregar
      const n: any = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      n.queue = [];
      n.loaded = false;
      n.version = '2.0';
      n.push = n;
      w.fbq = n;
      w._fbq = n;
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = document.getElementsByTagName('script')[0];
      s?.parentNode?.insertBefore(t, s);
      n('init', META_PIXEL_ID);
    }

    // PageView em toda rota pública (carregamento inicial + navegações SPA)
    w.fbq!('track', 'PageView');
  }, [pathname]);

  // Sem pixel no admin
  if (pathname?.startsWith('/admin')) return null;

  // Fallback <noscript>
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}