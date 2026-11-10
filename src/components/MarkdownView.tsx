import React, { useState } from 'react';
import { Copy, Check, FileText, Play, ExternalLink } from 'lucide-react';

interface MarkdownViewProps {
  rawContent: string;
  onPlayFullText: () => void;
  isLoading: boolean;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  rawContent,
  onPlayFullText,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-semibold text-stone-200">
              regulacao_do_sistema_nervoso_e_sobrecarga_sensorial_14af65f6.md
            </h3>
            <p className="text-xs text-stone-400">
              Arquivo original fornecido no anexo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border border-stone-700"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copiar Markdown
              </>
            )}
          </button>

          <button
            onClick={onPlayFullText}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-1.5 text-xs transition-colors cursor-pointer shadow-md"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Ouvir Roteiro Completo
          </button>
        </div>
      </div>

      {/* Formatted Code / Markdown Block */}
      <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 font-mono text-xs md:text-sm text-stone-300 leading-relaxed overflow-x-auto shadow-inner">
        <pre className="whitespace-pre-wrap">{rawContent}</pre>
      </div>
    </div>
  );
};
