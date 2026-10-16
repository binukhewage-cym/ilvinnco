'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const loadedAt = useRef(0);

  useEffect(() => { loadedAt.current = Date.now(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('elapsed', String(Date.now() - loadedAt.current));
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/contact.php', { method: 'POST', body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.error || 'Något gick fel.');
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel.');
      setStatus('error');
    }
  }

  return (
    <form className="contact-fields" onSubmit={submit}>
      <div className="field-row">
        <label>Namn<input required name="name" placeholder="Ange ditt namn" autoComplete="name" maxLength={100} /></label>
        <label>E-post<input required name="email" type="email" placeholder="Ange din e-postadress" autoComplete="email" maxLength={200} /></label>
      </div>
      <label>Telefon (valfritt)<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      <label>Meddelande<textarea required name="message" rows={5} placeholder="Skriv ditt meddelande här" minLength={5} maxLength={4000} /></label>
      <input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Skickar…' : 'Skicka min förfrågan'}</button>
      {status === 'sent' && <p className="form-status" role="status">✓ Tack! Ditt meddelande har skickats.</p>}
      {status === 'error' && <p className="form-status form-error" role="alert">{error}</p>}
    </form>
  );
}
