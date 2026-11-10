import React from 'react';
import {
  Play,
  Clock,
  Sparkles,
  Brain,
  Wind,
  Share2,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { ScriptSegment } from '../types';
import { BreathingGuide } from './BreathingGuide';

interface VideoScriptViewProps {
  segments: ScriptSegment[];
  currentSegmentId: string;
  onPlaySegment: (segment: ScriptSegment) => void;
  isLoading: boolean;
}

export const VideoScriptView: React.FC<VideoScriptViewProps> = ({
  segments,
  currentSegmentId,
  onPlaySegment,
  isLoading,
}) => {
  const fullVideo = segments.find(s => s.id === 'full-video');
  const individualParts = segments.filter(
    s => s.category === 'video' && s.id !== 'full-video'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Play full video */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-stone-900 to-teal-950/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                Roteiro Principal · 45s a 60s
              </span>
              <span className="text-xs text-stone-400">Reels / Shorts / TikTok</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 tracking-tight">
              Regulação do Sistema Nervoso & Sobrecarga Sensorial
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl">
              Narração completa com o sotaque autêntico e caloroso do Crato (Cariri Cearense), transmitindo calma imediata, empatia e validação neurobiológica.
            </p>
          </div>

          {fullVideo && (
            <button
              onClick={() => onPlaySegment(fullVideo)}
              disabled={isLoading}
              className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-3 font-semibold text-sm transition-all shadow-xl cursor-pointer ${
                currentSegmentId === 'full-video'
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 hover:scale-105 active:scale-95'
              }`}
            >
              <Play className="h-4 w-4 fill-current" />
              {currentSegmentId === 'full-video' ? 'Ouvindo Vídeo Completo' : 'Ouvir Vídeo Completo'}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Parts */}
      <div className="grid grid-cols-1 gap-5">
        {individualParts.map(part => {
          const isSelected = currentSegmentId === part.id;
          const isToolPart = part.id === 'part-3-ferramenta';

          return (
            <div
              key={part.id}
              className={`relative rounded-2xl border transition-all duration-300 p-6 ${
                isSelected
                  ? 'border-amber-500/70 bg-stone-900/90 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/40'
                  : 'border-stone-800 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-900/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-base border ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-stone-700 bg-stone-800 text-stone-300'
                    }`}
                  >
                    {part.id.includes('gancho') && <Sparkles className="h-5 w-5" />}
                    {part.id.includes('mecanismo') && <Brain className="h-5 w-5" />}
                    {part.id.includes('ferramenta') && <Wind className="h-5 w-5" />}
                    {part.id.includes('cta') && <Share2 className="h-5 w-5" />}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-stone-100 flex items-center gap-2">
                      {part.title}
                    </h3>
                    <p className="text-xs text-stone-400">{part.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-stone-800/80 px-2.5 py-1 text-xs font-mono text-stone-300 border border-stone-700">
                    <Clock className="h-3 w-3 text-amber-400" />
                    {part.timeframe}
                  </span>

                  <button
                    onClick={() => onPlaySegment(part)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-500/50'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    {isSelected ? 'Ouvindo agora' : 'Ouvir trecho'}
                  </button>
                </div>
              </div>

              {/* Spoken Quote Box */}
              <div className="relative rounded-xl border border-stone-800/80 bg-stone-950/60 p-4 font-serif text-base md:text-lg italic text-amber-100/90 leading-relaxed">
                <span className="text-2xl text-amber-500/60 font-serif mr-1">“</span>
                {part.spokenText.replace(/<breath>/g, ' · ')}
                <span className="text-2xl text-amber-500/60 font-serif ml-1">”</span>
              </div>

              {/* Special interactive breathing tool for Part 3 */}
              {isToolPart && (
                <div className="mt-5">
                  <BreathingGuide onTriggerAudio={() => onPlaySegment(part)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
