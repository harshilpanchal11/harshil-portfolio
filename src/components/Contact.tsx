'use client';

import { useState } from 'react';
import { profile } from '@/lib/data';
import { NetworkMesh3D } from './NetworkMesh3D';
import { Send } from 'lucide-react';

/**
 * Contact section: large editorial heading, an inline form on the left,
 * and the 3D network mesh on the right. The form opens a `mailto:` with
 * the user's content prefilled — no backend needed.
 */
export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'someone'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
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
        <form onSubmit={handleSubmit} className="reveal space-y-5">
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
              className="w-full rounded-lg border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-4 py-3 text-[15px] placeholder-muted/60 dark:placeholder-muted-dark/60 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors"
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
              className="w-full rounded-lg border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-4 py-3 text-[15px] placeholder-muted/60 dark:placeholder-muted-dark/60 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors"
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
              className="w-full rounded-lg border border-hairline dark:border-hairline-dark bg-bg/70 dark:bg-bg-dark-elevated/70 backdrop-blur px-4 py-3 text-[15px] placeholder-muted/60 dark:placeholder-muted-dark/60 focus:outline-none focus:border-accent dark:focus:border-accent-dark transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink dark:bg-accent-dark text-bg dark:text-bg-dark px-6 py-3 text-sm font-medium hover:bg-accent dark:hover:bg-ink-dark dark:hover:text-ink-dark transition-colors"
          >
            Send message
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </form>

        <div className="reveal relative">
          <NetworkMesh3D />
        </div>
      </div>
    </section>
  );
}
