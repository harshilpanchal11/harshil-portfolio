'use client';

import { useState } from 'react';
import { profile } from '@/lib/data';
import { NetworkMesh3D } from './NetworkMesh3D';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Contact section.
 *
 * Submission goes to FormSubmit.co's AJAX endpoint. No backend, no API
 * key, no env vars. The first time a message is sent, FormSubmit emails
 * you a one-time confirmation link to activate the address. After that,
 * messages flow straight to your inbox.
 *
 * Client-side states: idle → submitting → success | error. On success we
 * swap the form for a thank-you message in place.
 */

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'submitting') return;
    setState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio inquiry from ${name || 'someone'}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { success?: string };
      if (data.success !== 'true' && (data as { success?: boolean }).success !== true) {
        throw new Error('Service did not confirm success');
      }
      setState('success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong sending the message. Please email me directly.');
      setState('error');
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="reveal">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted dark:text-muted-dark">
          I would love to hear from you
        </p>
        <h2 className="mt-3 font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
          <span className="reveal-mask block">Contact.</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 items-center">
        <div className="reveal min-h-[460px]">
          {state === 'success' ? (
            <ThankYou />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What's your name?"
                  disabled={state === 'submitting'}
                  className="w-full rounded-lg border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-4 py-3 text-[15px] placeholder-muted/60 dark:placeholder-muted-dark/60 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors disabled:opacity-60"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="What's your email?"
                  disabled={state === 'submitting'}
                  className="w-full rounded-lg border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-4 py-3 text-[15px] placeholder-muted/60 dark:placeholder-muted-dark/60 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors disabled:opacity-60"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What do you want to say?"
                  disabled={state === 'submitting'}
                  className="w-full rounded-lg border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-4 py-3 text-[15px] placeholder-muted/60 dark:placeholder-muted-dark/60 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors resize-none disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="inline-flex items-center gap-2 rounded-full bg-ink dark:bg-accent-dark text-bg dark:text-bg-dark px-6 py-3 text-sm font-medium hover:bg-accent dark:hover:bg-ink-dark dark:hover:text-ink-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state === 'submitting' ? 'Sending…' : 'Send message'}
                <Send className="h-4 w-4" aria-hidden />
              </button>

              {state === 'error' && (
                <p className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
                  <span>{errorMsg}</span>
                </p>
              )}
            </form>
          )}
        </div>

        <div className="reveal relative">
          <NetworkMesh3D />
        </div>
      </div>
    </section>
  );
}

function ThankYou() {
  return (
    <div className="rounded-2xl border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur p-8 md:p-10">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ok/15 dark:bg-ok-dark/15 text-ok dark:text-ok-dark mb-5">
        <CheckCircle2 className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
        Thank you for your message.
      </h3>
      <p className="mt-3 text-base leading-relaxed text-muted dark:text-muted-dark">
        I will try to get back soon!
      </p>
    </div>
  );
}
