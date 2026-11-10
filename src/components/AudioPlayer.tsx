import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Loader2,
  Sparkles,
  Music2,
} from 'lucide-react';
import { VoiceProfile } from '../types';

interface AudioPlayerProps {
  audioBase64: string | null;
  mimeType?: string;
  isLoading: boolean;
  currentTitle: string;
  currentNarrator: VoiceProfile;
  onReplay?: () => void;
  onGenerateNew?: () => void;
  activeSegmentId?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  mimeType = 'audio/wav',
  isLoading,
  currentTitle,
  currentNarrator,
  onReplay,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Update object URL when audioBase64 changes
  useEffect(() => {
    if (!audioBase64) {
      setAudioUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    try {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Reset state for new audio
      setCurrentTime(0);
      setIsPlaying(true);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error('Error creating audio blob:', e);
    }
  }, [audioBase64, mimeType]);

  // Handle play/pause with HTMLAudioElement
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Auto-play prevented or interrupted:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl]);

  const togglePlay = () => {
    if (!audioUrl) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      audioRef.current.playbackRate = playbackRate;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `voz_crato_${currentTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="sticky top-4 z-40 rounded-2xl border border-stone-700/80 bg-stone-900/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex flex-col gap-3">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600/40 to-teal-700/40 text-amber-300 border border-amber-500/30">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
              ) : isPlaying ? (
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-amber-400 animate-pulse h-3 rounded-full" />
                  <span className="w-1 bg-teal-400 animate-bounce h-4 rounded-full" />
                  <span className="w-1 bg-amber-300 animate-pulse h-2 rounded-full" />
                </div>
              ) : (
                <Music2 className="h-5 w-5 text-amber-200" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-stone-100 text-sm md:text-base line-clamp-1">
                  {currentTitle || 'Selecione um trecho para escutar'}
                </h4>
                {isLoading && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/30 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    Gerando TTS...
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 line-clamp-1">
                Narrador: <span className="text-amber-300 font-medium">{currentNarrator.name}</span> · Sotaque do Crato (Cariri Cearense)
              </p>
            </div>
          </div>

          {/* Speed & Download */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-stone-800/80 p-0.5 border border-stone-700">
              {[0.85, 1, 1.15].map(rate => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-amber-600 text-stone-950 font-semibold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {audioUrl && (
              <button
                onClick={handleDownload}
                title="Baixar áudio WAV"
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrubber & Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading || !audioUrl}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold transition-all cursor-pointer ${
              isLoading || !audioUrl
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-900/40 hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay */}
          {onReplay && (
            <button
              onClick={onReplay}
              disabled={isLoading}
              title="Reiniciar áudio"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer border border-stone-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Timeline slider */}
          <div className="flex flex-1 items-center gap-2 w-full">
            <span className="text-xs font-mono text-stone-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              disabled={!audioUrl}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-700 accent-amber-500"
            />
            <span className="text-xs font-mono text-stone-400 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-stone-800">
            <button
              onClick={toggleMute}
              className="p-1.5 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1.5 w-16 cursor-pointer appearance-none rounded-lg bg-stone-700 accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
