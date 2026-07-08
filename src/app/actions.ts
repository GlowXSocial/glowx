'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from '@/lib/auth';
import { saveContent, type Content } from '@/lib/content';

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

  if (error) {
    console.error('Erro ao salvar lead:', error.message);
    redirect('/?error=1');
  }

  redirect('/obrigado');
}

// -------------------------------------------------------------
// Painel — salvar conteúdo editado
// -------------------------------------------------------------
export async function saveContentAction(content: Content) {
  const ok = await isAuthenticated();
  if (!ok) redirect('/admin/login');

  await saveContent(content);
  revalidatePath('/');
  revalidatePath('/obrigado');
  revalidatePath('/admin/conteudo');
}

// -------------------------------------------------------------
// Painel — atualizar status de um lead / excluir
// -------------------------------------------------------------
export async function updateLeadStatusAction(id: string, status: string) {
  const ok = await isAuthenticated();
  if (!ok) redirect('/admin/login');
  await supabaseAdmin().from('leads').update({ status }).eq('id', id);
  revalidatePath('/admin');
}

export async function deleteLeadAction(id: string) {
  const ok = await isAuthenticated();
  if (!ok) redirect('/admin/login');
  await supabaseAdmin().from('leads').delete().eq('id', id);
  revalidatePath('/admin');
}