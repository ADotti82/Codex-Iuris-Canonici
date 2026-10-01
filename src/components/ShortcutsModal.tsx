/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HelpCircle, X, Keyboard } from "lucide-react";
import { ThemeMode } from "../types";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const modalBg = isDark ? "bg-[#111827] border-gray-700 text-gray-100" 
    : isSepia ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]" 
    : "bg-white border-stone-200 text-[#1C1917]";

  const kbdBg = isDark ? "bg-gray-800 border-gray-700 text-gray-200" 
    : isSepia ? "bg-[#EAE2D3] border-[#D9CDB8] text-[#2C241B]" 
    : "bg-stone-100 border-stone-300 text-stone-800";

  const shortcuts = [
    { key: "/", desc: "Attiva la casella di ricerca rapida" },
    { key: "Ctrl + K", desc: "Cerca in tutto il Codice di Diritto Canonico" },
    { key: "G", desc: "Vai al canone per numero (1 – 1752)" },
    { key: "J / →", desc: "Avanza al canone successivo" },
    { key: "K / ←", desc: "Torna al canone precedente" },
    { key: "L", desc: "Mostra/nascondi testo autentico latino a comparsa" },
    { key: "B", desc: "Aggiungi o rimuovi canone dai segnalibri" },
    { key: "N", desc: "Scrivi un'annotazione per il canone selezionato" },
    { key: "F", desc: "Attiva o disattiva la modalità Focus a schermo intero" },
    { key: "Esc", desc: "Chiudi pannelli o annulla la ricerca corrente" },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">Scorciatoie da Tastiera</h3>
              <p className="text-xs opacity-60">Navigazione rapida per studio e consultazione professionale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-inherit text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5">
              <span className="opacity-80 font-sans">{sc.desc}</span>
              <kbd className={`px-2 py-1 rounded font-mono font-semibold text-[11px] border shadow-xs ${kbdBg}`}>
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Ho Capito
          </button>
        </div>
      </div>
    </div>
  );
};
