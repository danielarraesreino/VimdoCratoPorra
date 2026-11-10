import React, { useState, useEffect } from 'react';
import { Wind, Play, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface BreathingGuideProps {
  onTriggerAudio?: () => void;
}

type BreathPhase = 'idle' | 'inhale1' | 'inhale2' | 'exhale' | 'completed';

export const BreathingGuide: React.FC<BreathingGuideProps> = ({ onTriggerAudio }) => {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [cycle, setCycle] = useState<number>(1);
  const [countdown, setCountdown] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive) {
      if (phase === 'idle') {
        setPhase('inhale1');
        setCountdown(2);
      } else if (phase === 'inhale1') {
        if (countdown > 1) {
          timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
          setPhase('inhale2');
          setCountdown(1);
        }
      } else if (phase === 'inhale2') {
        if (countdown > 1) {
          timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
          setPhase('exhale');
          setCountdown(6);
        }
      } else if (phase === 'exhale') {
        if (countdown > 1) {
          timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
          if (cycle < 3) {
            setCycle(c => c + 1);
            setPhase('inhale1');
            setCountdown(2);
          } else {
            setPhase('completed');
            setIsActive(false);
          }
        }
      }
    }

    return () => clearTimeout(timer);
  }, [isActive, phase, countdown, cycle]);

  const handleStart = () => {
    setCycle(1);
    setPhase('inhale1');
    setCountdown(2);
    setIsActive(true);
    if (onTriggerAudio) {
      onTriggerAudio();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('idle');
    setCycle(1);
    setCountdown(0);
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'inhale1':
        return {
          title: '1ª Inspiração Curta',
          instruction: 'Inspire pelo nariz enchendo cerca de 70% dos pulmões...',
          sub: 'Pelo Nariz',
          ringScale: 'scale-110',
          ringColor: 'border-teal-400 bg-teal-500/10 text-teal-300',
        };
      case 'inhale2':
        return {
          title: '2ª Inspiração Rápida',
          instruction: 'Mais uma puxadinha rápida de ar no topo para expandir os alvéolos!',
          sub: 'Completa pelo Nariz',
          ringScale: 'scale-125',
          ringColor: 'border-cyan-400 bg-cyan-500/20 text-cyan-200',
        };
      case 'exhale':
        return {
          title: 'Expiração Longa e Lenta',
          instruction: 'Solte todo o ar devagar pela boca, esvaziando o peito...',
          sub: 'Pela Boca (bem devagar)',
          ringScale: 'scale-90',
          ringColor: 'border-amber-400 bg-amber-500/10 text-amber-300',
        };
      case 'completed':
        return {
          title: 'Prática Concluída!',
          instruction: 'Nervo vago ativado com sucesso. Observe a calma descendo pelo corpo.',
          sub: '3 Ciclos Completos',
          ringScale: 'scale-100',
          ringColor: 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
        };
      default:
        return {
          title: 'O Suspiro Fisiológico',
          instruction: 'Técnica clínica de ativação rápida do sistema parassimpático.',
          sub: '2 Inspirações + 1 Expiração Longa (3x)',
          ringScale: 'scale-100',
          ringColor: 'border-stone-600 bg-stone-800/40 text-stone-300',
        };
    }
  };

  const currentInfo = getPhaseDescription();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/80 p-6 backdrop-blur-md">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left column: explanation */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-300 border border-teal-500/30">
              <Wind className="h-3.5 w-3.5" />
              Ferramenta Prática do Roteiro
            </span>
            <span className="text-xs text-stone-400">Tempo: ~25 segundos</span>
          </div>

          <h3 className="text-xl font-semibold text-stone-100 tracking-tight">
            Guia Visual: Suspiro Fisiológico (3 Ciclos)
          </h3>

          <p className="text-sm text-stone-300 leading-relaxed">
            Como explica Seu Damião no roteiro: <em className="text-amber-200">"É o sinal químico mais rápido para o seu nervo vago avisar o cérebro que você está seguro."</em>
          </p>

          <div className="flex items-center gap-2 pt-2">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium px-4 py-2 text-sm transition-all shadow-lg shadow-teal-950/40 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                {phase === 'completed' ? 'Fazer Novamente' : 'Iniciar Respiração Guiada'}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 text-sm transition-colors cursor-pointer border border-stone-700"
              >
                <RotateCcw className="h-4 w-4" />
                Pausar / Reiniciar
              </button>
            )}

            <div className="text-xs text-stone-400 pl-2">
              Ciclo: <span className="font-semibold text-stone-200">{cycle}</span> de 3
            </div>
          </div>
        </div>

        {/* Right column: visual breathing circle */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative flex items-center justify-center w-48 h-48">
            {/* Outer animated ripple */}
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ease-in-out ${currentInfo.ringColor} ${currentInfo.ringScale}`}
            />
            {/* Secondary pulsing ring */}
            <div
              className={`absolute inset-3 rounded-full border border-dashed transition-all duration-700 opacity-60 ${currentInfo.ringColor}`}
            />

            {/* Core container */}
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              {phase === 'completed' ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-1" />
                  <span className="text-xs font-semibold text-emerald-300">Pronto!</span>
                </>
              ) : isActive ? (
                <>
                  <span className="text-3xl font-bold tracking-tight text-stone-100 font-mono">
                    {countdown}s
                  </span>
                  <span className="text-xs font-medium text-stone-300 mt-1 max-w-[120px] line-clamp-1">
                    {currentInfo.sub}
                  </span>
                </>
              ) : (
                <>
                  <Wind className="h-8 w-8 text-teal-400/80 mb-1" />
                  <span className="text-xs font-medium text-stone-400">Toque em Iniciar</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-stone-200">{currentInfo.title}</p>
            <p className="text-xs text-stone-400 max-w-xs">{currentInfo.instruction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
