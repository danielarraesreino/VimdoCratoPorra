/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Film,
  Layers,
  FileText,
  Sliders,
  Wind,
  Sparkles,
  Heart,
  Volume2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ScriptSegment, VoiceProfile } from './types';
import { AudioPlayer } from './components/AudioPlayer';
import { VideoScriptView } from './components/VideoScriptView';
import { CarrosselView } from './components/CarrosselView';
import { MarkdownView } from './components/MarkdownView';
import { VoiceCustomizer } from './components/VoiceCustomizer';

const DEFAULT_PROFILES: VoiceProfile[] = [
  {
    id: 'crato-charon',
    name: 'Seu Damião do Crato',
    desc: 'Homem de 52 anos, Cariri cearense. Voz madura, profunda, mansa e profundamente acolhedora.',
    voiceName: 'Charon',
    style:
      'Homem cearense de meia-idade (cerca de 50 a 55 anos), natural da cidade do Crato, na região do Cariri, Ceará. Voz grave, madura, aveludada, mansa e acolhedora, com sotaque nordestino cearense autêntico e caloroso. Ritmo calmo, empático, afetuoso, com pausas naturais para respiração como quem acolhe alguém com sabedoria e serenidade.',
  },
  {
    id: 'crato-fenrir',
    name: 'Dr. Geraldo do Cariri',
    desc: 'Homem de 48 anos, voz firme, serena e terapêutica com sotaque cearense suave.',
    voiceName: 'Fenrir',
    style:
      'Homem de 48 anos do Crato, Ceará. Tom de voz terapêutico, firme, claro, reconfortante e empático com sotaque cearense do Cariri natural e acolhedor.',
  },
  {
    id: 'crato-puck',
    name: 'Mestre Expedito',
    desc: 'Tom mais coloquial, comunicativo e dinâmico, típico das rodas de conversa do Cariri.',
    voiceName: 'Puck',
    style:
      'Homem nordestino de meia-idade, conversador do interior do Ceará (Crato), tom expressivo, caloroso, simpático e empático.',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'video' | 'carrossel' | 'original' | 'custom'>('video');
  const [segments, setSegments] = useState<ScriptSegment[]>([]);
  const [profiles, setProfiles] = useState<VoiceProfile[]>(DEFAULT_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfile>(DEFAULT_PROFILES[0]);
  const [rawMarkdown, setRawMarkdown] = useState<string>('');

  // Audio state
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('Roteiro Principal: Vídeo Curto (45s - 60s)');
  const [currentSegmentId, setCurrentSegmentId] = useState('full-video');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial script and profiles
  useEffect(() => {
    fetch('/api/script')
      .then(res => res.json())
      .then(data => {
        if (data.segments) setSegments(data.segments);
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
          setSelectedProfile(data.profiles[0]);
        }
        if (data.rawContent) setRawMarkdown(data.rawContent);
      })
      .catch(err => {
        console.error('Falha ao carregar script do backend:', err);
      });
  }, []);

  // Request TTS from server
  const playTTS = useCallback(
    async (text: string, title: string, segmentId?: string, styleOverride?: string) => {
      setIsLoadingAudio(true);
      setErrorMessage(null);
      setCurrentTitle(title);
      if (segmentId) setCurrentSegmentId(segmentId);

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceName: selectedProfile.voiceName,
            style: styleOverride || selectedProfile.style,
            segmentId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.details || 'Erro ao gerar narração');
        }

        if (data.audioBase64) {
          setAudioBase64(data.audioBase64);
        } else {
          throw new Error('Nenhum dado de áudio retornado.');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Erro na chamada TTS:', err);
        setErrorMessage(msg);
      } finally {
        setIsLoadingAudio(false);
      }
    },
    [selectedProfile]
  );

  // Trigger default video on initial user intent
  const handlePlaySegment = (segment: ScriptSegment) => {
    playTTS(segment.spokenText, segment.title, segment.id);
  };

  const handlePlayFullVideo = () => {
    const full = segments.find(s => s.id === 'full-video');
    if (full) {
      playTTS(full.spokenText, full.title, full.id);
    }
  };

  const handlePlayFullCarrossel = () => {
    const carrosselSeg = segments.find(s => s.id === 'carrossel-full');
    if (carrosselSeg) {
      playTTS(carrosselSeg.spokenText, carrosselSeg.title, carrosselSeg.id);
    }
  };

  const handlePlayCustomText = (text: string, title: string, styleOverride?: string) => {
    playTTS(text, title, 'custom', styleOverride);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950 font-sans antialiased">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-600/30 to-orange-700/10 blur-[130px]" />
        <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-teal-600/20 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-[450px] w-[450px] rounded-full bg-amber-800/15 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Header Branding */}
        <header className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Gemini 3.8 Flash TTS · Voice Design
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/25">
                  <Heart className="h-3.5 w-3.5 text-teal-400" />
                  Psicoeducação & Regulação Nervosa
                </span>
                <span className="rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-stone-300 border border-stone-700">
                  📍 Crato, Cariri Cearense
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-100 font-serif">
                Voz do Crato: Regulação do Sistema Nervoso
              </h1>

              <p className="text-sm md:text-base text-stone-300 max-w-3xl leading-relaxed">
                Leitura do roteiro de psicoeducação e sobrecarga sensorial interpretada com a voz afetuosa, mansa e acolhedora de um <strong className="text-amber-300 font-semibold">homem de meia-idade do Crato (Ceará)</strong>.
              </p>
            </div>

            {/* Persona card snippet */}
            <div className="shrink-0 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 to-stone-900 p-4 min-w-[220px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-lg">
                  👴🏽
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Narrador Atual
                  </p>
                  <p className="text-sm font-bold text-stone-100">
                    {selectedProfile.name}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                {selectedProfile.desc}
              </p>
            </div>
          </div>
        </header>

        {/* Master Pinned Audio Player */}
        <AudioPlayer
          audioBase64={audioBase64}
          isLoading={isLoadingAudio}
          currentTitle={currentTitle}
          currentNarrator={selectedProfile}
          activeSegmentId={currentSegmentId}
          onReplay={() => {
            if (audioBase64) {
              const audio = document.querySelector('audio');
              if (audio) {
                audio.currentTime = 0;
                audio.play();
              }
            }
          }}
        />

        {/* Error notification if API fails */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-red-200 backdrop-blur-md">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-red-100">Não foi possível gerar a narração:</p>
              <p className="text-xs text-red-300">{errorMessage}</p>
              <p className="text-xs text-stone-400 pt-1">
                Certifique-se de que sua chave da API Gemini está configurada no painel de Secrets.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('video')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Film className="h-4 w-4" />
            🎬 Vídeo Curto (Reels / TikTok)
          </button>

          <button
            onClick={() => setActiveTab('carrossel')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'carrossel'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            📱 Carrossel 10 Slides
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Sliders className="h-4 w-4" />
            🎙️ Voz do Crato & Testes
          </button>

          <button
            onClick={() => setActiveTab('original')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'original'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <FileText className="h-4 w-4" />
            📜 Arquivo Original (Markdown)
          </button>
        </div>

        {/* Tab Content */}
        <main className="transition-all">
          {activeTab === 'video' && (
            <VideoScriptView
              segments={segments}
              currentSegmentId={currentSegmentId}
              onPlaySegment={handlePlaySegment}
              isLoading={isLoadingAudio}
            />
          )}

          {activeTab === 'carrossel' && (
            <CarrosselView
              onPlayCustomText={handlePlayCustomText}
              onPlayFullCarrossel={handlePlayFullCarrossel}
              isLoading={isLoadingAudio}
              currentTitle={currentTitle}
            />
          )}

          {activeTab === 'custom' && (
            <VoiceCustomizer
              profiles={profiles}
              selectedProfile={selectedProfile}
              onSelectProfile={setSelectedProfile}
              onPlayCustomText={handlePlayCustomText}
              isLoading={isLoadingAudio}
            />
          )}

          {activeTab === 'original' && (
            <MarkdownView
              rawContent={rawMarkdown}
              onPlayFullText={handlePlayFullVideo}
              isLoading={isLoadingAudio}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 rounded-2xl border border-stone-800 bg-stone-900/30 p-6 text-center text-xs text-stone-400 space-y-2">
          <p>
            Voz gerada com <strong className="text-amber-300">Gemini 3.8 Flash TTS</strong> (<code className="font-mono text-stone-300">gemini-3.8-flash-tts</code>) utilizando Voice Design para sotaque caririense/cearense.
          </p>
          <p className="text-stone-400">
            Baseado no roteiro clínico de TCC / ACT: <em>Regulação do Sistema Nervoso e Sobrecarga Sensorial</em>.
          </p>
        </footer>
      </div>
    </div>
  );
}
