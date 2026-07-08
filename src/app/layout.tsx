import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GlowX — Marketing para Estética',
  description:
    'Tráfego pago, automação de WhatsApp, dashboard de conversão e acompanhamento próximo para lotar a agenda da sua clínica de estética.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">{children}</body>
    </html>
  );
}