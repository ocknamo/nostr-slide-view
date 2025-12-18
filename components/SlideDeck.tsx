import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { SlideData, Language } from '../types';
import { Icons } from '../constants';
import { translations } from '../translations';

interface SlideDeckProps {
  slides: SlideData[];
  onBack: () => void;
  nostrId: string;
  lang: Language;
}

export const SlideDeck: React.FC<SlideDeckProps> = ({
  slides,
  onBack,
  nostrId,
  lang,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const t = translations[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const progress = ((currentIndex + 1) / slides.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, slides.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((e) => console.error(e));
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const isBlob = url.startsWith('blob:');
    try {
      if (isBlob) {
        await navigator.clipboard.writeText(nostrId);
        setShareStatus(t.deck.copiedId);
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus(t.deck.copiedUrl);
      }
      setTimeout(() => setShareStatus(null), 2500);
    } catch (err) {
      alert('Failed to copy.');
    }
  };

  // Export Utilities
  const downloadFile = (
    content: string,
    fileName: string,
    contentType: string
  ) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportAsJSON = () => {
    const data = JSON.stringify(slides, null, 2);
    downloadFile(
      data,
      `nostr-slide-${nostrId.slice(0, 8)}.json`,
      'application/json'
    );
    setIsExportOpen(false);
  };

  const exportAsMarkdown = () => {
    let md = `# NostrSlide Presentation\n\nNostr ID: ${nostrId}\n\n---\n\n`;
    slides.forEach((slide, idx) => {
      md += `## Slide ${idx + 1}\n\n`;
      md += `![Slide ${idx + 1}](${slide.imageUrl})\n\n`;
      if (slide.content) {
        md += `${slide.content}\n\n`;
      }
      md += `---\n\n`;
    });
    downloadFile(md, `nostr-slide-${nostrId.slice(0, 8)}.md`, 'text/markdown');
    setIsExportOpen(false);
  };

  const exportAsPDF = () => {
    setIsExportOpen(false);
    // Give UI a moment to close the menu before printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Close export menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportRef.current &&
        !exportRef.current.contains(event.target as Node)
      ) {
        setIsExportOpen(false);
      }
    };
    if (isExportOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExportOpen]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slide') return;
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          if (e.target instanceof HTMLButtonElement) return;
          if (e.key === ' ') e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'Escape':
          if (document.fullscreenElement) document.exitFullscreen();
          else if (isExportOpen) setIsExportOpen(false);
          else onBack();
          break;
        case 'g':
          setViewMode('grid');
          break;
        case 'f':
          toggleFullScreen();
          break;
        case 's':
          handleShare();
          break;
        case 'e':
          setIsExportOpen(!isExportOpen);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onBack, viewMode, isExportOpen, nostrId]);

  if (viewMode === 'grid') {
    return (
      <div
        className="fixed inset-0 z-[100] bg-nostr-dark p-8 overflow-y-auto animate-fade-in no-print"
        role="dialog"
        aria-modal="true"
        aria-labelledby="grid-title"
      >
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-nostr-dark/95 backdrop-blur z-20 py-4 border-b border-gray-800">
          <h2
            id="grid-title"
            className="text-2xl font-bold text-white tracking-tight"
          >
            {t.deck.gridTitle}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('slide')}
              className="flex items-center gap-2 px-4 py-2 bg-nostr-primary rounded-lg text-white font-bold text-sm hover:brightness-110 focus:ring-2 focus:ring-white"
              aria-label={t.deck.play}
            >
              <Icons.Play aria-hidden="true" /> {t.deck.play}
            </button>
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white transition focus:ring-2 focus:ring-white rounded-lg"
              aria-label={t.modal.close}
            >
              <Icons.X aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentIndex(idx);
                setViewMode('slide');
              }}
              className={`group relative aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 transition-all text-left focus:ring-4 focus:ring-nostr-primary ${idx === currentIndex ? 'border-nostr-primary shadow-lg' : 'border-transparent hover:border-gray-500'}`}
              aria-label={`Slide ${idx + 1}`}
            >
              <img
                src={slide.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                {idx + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print-only container */}
      <div className="hidden print-container" aria-hidden="true">
        {slides.map((slide, idx) => (
          <div key={`print-${slide.id}`} className="print-slide">
            <img src={slide.imageUrl} className="print-image" alt="" />
            {slide.content && <p className="print-caption">{slide.content}</p>}
          </div>
        ))}
      </div>

      {/* Screen Presentation */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col select-none no-print"
        role="region"
        aria-roledescription="carousel"
        aria-label={t.deck.presentation}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <nav
          className={`absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-start transition-opacity duration-300 ${isHovering || isFullscreen ? 'opacity-100' : 'opacity-0 focus-within:opacity-100'}`}
          aria-label="Presentation controls"
        >
          <button
            ref={closeButtonRef}
            onClick={onBack}
            className="p-3 bg-black/40 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition border border-white/10 focus:ring-2 focus:ring-white"
            aria-label={t.deck.back}
          >
            <Icons.X aria-hidden="true" />
          </button>

          <div className="flex gap-2 relative" ref={exportRef}>
            {/* Export Dropdown */}
            {isExportOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-nostr-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-[60] backdrop-blur-xl">
                <div className="p-2 space-y-1">
                  <button
                    onClick={exportAsPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-white/5 rounded-xl transition"
                  >
                    <Icons.Maximize /> {t.deck.exportOptions.pdf}
                  </button>
                  <button
                    onClick={exportAsMarkdown}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-white/5 rounded-xl transition"
                  >
                    <Icons.FileCode /> {t.deck.exportOptions.markdown}
                  </button>
                  <button
                    onClick={exportAsJSON}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-white/5 rounded-xl transition"
                  >
                    <Icons.Grid /> {t.deck.exportOptions.json}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className={`p-3 rounded-full text-white backdrop-blur-md transition border border-white/10 focus:ring-2 focus:ring-white ${isExportOpen ? 'bg-nostr-primary' : 'bg-black/40 hover:bg-black/80'}`}
              aria-label={t.deck.export}
              aria-expanded={isExportOpen}
            >
              <Icons.Download aria-hidden="true" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-black/40 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition border border-white/10 focus:ring-2 focus:ring-white"
              aria-label={t.deck.share}
            >
              <Icons.Share aria-hidden="true" />
            </button>
            <button
              onClick={toggleFullScreen}
              className={`p-3 rounded-full text-white backdrop-blur-md transition border border-white/10 focus:ring-2 focus:ring-white ${isFullscreen ? 'bg-nostr-primary' : 'bg-black/40 hover:bg-black/80'}`}
              aria-label={
                isFullscreen ? t.deck.exitFullscreen : t.deck.fullscreen
              }
            >
              <Icons.Maximize aria-hidden="true" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-3 bg-black/40 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition border border-white/10 focus:ring-2 focus:ring-white"
              aria-label={t.deck.grid}
            >
              <Icons.Grid aria-hidden="true" />
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-3 rounded-full text-white backdrop-blur-md transition border border-white/10 focus:ring-2 focus:ring-white ${showNotes ? 'bg-nostr-primary' : 'bg-black/40 hover:bg-black/80'}`}
              aria-label={t.deck.notes}
              aria-pressed={showNotes}
            >
              <Icons.Info aria-hidden="true" />
            </button>
          </div>
        </nav>

        <div
          aria-live="polite"
          className="absolute top-20 left-1/2 -translate-x-1/2 z-[60]"
        >
          {shareStatus && (
            <div className="bg-nostr-primary text-white px-6 py-2 rounded-full shadow-2xl animate-fade-in font-bold text-sm">
              {shareStatus}
            </div>
          )}
        </div>

        <div
          className="flex-1 relative overflow-hidden bg-black"
          aria-live="polite"
        >
          <div
            className="h-full flex transition-transform duration-700 ease-expo-out"
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / slides.length}%)`,
            }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="h-full relative flex flex-col items-center justify-center overflow-hidden"
                style={{ width: `${100 / slides.length}%` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} / ${slides.length}`}
                aria-hidden={currentIndex !== idx}
              >
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center blur-[100px] opacity-40 scale-150"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  aria-hidden="true"
                />

                <div className="relative w-full h-full flex items-center justify-center z-10 overflow-hidden">
                  <img
                    src={slide.imageUrl}
                    alt={slide.content || `Image for slide ${idx + 1}`}
                    className={`w-full h-full object-contain shadow-2xl transition-all duration-1000 ${currentIndex === idx ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
                    draggable={false}
                  />
                </div>

                {showNotes && slide.content && (
                  <div
                    className={`absolute bottom-16 left-0 right-0 flex justify-center z-20 px-4 pointer-events-none transition-all duration-700 ${currentIndex === idx ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  >
                    <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] max-w-4xl text-white text-lg md:text-2xl shadow-2xl pointer-events-auto border border-white/10 mx-4 text-center">
                      {slide.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          className={`absolute inset-y-0 left-0 w-[15%] z-40 cursor-pointer flex items-center pl-4 outline-none group ${currentIndex === 0 && 'pointer-events-none'}`}
          onClick={handlePrev}
          aria-label={t.deck.prev}
          disabled={currentIndex === 0}
        >
          <div className="p-4 rounded-full bg-white/5 text-white opacity-0 md:group-hover:opacity-100 group-focus:opacity-100 transition-opacity border border-white/10">
            <Icons.ChevronLeft aria-hidden="true" />
          </div>
        </button>
        <button
          className={`absolute inset-y-0 right-0 w-[15%] z-40 cursor-pointer flex items-center justify-end pr-4 outline-none group ${currentIndex === slides.length - 1 && 'pointer-events-none'}`}
          onClick={handleNext}
          aria-label={t.deck.next}
          disabled={currentIndex === slides.length - 1}
        >
          <div className="p-4 rounded-full bg-white/5 text-white opacity-0 md:group-hover:opacity-100 group-focus:opacity-100 transition-opacity border border-white/10">
            <Icons.ChevronRight aria-hidden="true" />
          </div>
        </button>

        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-50"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.deck.progress}
        >
          <div
            className="h-full bg-gradient-to-r from-nostr-primary to-fuchsia-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
};
