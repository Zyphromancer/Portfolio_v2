'use client';

import { useEffect, useRef, useState } from 'react';
import { streamChat } from '@/app/actions/chat';

const suggestions = [
  "What's Jesse's strongest skill?",
  'Has Jesse worked with AI before?',
  'Is Jesse available for freelance?',
  'What makes Jesse different from other devs?',
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ContactSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const count = sessionStorage.getItem('chatMessageCount');
    setMessageCount(count ? parseInt(count) : 0);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || messageCount >= 10) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';
    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const generator = streamChat(text);
      for await (const chunk of generator) {
        assistantContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      }

      const newCount = messageCount + 1;
      setMessageCount(newCount);
      sessionStorage.setItem('chatMessageCount', newCount.toString());
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        };
        return updated;
      });
    }

    setIsLoading(false);
  };

  const canChat = messageCount < 10;

  return (
    <section className="relative w-full bg-background py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {/* Headline */}
        <h2 className="font-cormorant font-light text-5xl md:text-6xl text-gold text-center mb-4">
          Let's Connect
        </h2>
        <p className="font-inter text-text-muted text-center mb-12 max-w-xl mx-auto">
          Have a project in mind? Let's talk about how I can help bring your vision to life.
        </p>

        {/* Terminal Chat UI */}
        <div className="bg-black border border-gold-subtle rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-surface px-6 py-4 border-b border-gold-subtle flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
            <span className="font-mono text-xs text-gold">LIVE</span>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-80 overflow-y-auto p-6 bg-black space-y-4 font-mono text-sm"
          >
            {messages.length === 0 && (
              <div className="text-text-muted">
                <p>Welcome. Ask me anything about Jesse.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                <p className={msg.role === 'user' ? 'text-text' : 'text-gold'}>
                  {msg.role === 'user' ? '> ' : '◆ '}{msg.content}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="text-gold animate-pulse">
                <span>◆ </span>
                <span className="inline-block w-2 h-2 bg-gold ml-1" />
              </div>
            )}
          </div>

          {/* Suggestions or Input */}
          {messages.length === 0 ? (
            <div className="p-6 bg-black border-t border-gold-subtle space-y-3">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={!canChat}
                  className="block w-full text-left px-4 py-2 bg-surface hover:bg-bronze-brown disabled:opacity-50 disabled:cursor-not-allowed border border-gold-subtle hover:border-gold transition-colors font-mono text-sm text-gold-glow"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-black border-t border-gold-subtle flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && canChat) handleSendMessage(input);
                }}
                disabled={!canChat || isLoading}
                placeholder={canChat ? 'Ask something...' : 'Chat limit reached'}
                className="flex-1 bg-black text-gold placeholder-text-muted font-mono text-sm outline-none border-b border-gold-subtle focus:border-gold pb-1 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!canChat || isLoading}
                className="text-gold hover:text-gold-glow disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              >
                →
              </button>
            </div>
          )}

          {/* Message count */}
          {canChat && (
            <div className="px-6 py-2 bg-surface border-t border-gold-subtle text-xs text-text-muted font-mono">
              {messageCount}/10 messages
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-8 mt-12">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-glow transition-colors"
            title="LinkedIn"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 0H4C1.8 0 0 1.8 0 4v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zM8 20H5V8h3v12zm-1.5-13.7c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zM21 20h-3v-6.5c0-1-.3-2.5-1.5-2.5-1 0-1.5.8-1.5 1.8V20h-3V8h3v1.3c.5-.7 1.5-1.5 2.8-1.5 2.8 0 3.3 1.8 3.3 3.8V20z" />
            </svg>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-glow transition-colors"
            title="GitHub"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.4 18.6 0 12 0z" />
            </svg>
          </a>
          <a
            href="mailto:jesse@example.com"
            className="text-gold hover:text-gold-glow transition-colors"
            title="Email"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
