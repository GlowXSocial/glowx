'use client';

import { submitLead } from '@/app/actions';

type Props = {
  buttonText: string;
  interests: string[];
};

/**
 * Formulário de lead da LP.
 * Usa a server action submitLead (que salva o lead e redireciona pra /obrigado)
 * e dispara o evento `Lead` do Meta Pixel no envio válido, antes da action rodar.
 */
export default function LeadForm({ buttonText, interests }: Props) {
  return (
    <form
      action={submitLead}
      onSubmit={() => {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead');
        }
      }}
      className="rounded-3xl border border-glow-100 bg-white p-6 shadow-glow md:p-8"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nome *</label>
          <input name="name" required className="glow-input" placeholder="Seu nome" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
            <input name="phone" className="glow-input" placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
            <input name="email" type="email" className="glow-input" placeholder="voce@email.com" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tenho interesse em</label>
          <select name="interest" className="glow-input" defaultValue="">
            <option value="" disabled>Selecione…</option>
            {interests.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mensagem (opcional)</label>
          <textarea name="message" rows={3} className="glow-input" placeholder="Conte um pouco sobre a sua clínica" />
        </div>
        <button type="submit" className="glow-btn w-full">{buttonText}</button>
        <p className="text-center text-xs text-slate-400">
          Seus dados estão seguros. Sem spam, prometido. 🤝
        </p>
      </div>
    </form>
  );
}