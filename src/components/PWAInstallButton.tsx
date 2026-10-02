/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from "lucide-react";

interface PWAInstallButtonProps {
  variant?: "header" | "card" | "mobile-action";
  className?: string;
  onInstalledCallback?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = "header",
  className = "",
  onInstalledCallback,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running in standalone mode (already installed), hide or show status
  if (isInstalled) {
    if (variant === "card") {
      return (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Applicazione installata sul dispositivo</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      const success = await install();
      setIsInstalling(false);
      if (success && onInstalledCallback) {
        onInstalledCallback();
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General fallback or instructions
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === "header" && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer ${className}`}
          title="Installa applicazione su telefono o computer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Installa App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === "mobile-action" && (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-98 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4" />
            <div className="text-left">
              <div className="font-bold">Installa su Smartphone (PWA)</div>
              <div className="text-[10px] opacity-80 font-normal">Funziona offline su Android e iPhone</div>
            </div>
          </div>
          <Download className="w-4 h-4 opacity-80" />
        </button>
      )}

      {variant === "card" && (
        <div className={`p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 space-y-3 ${className}`}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif font-bold text-sm text-blue-950 dark:text-blue-100">
                Installa Codex Iuris Canonici
              </h4>
              <p className="text-xs text-stone-600 dark:text-gray-300 leading-snug">
                Accedi all&apos;intero Codice a schermo intero sul tuo smartphone (Android o iOS) anche senza connessione internet.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 active:scale-98 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isIOS ? "Istruzioni installazione iPhone / iPad" : "Installa Web App"}</span>
          </button>
        </div>
      )}

      {/* iOS & Mobile Install Guide Modal */}
      {showIOSGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowIOSGuide(false)}
        >
          <div 
            className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-stone-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-700 flex items-center justify-center text-white">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                  Installazione su Smartphone
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-gray-300">
              Il Codex Iuris Canonici è una Progressive Web App (PWA) e può essere installata direttamente sulla schermata iniziale del tuo telefono:
            </p>

            {/* Apple iOS Safari step-by-step instructions */}
            <div className="space-y-2.5 rounded-xl bg-stone-50 dark:bg-gray-800/60 p-3.5 border border-stone-200 dark:border-gray-700 text-xs">
              <div className="font-semibold text-stone-900 dark:text-gray-100 flex items-center gap-1.5">
                <span>Su Apple iPhone / iPad (Safari):</span>
              </div>
              <ol className="space-y-2 text-stone-700 dark:text-gray-300 list-decimal list-inside pl-1 text-[12px] leading-relaxed">
                <li>
                  Tocca l&apos;icona <strong className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-stone-200 dark:bg-gray-700 font-sans not-italic"><Share className="w-3 h-3" /> Condividi</strong> nella barra di Safari.
                </li>
                <li>
                  Scorri il menu delle azioni e tocca <strong className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-stone-200 dark:bg-gray-700 font-sans not-italic"><PlusSquare className="w-3 h-3" /> Aggiungi alla schermata Home</strong>.
                </li>
                <li>
                  Conferma toccando <strong>Aggiungi</strong> in alto a destra. L&apos;icona apparirà sulla schermata principale!
                </li>
              </ol>
            </div>

            {/* Android instructions */}
            <div className="space-y-2 rounded-xl bg-stone-50 dark:bg-gray-800/60 p-3 border border-stone-200 dark:border-gray-700 text-xs">
              <div className="font-semibold text-stone-900 dark:text-gray-100">
                Su telefoni Android (Chrome o Edge):
              </div>
              <p className="text-[11px] text-stone-600 dark:text-gray-300 leading-relaxed">
                Tocca il menu <strong className="font-bold">⋮</strong> (tre puntini in alto a destra nel browser) e seleziona <strong className="font-bold">&ldquo;Installa app&rdquo;</strong> o &ldquo;Aggiungi a schermata Home&rdquo;.
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer active:scale-98 transition"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}
    </>
  );
};
