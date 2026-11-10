import React, { useState } from 'react';
import {
  Play,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { SLIDES_DATA } from '../data/slides';
import { ScriptSegment } from '../types';

interface CarrosselViewProps {
  onPlayCustomText: (text: string, title: string) => void;
  onPlayFullCarrossel: () => void;
  isLoading: boolean;
  currentTitle: string;
}

export const CarrosselView: React.FC<CarrosselViewProps> = ({
  onPlayCustomText,
  onPlayFullCarrossel,
  isLoading,
  currentTitle,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = SLIDES_DATA[activeSlideIndex];

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  return (
    <div className="space-y-6">
      {/* Header with full carrossel audio trigger */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30">
                <Layers className="h-3.5 w-3.5" />
                Carrossel de 10 Slides (1080x1350)
              </span>
              <span className="text-xs text-stone-400">Guia de Psicoeducação</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 tracking-tight">
              Estrutura Completa do Carrossel Visual
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl">
              Navegue pelos 10 cards explicativos da neurobiologia da sobrecarga sensorial e escute a narração de Seu Damião para cada ponto.
            </p>
          </div>

          <button
            onClick={onPlayFullCarrossel}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 transition-all shadow-lg shadow-teal-950/40 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            Ouvir Resumo dos 10 Slides
          </button>
        </div>
      </div>

      {/* Main Slide Carousel Presenter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Visual Slide Card in 4:5 proportion */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative flex-1 aspect-[4/5] rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900 via-stone-950 to-amber-950/20 p-8 flex flex-col justify-between shadow-2xl overflow-hidden group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Psicoeducação · Cariri
              </span>
              <span className="rounded-full bg-stone-800/80 px-2.5 py-1 text-xs font-bold text-stone-300 border border-stone-700">
                Slide {activeSlide.number} / 10
              </span>
            </div>

            {/* Slide Body */}
            <div className="relative z-10 space-y-4 my-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-stone-100 leading-tight">
                {activeSlide.title}
              </h3>
              <p className="text-sm font-medium text-amber-200/80">
                {activeSlide.subtitle}
              </p>
              <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-4 text-stone-300 text-sm leading-relaxed whitespace-pre-line">
                {activeSlide.content}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-stone-800/80 pt-4">
              <span className="text-xs text-stone-500 font-mono">1080 × 1350 px</span>
              <span className="text-xs text-amber-400/80 font-medium">@coletivoaruatemvoz</span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 text-xs font-medium transition-colors cursor-pointer border border-stone-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-xs text-stone-400 font-mono">
              Slide {activeSlide.number} de 10
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 text-xs font-medium transition-colors cursor-pointer border border-stone-700"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Spoken Audio Narration for the active slide + Slide Index Picker */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Active slide narration card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  {activeSlide.number}
                </span>
                <div>
                  <h4 className="text-base font-semibold text-stone-100">
                    Narração Cearense do Slide {activeSlide.number}
                  </h4>
                  <p className="text-xs text-stone-400">
                    Voz do Crato com cadência calma e acolhedora
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  onPlayCustomText(
                    activeSlide.spokenAudioText,
                    `Slide ${activeSlide.number}: ${activeSlide.title}`
                  )
                }
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 text-xs transition-all shadow-md cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Ouvir Este Slide
              </button>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 font-serif text-base italic text-amber-100/90 leading-relaxed">
              “{activeSlide.spokenAudioText.replace(/<breath>/g, ' · ')}”
            </div>
          </div>

          {/* Quick Jump Buttons 1 to 10 */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-5 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Pular Direto para um Slide
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SLIDES_DATA.map((slide, idx) => (
                <button
                  key={slide.number}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    activeSlideIndex === idx
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-md'
                      : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <span className="text-sm font-bold">Slide {slide.number}</span>
                  <span className="text-[10px] text-stone-400 truncate max-w-full">
                    {slide.title.slice(0, 14)}...
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
