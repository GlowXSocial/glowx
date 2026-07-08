'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase';
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from '@/lib/auth';
import { saveContent, type Content } from '@/lib/content';

/** Resultado padrão das actions de escrita — nunca lançam pra árvore React. */
export type ActionResult = { ok: true } | { ok: false; error: string };

const DB_NOT_CONFIGURED =
  'Banco de dados não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local para persistir as alterações.';

// -------------------------------------------------------------
// Autenticação
// -------------------------------------------------------------
export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') || '');
  if (!verifyPassword(password)) {
    redirect('/admin/login?error=1');
  }
  await createSession();
  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

// -------------------------------------------------------------
// Formulário da LP — captura de lead
// -------------------------------------------------------------
export async function submitLead(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim() || null;
  const phone = String(formData.get('phone') || '').trim() || null;
  const interest = String(formData.get('interest') || '').trim() || null;
  const message = String(formData.get('message') || '').trim() || null;

  if (!name) {
    redirect('/?error=1');
  }

  const hasDb =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (hasDb) {
    // Captura o erro real sem redirecionar dentro do try — o redirect() do Next
    // lança NEXT_REDIRECT, que seria engolido pelo catch e esconderia o erro
    // verdadeiro do banco (causa nº1 de "leads pararam de chegar").
    let insertError: string | null = null;
    try {
      const sb = supabaseAdmin();
      const { error } = await sb.from('leads').insert({
        name,
        email,
        phone,
        interest,
        message,
        source: 'landing-page',
        status: 'novo',
      });
      if (error) insertError = error.message;
    } catch (e: any) {
      insertError = e?.message || String(e);
    }
    if (insertError) {
      console.error('submitLead: erro ao salvar lead:', insertError, {
        name,
        email,
        phone,
        interest,
      });
      redirect('/?error=1');
    }
  } else {
    // Banco ainda não configurado — registra no log para teste local
    console.warn(
      '[modo teste] Lead não persistido (Supabase não configurado):',
      { name, email, phone, interest, message }
    );
  }

  redirect('/obrigado');
}

// -------------------------------------------------------------
// Painel — salvar conteúdo editado
// -------------------------------------------------------------
export async function saveContentAction(content: Content): Promise<ActionResult> {
  const ok = await isAuthenticated();
  if (!ok) redirect('/admin/login');

  if (!isSupabaseConfigured()) return { ok: false, error: DB_NOT_CONFIGURED };

  try {
    await saveContent(content);
  } catch (e: any) {
    console.error('saveContentAction: erro ao salvar conteúdo:', e?.message);
    return { ok: false, error: e?.message || 'Não foi possível salvar o conteúdo.' };
  }

  revalidatePath('/');
  revalidatePath('/obrigado');
  revalidatePath('/admin/conteudo');
  return { ok: true };
}

// -------------------------------------------------------------
// Painel — atualizar status de um lead / excluir
// -------------------------------------------------------------
export async function updateLeadStatusAction(
  id: string,
  status: string,
): Promise<ActionResult> {
  const ok = await isAuthenticated();
  if (!ok) redirect('/admin/login');

  if (!isSupabaseConfigured()) return { ok: false, error: DB_NOT_CONFIGURED };

  try {
    const { error } = await supabaseAdmin()
      .from('leads')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  } catch (e: any) {
    console.error('updateLeadStatusAction: erro ao atualizar lead:', e?.message);
    return { ok: false, error: e?.message || 'Não foi possível atualizar o lead.' };
  }

  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  const ok = await isAuthenticated();
  if (!ok) redirect('/admin/login');

  if (!isSupabaseConfigured()) return { ok: false, error: DB_NOT_CONFIGURED };

  try {
    const { error } = await supabaseAdmin().from('leads').delete().eq('id', id);
    if (error) throw error;
  } catch (e: any) {
    console.error('deleteLeadAction: erro ao excluir lead:', e?.message);
    return { ok: false, error: e?.message || 'Não foi possível excluir o lead.' };
  }

  revalidatePath('/admin');
  return { ok: true };
}