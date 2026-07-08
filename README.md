# GlowX — LP de alta conversão + Painel

Landing page de alta conversão para a **GlowX Marketing** (Marketing para Estética), com formulário que capta leads, página de obrigado com botão de WhatsApp, e um **painel de controle** onde você edita todo o conteúdo da LP (textos, seções, logo, cores, número de WhatsApp) e acompanha os leads em um dashboard.

**Stack:** Next.js 14 (App Router) + Supabase (PostgreSQL) + Vercel + GitHub.

## ✨ O que tem

- **LP pública** responsiva (celular/desktop) com hero, serviços, diferenciais, sobre, depoimento e formulário.
- **Formulário** que salva o lead no banco e redireciona para a **página de obrigado** com botão de WhatsApp.
- **Painel `/admin`** protegido por senha única:
  - **Dashboard**: total de leads, convertidos, taxa de conversão, gráfico de 7 dias, leads por serviço e lista de leads com status e botão de WhatsApp.
  - **Conteúdo da LP** (`/admin/conteudo`): edita marca (logo, cores, WhatsApp), hero, estatísticas, serviços (adicionar/remover), diferenciais, sobre, depoimento, formulário, página de obrigado e rodapé. Salva e publica na hora.

## 🚀 Rodando local

1. **Instale dependências:**
   ```bash
   npm install
   ```

2. **Configure variáveis de ambiente** — copie e preencha:
   ```bash
   cp .env.local.example .env.local
   ```
   Edite `.env.local` com suas chaves do Supabase e a senha do admin.

3. **Crie o banco no Supabase:**
   - Vá no seu projeto Supabase → **SQL Editor** → cole o conteúdo de `supabase/schema.sql` → **Run**.

4. **Suba o servidor:**
   ```bash
   npm run dev
   ```
   - LP: http://localhost:3000
   - Painel: http://localhost:3000/admin (redireciona para `/admin/login`)

## ☁️ Deploy na Vercel (via GitHub)

1. Crie um repositório no GitHub e suba este projeto:
   ```bash
   git init
   git add .
   git commit -m "GlowX LP + painel"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/glowx.git
   git push -u origin main
   ```
2. No [vercel.com](https://vercel.com) → **Add New… → Project** → importe o repositório.
3. Em **Settings → Environment Variables**, adicione as mesmas variáveis do `.env.local.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
4. **Deploy**. Pronto — a LP fica em `https://<projeto>.vercel.app` e o painel em `/admin`.

> ⚠️ A `SUPABASE_SERVICE_ROLE_KEY` é usada só no servidor (nunca exposta no browser). Não a coloque em nenhum lugar com prefixo `NEXT_PUBLIC_`.

## 🔐 Segurança

- A LP lê o conteúdo e cria leads com a chave anônima (políticas RLS no `schema.sql`).
- O painel usa a **service_role** no servidor e exige login por senha única (`ADMIN_PASSWORD`).
- Middleware bloqueia tudo em `/admin` exceto `/admin/login`.

## 📋 Personalização

Tudo é editável pelo painel — incluindo o **número de WhatsApp** e as **cores** da marca. Para mudar a senha do painel, altere a variável `ADMIN_PASSWORD` na Vercel.