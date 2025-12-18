import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { SlideDeck } from './components/SlideDeck';
import { fetchThreadSlides } from './services/nostrService';
import { SlideData, AppState, Language } from './types';
import { translations } from './translations';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [lang, setLang] = useState<Language>('ja');

  const t = translations[lang];

  const isHistorySupported = () => {
    try {
      return window.location.protocol !== 'blob:' && window.history && !!window.history.pushState;
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
        console.warn("NostrSlide: URL state update suppressed.", e);
      }
    }

    try {
      const fetchedSlides = await fetchThreadSlides(input, (count) => {
        // progress
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
      console.warn("NostrSlide: Could not read URL parameters.", e);
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