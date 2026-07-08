import { getContent } from '@/lib/content';
import { isSupabaseConfigured } from '@/lib/supabase';
import ContentEditor from './ContentEditor';

export const dynamic = 'force-dynamic';

export default async function ConteudoPage() {
  const content = await getContent();
  return <ContentEditor initial={content} dbConfigured={isSupabaseConfigured()} />;
}