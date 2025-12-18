import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { Language } from '../types';
import { translations } from '../translations';

interface InputFormProps {
  onSubmit: (id: string) => void;
  isLoading: boolean;
  error?: string;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, error, lang, setLang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const clientLinks = [
    { name: 'Damus', platform: 'iOS', url: 'https://apps.apple.com/jp/app/damus/id1628663131', icon: <Icons.Share /> },
    { name: 'Amethyst', platform: 'Android', url: 'https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst', icon: <Icons.Play /> },
    { name: 'Nostter', platform: 'Web', url: 'https://nostter.app/', icon: <Icons.Maximize /> }
  ];

  const LanguageSwitcher = () => (
    <div className="flex bg-white/10 rounded-full p-1 border border-white/10 backdrop-blur-sm shadow-xl">
      <button 
        onClick={() => setLang('ja')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'ja' ? 'bg-nostr-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
      >
        JA
      </button>
      <button 
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'en' ? 'bg-nostr-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  );

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-nostr-dark text-white p-6 relative overflow-hidden">
      {/* Language Switcher (Floating Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nostr-primary/10 blur-[120px] rounded-full" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg text-center space-y-10 animate-fade-in">
        <header className="space-y-6">
          <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-nostr-primary to-fuchsia-500 shadow-2xl shadow-nostr-primary/30 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
             <span className="text-white scale-[1.8]"><Icons.Zap /></span>
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 sm:text-7xl">
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-md mx-auto leading-relaxed whitespace-pre-line">
              {t.hero.subtitle}
            </p>
          </div>
        </header>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative inline-flex items-center justify-center px-10 py-6 text-xl font-bold rounded-full text-white bg-gradient-to-r from-nostr-primary to-fuchsia-600 shadow-2xl shadow-nostr-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-nostr-primary/60 focus:ring-4 focus:ring-white/20"
          aria-haspopup="dialog"
        >
          <span className="mr-3 scale-110"><Icons.Play /></span>
          {t.hero.cta}
        </button>

        <footer className="pt-12">
           <p className="text-gray-600 text-xs italic opacity-60">
             {t.hero.tagline}
           </p>
        </footer>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div 
            ref={modalRef}
            className="relative w-full max-w-2xl bg-nostr-surface border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in"
          >
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5">
              <h2 id="modal-title" className="text-2xl font-bold flex items-center gap-3">
                <span className="text-nostr-secondary"><Icons.Zap /></span>
                {t.modal.title}
              </h2>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition focus:ring-2 focus:ring-white"
                  aria-label={t.modal.close}
                >
                  <Icons.X aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 custom-scrollbar">
              <section className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label htmlFor="note-id-modal" className="text-xs font-bold text-nostr-secondary uppercase tracking-[0.2em] ml-1">
                      {t.modal.label}
                    </label>
                    <input
                      ref={inputRef}
                      id="note-id-modal"
                      type="text"
                      required
                      disabled={isLoading}
                      className="appearance-none rounded-2xl relative block w-full px-6 py-5 border border-white/10 placeholder-gray-600 text-white bg-black/40 focus:outline-none focus:ring-4 focus:ring-nostr-primary/40 focus:border-nostr-primary transition-all text-lg"
                      placeholder={t.modal.placeholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue}
                    className={`group relative w-full flex justify-center py-5 px-6 text-lg font-bold rounded-2xl text-white shadow-xl transition-all duration-300 ${
                      isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-nostr-primary to-fuchsia-600 hover:brightness-110 active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? t.modal.loading : t.modal.submit}
                  </button>
                  <div aria-live="polite">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-4 rounded-xl flex items-center gap-3">
                        <Icons.X aria-hidden="true" /> {error}
                      </div>
                    )}
                  </div>
                </form>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-300">
                  <Icons.Info aria-hidden="true" /> {t.modal.guide}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {t.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-5 p-5 bg-white/5 border border-white/5 rounded-2xl items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-nostr-primary/20 text-nostr-primary flex items-center justify-center font-black" aria-hidden="true">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-white">{step.title}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6 pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-300">
                  <Icons.Grid aria-hidden="true" /> {t.modal.clients}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {clientLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center p-4 bg-black/40 hover:bg-nostr-primary/10 border border-white/5 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-nostr-primary"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-nostr-primary group-hover:bg-nostr-primary/20 transition-all mr-3" aria-hidden="true">
                        {link.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[13px] text-white truncate">{link.name}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">{link.platform}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};