/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface FooterProps {
  wordCount: number;
  sectionScope: string;
  onClearFocus: () => void;
  onFocusNote: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  wordCount,
  sectionScope,
  onClearFocus,
  onFocusNote,
}) => {
  return (
    <footer
      id="app-footer"
      className="h-8 bg-slate-900 text-white flex items-center justify-between px-4 text-[10px] font-medium select-none z-10"
    >
      {/* Keyboard Shortcuts indicators */}
      <div className="flex items-center gap-4">
        <button
          id="shortcut-esc-btn"
          onClick={onClearFocus}
          className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          title="Deseleziona attivo"
        >
          <kbd className="bg-white/10 px-1 rounded font-mono text-[9px] text-slate-300">Esc</kbd>
          <span>Deseleziona / Chiara</span>
        </button>
        <button
          id="shortcut-n-btn"
          onClick={onFocusNote}
          className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          title="Scrivi una nota"
        >
          <kbd className="bg-white/10 px-1 rounded font-mono text-[9px] text-slate-300">N</kbd>
          <span>Aggiungi Nota</span>
        </button>
        <div className="flex items-center gap-1.5 opacity-80">
          <kbd className="bg-white/10 px-1 rounded font-mono text-[9px] text-slate-300">/</kbd>
          <span>Cerca</span>
        </div>
      </div>

      {/* Real-time Document statistics & Reference information */}
      <div className="flex items-center gap-6">
        <span>Parole visualizzate: {wordCount.toLocaleString()}</span>
        <span>Sezione: {sectionScope}</span>
        <span className="text-slate-400 hover:text-white transition-colors">
          Codice di Diritto Canonico © 1983
        </span>
      </div>
    </footer>
  );
};
