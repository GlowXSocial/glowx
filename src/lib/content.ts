import { supabaseAdmin } from './supabase';

export type Service = {
  id: string;
  icon: string; // emoji ou nome de ícone
  title: string;
  description: string;
};

export type Content = {
  brand: {
    name: string;
    tagline: string;
    logoUrl: string; // URL pública do logo; vazio = usa o nome estilizado
    whatsappNumber: string; // ex: 5511999999999
    primaryColor: string; // hex
    accentColor: string; // hex
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string;
  };
  stats: { value: string; label: string }[];
  services: Service[];
  differentials: {
    title: string;
    items: { id: string; text: string }[];
  };
  about: {
    title: string;
    text: string;
    points: string[];
  };
  testimonial: {
    enabled: boolean;
    quote: string;
    author: string;
    role: string;
  };
  form: {
    title: string;
    subtitle: string;
    buttonText: string;
    interests: string[];
  };
  thankYou: {
    title: string;
    subtitle: string;
    whatsappMessage: string;
  };
  footer: {
    text: string;
    instagramUrl: string;
  };
};

export const defaultContent: Content = {
  brand: {
    name: 'GlowX',
    tagline: 'Marketing para Estética',
    logoUrl: '',
    whatsappNumber: '5511999999999',
    primaryColor: '#a81bb3',
    accentColor: '#e065ea',
  },
  hero: {
    badge: 'Marketing para Estética',
    title: 'Transformamos clínicas de estética em',
    highlight: 'máquinas de clientes',
    subtitle:
      'Tráfego pago, automação de WhatsApp, dashboard de conversão e acompanhamento próximo — tudo em um só lugar para lotar a sua agenda.',
    ctaText: 'Quero mais clientes',
    imageUrl:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
  },
  stats: [
    { value: '+3x', label: 'ROI médio em tráfego pago' },
    { value: '24/7', label: 'Atendimento via WhatsApp' },
    { value: '100%', label: 'Dados visíveis no dashboard' },
  ],
  services: [
    {
      id: 'trafego',
      icon: '🎯',
      title: 'Tráfego Pago',
      description:
        'Campanhas no Meta e Google otimizadas para gerar leads qualificados de estética a custo por lead previsível.',
    },
    {
      id: 'whatsapp',
      icon: '💬',
      title: 'Automação de WhatsApp',
      description:
        'Respostas automáticas, triagem e roteamento inteligente de mensagens para nunca perder um lead por demora.',
    },
    {
      id: 'atendimento',
      icon: '🎧',
      title: 'Atendimento',
      description:
        'Atendimento humano e estratégico que converte conversas em agendamentos reais na sua clínica.',
    },
    {
      id: 'dashboard',
      icon: '📊',
      title: 'Dashboard de Dados',
      description:
        'Painel com leads, conversões e métricas em tempo real para decisões baseadas em dado, não em achismo.',
    },
    {
      id: 'direcionamento',
      icon: '🧭',
      title: 'Direcionamento & Acompanhamento',
      description:
        'Estratégia personalizada e acompanhamento contínuo da sua conta, com ajustes constantes de rota.',
    },
    {
      id: 'social',
      icon: '📸',
      title: 'Posts nas Redes Sociais',
      description:
        'Conteúdo planejado para o nicho de estética que gera autoridade e atrai o público certo para você.',
    },
  ],
  differentials: {
    title: 'Por que a GlowX é diferente',
    items: [
      { id: 'd1', text: 'Especialistas exclusivamente no nicho de estética' },
      { id: 'd2', text: 'Acompanhamento próximo — você fala com gente, não robô' },
      { id: 'd3', text: 'Transparência total: todos os dados no seu dashboard' },
      { id: 'd4', text: 'Foco em conversão, não em métrica de vaidade' },
    ],
  },
  about: {
    title: 'Mais que agência, um parceiro de crescimento',
    text: 'A GlowX nasceu para entender o mercado de estética como ninguém. Sabemos a sazonalidade, o ticket médio e os gargalos de cada procedimento — e usamos isso para escalar a sua clínica com previsibilidade.',
    points: [
      'Estratégia sob medida para o seu procedimento-estrela',
      'Relatórios claros sem enrolação técnica',
      'Time que responde no WhatsApp, não em 3 dias úteis',
    ],
  },
  testimonial: {
    enabled: true,
    quote:
      'Em 2 meses com a GlowX, a agenda da clínica lotou. O atendimento via WhatsApp virou uma máquina de agendamento.',
    author: 'Dra. Cliente',
    role: 'Clínica de Estética — São Paulo',
  },
  form: {
    title: 'Vamos lotar a sua agenda?',
    subtitle: 'Preencha abaixo e receba um diagnóstico gratuito da sua captação de clientes.',
    buttonText: 'Quero meu diagnóstico grátis',
    interests: [
      'Tráfego Pago',
      'Automação de WhatsApp',
      'Atendimento',
      'Dashboard de Dados',
      'Direcionamento & Acompanhamento',
      'Posts nas Redes Sociais',
      'Tudo — pacote completo',
    ],
  },
  thankYou: {
    title: 'Recebemos seu contato! 🎉',
    subtitle:
      'Nossa equipe vai analisar e falar com você agora mesmo. Para acelerar, chame a gente no WhatsApp:',
    whatsappMessage:
      'Olá! Acabei de preencher o formulário no site da GlowX e quero meu diagnóstico gratuito. 🌟',
  },
  footer: {
    text: 'GlowX — Marketing para Estética. Sua clínica brilhando.',
    instagramUrl: 'https://instagram.com/glowx_marketing',
  },
};

/** Lê o conteúdo da LP. Se não existir no banco, cria com o padrão. */
export async function getContent(): Promise<Content> {
  let sb;
  try {
    sb = supabaseAdmin();
  } catch {
    // Supabase ainda não configurado (dev local sem .env) — usa padrão
    return defaultContent;
  }

  const { data, error } = await sb
    .from('content')
    .select('data')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error(' getContent: erro ao ler conteúdo — usando padrão:', error.message);
    return defaultContent;
  }

  if (!data || !data.data || Object.keys(data.data).length === 0) {
    // primeira execução: grava o padrão
    await sb.from('content').upsert({ id: 1, data: defaultContent });
    return defaultContent;
  }

  // mescla com o padrão para tolerar campos novos/faltantes
  return {
    ...defaultContent,
    ...(data.data as Content),
    brand: { ...defaultContent.brand, ...(data.data as Content).brand },
    hero: { ...defaultContent.hero, ...(data.data as Content).hero },
    differentials: {
      ...defaultContent.differentials,
      ...(data.data as Content).differentials,
    },
    about: { ...defaultContent.about, ...(data.data as Content).about },
    testimonial: {
      ...defaultContent.testimonial,
      ...(data.data as Content).testimonial,
    },
    form: { ...defaultContent.form, ...(data.data as Content).form },
    thankYou: { ...defaultContent.thankYou, ...(data.data as Content).thankYou },
    footer: { ...defaultContent.footer, ...(data.data as Content).footer },
  };
}

/** Salva o conteúdo editado no painel. */
export async function saveContent(content: Content): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from('content')
    .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });
  if (error) throw error;
}