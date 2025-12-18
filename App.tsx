import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { SlideDeck } from './components/SlideDeck';
import { fetchThreadSlides } from './services/nostrService';
import { type SlideData, AppState, type Language } from './types';
import { translations } from './translations';
import { Icons } from './constants';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [lang, setLang] = useState<Language>('ja');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const t = translations[lang];

  const isHistorySupported = () => {
    try {
      return (
        window.location.protocol !== 'blob:' &&
        window.history &&
        !!window.history.pushState
      );
    } catch {
      return false;
    }
  };

  const handleFetchThread = async (input: string) => {
    setAppState(AppState.LOADING);
    setError('');
    setCurrentId(input);

    if (isHistorySupported()) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('id', input);
        window.history.pushState({ id: input }, '', url.toString());
      } catch (e) {
        console.warn('NostrSlide: URL state update suppressed.', e);
      }
    }

    try {
      const fetchedSlides = await fetchThreadSlides(input, (count) => {
        setLoadingProgress(count); // Update progress count
      });

      if (fetchedSlides.length === 0) {
        throw new Error(t.errors.noImages);
      }

      setSlides(fetchedSlides);
      setAppState(AppState.READY);
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errors.fetchFailed);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    if (isHistorySupported()) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('id');
        window.history.pushState({}, '', url.toString());
      } catch (e) {
        // Silent fail
      }
    }

    setAppState(AppState.IDLE);
    setSlides([]);
    setCurrentId('');
    setError('');
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const langParam = params.get('lang') as Language;

      if (langParam && (langParam === 'ja' || langParam === 'en')) {
        setLang(langParam);
      }

      if (id) {
        handleFetchThread(id);
      }
    } catch (e) {
      console.warn('NostrSlide: Could not read URL parameters.', e);
    }
  }, []);

  return (
    <div className="font-sans">
      {appState === AppState.READY && slides.length > 0 ? (
        <SlideDeck
          slides={slides}
          onBack={handleReset}
          nostrId={currentId}
          lang={lang}
        />
      ) : appState === AppState.LOADING && currentId ? (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-nostr-dark text-white p-6 relative overflow-hidden">
          <div
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nostr-primary/10 blur-[120px] rounded-full"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-lg text-center space-y-10 animate-fade-in">
            <div className="space-y-8">
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-nostr-primary to-fuchsia-500 animate-pulse shadow-2xl shadow-nostr-primary/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white scale-[1.8] animate-spin-slow">
                    <Icons.Zap />
                  </span>
                </div>
              </div>
              <p className="text-xl text-white font-medium">
                {t.loading.fetchingSlides}
                {loadingProgress > 0 && ` (${loadingProgress})`}
              </p>
              <div className="h-2 bg-white/10 rounded-full max-w-md mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-nostr-primary to-fuchsia-500 animate-progress"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <InputForm
          onSubmit={handleFetchThread}
          isLoading={appState === AppState.LOADING}
          error={error}
          lang={lang}
          setLang={setLang}
        />
      )}
    </div>
  );
}

export default App;
