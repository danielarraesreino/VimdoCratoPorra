import React, { useState } from 'react';
import {
  Mic,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Wind,
  CheckCircle,
} from 'lucide-react';
import { VoiceProfile } from '../types';

interface VoiceCustomizerProps {
  profiles: VoiceProfile[];
  selectedProfile: VoiceProfile;
  onSelectProfile: (profile: VoiceProfile) => void;
  onPlayCustomText: (text: string, title: string, styleOverride?: string) => void;
  isLoading: boolean;
}

export const VoiceCustomizer: React.FC<VoiceCustomizerProps> = ({
  profiles,
  selectedProfile,
  onSelectProfile,
  onPlayCustomText,
  isLoading,
}) => {
  const [customText, setCustomText] = useState(
    'Ô meu amigo, se acomode aqui na cadeira... <breath> respire fundo e não se avexe não. Seu corpo só precisa de um tempinho de descanso.'
  );
  const [customStyle, setCustomStyle] = useState(selectedProfile.style);

  const presets = [
    {
      label: '🌵 Acolhimento do Cariri',
      text: 'Ô meu amigo, se acomode aqui na cadeira... <breath> respire fundo e não se avexe não. Seu corpo só precisa de um tempinho de descanso.',
    },
    {
      label: '🧠 Explicação da Amígdala',
      text: 'Olhe, quando a gente passa muito tempo aperreado, <breath> a amígdala cerebral da gente pensa que tem uma onça na sala. É só por isso que o coração dispara.',
    },
    {
      label: '🌬️ O Suspiro no Crato',
      text: 'Puxe o ar duas vezes bem de mansinho pelo nariz... <breath> e solte um suspiro comprido pela boca. <breath> O nervo vago da gente agradece na mesma hora.',
    },
  ];

  const handleInsertBreath = () => {
    setCustomText(prev => prev + ' <breath> ');
  };

  const handleProfileChange = (profile: VoiceProfile) => {
    onSelectProfile(profile);
    setCustomStyle(profile.style);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
            <Mic className="h-3.5 w-3.5" />
            Voz do Crato · Homem de Meia-Idade
          </span>
          <span className="text-xs text-stone-400">Gemini 3.8 Flash TTS Voice Design</span>
        </div>
        <h2 className="text-xl font-bold text-stone-100">
          Personalização de Voz & Teste de Frases
        </h2>
        <p className="text-xs text-stone-300">
          Ajuste as nuances de timbre e experimente qualquer texto lido com o sotaque nordestino cearense do Cariri.
        </p>
      </div>

      {/* Profiles Grid */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Selecione a Persona Vocal do Crato:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {profiles.map(profile => {
            const isSelected = selectedProfile.id === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => handleProfileChange(profile)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                    : 'border-stone-800 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-100 text-sm">
                    {profile.name}
                  </span>
                  {isSelected && <CheckCircle className="h-4 w-4 text-amber-400" />}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mb-3">
                  {profile.desc}
                </p>
                <span className="inline-block rounded-md bg-stone-800 px-2 py-0.5 text-[11px] font-mono text-amber-300 border border-stone-700">
                  Modelo: {profile.voiceName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Test custom text */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
            Escreva ou teste uma frase personalizada:
          </label>
          <button
            onClick={handleInsertBreath}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs px-2.5 py-1 border border-stone-700 cursor-pointer"
            title="Insere tag de pausa respiratória natural"
          >
            <Wind className="h-3.5 w-3.5" />
            Inserir Pausa &lt;breath&gt;
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setCustomText(p.text)}
              className="rounded-lg bg-stone-800/80 hover:bg-stone-700 px-3 py-1 text-xs text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="Digite qualquer texto aqui..."
          className="w-full rounded-xl border border-stone-700 bg-stone-950 p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-serif leading-relaxed"
        />

        {/* Style prompt details toggle */}
        <details className="text-xs text-stone-400">
          <summary className="cursor-pointer hover:text-stone-200 py-1">
            Ver / Ajustar Prompt de Voz (SpeechMetadata Style)
          </summary>
          <div className="mt-2 space-y-2">
            <textarea
              rows={2}
              value={customStyle}
              onChange={e => setCustomStyle(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 p-2 text-xs text-stone-300 focus:outline-none"
            />
          </div>
        </details>

        <div className="flex justify-end pt-2">
          <button
            onClick={() =>
              onPlayCustomText(customText, 'Frase Personalizada', customStyle)
            }
            disabled={isLoading || !customText.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 text-sm transition-all shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-current" />
            Ouvir com Sotaque do Crato
          </button>
        </div>
      </div>
    </div>
  );
};
