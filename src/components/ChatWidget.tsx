import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';
import { INTENTS, FALLBACK, WELCOME, NAV_LINKS, hasSinhala } from '../data/chatResponses';

type Lang = 'en' | 'si';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  quickReplies?: string[];
}

function matchIntent(input: string, lang: Lang): { response: string; quickReplies?: string[] } {
  const lower = input.toLowerCase().trim();
  for (const intent of INTENTS) {
    if (intent.keywords.some(kw => lower.includes(kw))) {
      const response = lang === 'si' && intent.responseSi ? intent.responseSi : intent.response;
      return { response, quickReplies: intent.quickReplies };
    }
  }
  const list = FALLBACK[lang];
  return {
    response: list[Math.floor(Math.random() * list.length)],
    quickReplies: ['Services & pricing', 'Find branch', 'Book appointment', 'Emergency help'],
  };
}

function renderText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-brand-yellow">{part}</strong>
      : part
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isBot = msg.sender === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center text-black text-[10px] font-black mr-2 flex-shrink-0 mt-0.5">
          AT
        </div>
      )}
      <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isBot
          ? 'bg-[#1a1a1a] text-white rounded-tl-sm border border-white/5'
          : 'bg-brand-yellow text-black rounded-tr-sm font-medium'
      }`}>
        {msg.text.split('\n').map((line, i, arr) => (
          <React.Fragment key={i}>
            {renderText(line)}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center text-black text-[10px] font-black mr-2 flex-shrink-0">
        AT
      </div>
      <div className="bg-[#1a1a1a] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#555]"
            style={{ animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [lang, setLang]           = useState<Lang>('en');
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Show welcome on first open
  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true);
      setShowPulse(false);
      setMessages([{
        id: '0',
        sender: 'bot',
        text: WELCOME[lang],
        quickReplies: ['Book appointment', 'Services & pricing', 'Find branch', 'Emergency help'],
      }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // When language toggles, update welcome message if it's the only message
  const switchLang = (l: Lang) => {
    setLang(l);
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === '0') {
        return [{ ...prev[0], text: WELCOME[l] }];
      }
      return prev;
    });
  };

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Auto-detect Sinhala
    const detectedLang: Lang = hasSinhala(trimmed) ? 'si' : lang;
    if (detectedLang !== lang) setLang(detectedLang);

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    const navPath = NAV_LINKS[trimmed];

    setTimeout(() => {
      const { response, quickReplies } = matchIntent(trimmed, detectedLang);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        quickReplies,
      }]);
      if (navPath) setTimeout(() => navigate(navPath), 700);
    }, 700 + Math.random() * 500);
  }, [lang, navigate]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const lastQRs = [...messages].reverse().find(m => m.sender === 'bot' && m.quickReplies)?.quickReplies;

  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%,60%,100% { transform:translateY(0); }
          30%          { transform:translateY(-4px); }
        }
        @keyframes chatUp {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes pulseOut {
          0%   { transform:scale(1); opacity:0.8; }
          100% { transform:scale(1.8); opacity:0; }
        }
        .chat-scrollbar::-webkit-scrollbar { width:4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background:transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background:#222; border-radius:4px; }
      `}</style>

      {/* ── Chat Panel ─────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[9999] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/8"
          style={{
            width: 'min(380px, calc(100vw - 2rem))',
            height: 'min(540px, calc(100vh - 120px))',
            background: '#0a0a0a',
            animation: 'chatUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-white/8" style={{ background: '#111' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-yellow flex items-center justify-center font-black text-black text-sm flex-shrink-0">
                AT
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Anura Tyres Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-[#555] text-[11px]">Online · instant replies</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <div className="flex items-center bg-[#1a1a1a] border border-white/8 rounded-lg overflow-hidden text-[11px] font-bold">
                <button
                  onClick={() => switchLang('en')}
                  className={`px-2.5 py-1.5 transition-colors ${lang === 'en' ? 'bg-brand-yellow text-black' : 'text-[#555] hover:text-white'}`}
                >EN</button>
                <button
                  onClick={() => switchLang('si')}
                  className={`px-2.5 py-1.5 transition-colors ${lang === 'si' ? 'bg-brand-yellow text-black' : 'text-[#555] hover:text-white'}`}
                >සිං</button>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-white/8 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 chat-scrollbar">
            {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
            {isTyping && <Typing />}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          {!isTyping && lastQRs && lastQRs.length > 0 && (
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
              {lastQRs.map(qr => (
                <button key={qr} onClick={() => sendMessage(qr)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full border border-brand-yellow/25 text-brand-yellow text-xs font-semibold hover:bg-brand-yellow/10 transition-colors whitespace-nowrap">
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/8 flex-shrink-0"
            style={{ background: '#111' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={lang === 'si' ? 'පණිවිඩයක් ලියන්න…' : 'Type a message…'}
              className="flex-1 bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-brand-yellow/35 transition-colors"
            />
            <button type="submit" disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center text-black flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-105 transition-all active:scale-95">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ── Floating Button ─────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        className="fixed bottom-6 right-4 sm:right-6 z-[9999] w-14 h-14 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg hover:brightness-105 active:scale-95 transition-all"
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-brand-yellow"
            style={{ animation: 'pulseOut 2s ease-out infinite' }} />
        )}
        {open
          ? <X className="w-6 h-6 text-black relative z-10" />
          : <MessageCircle className="w-6 h-6 text-black relative z-10" />
        }
        {!open && !hasOpened && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black" />
        )}
      </button>
    </>
  );
}
