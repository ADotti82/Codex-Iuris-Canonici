/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Hash, ArrowRight, X, BookOpen } from "lucide-react";
import { getCanonLocation, CANON_BY_NUMBER_MAP } from "../data";
import { ThemeMode } from "../types";

interface QuickJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToNumber: (canonNumber: number) => void;
  theme: ThemeMode;
}

export const QuickJumpModal: React.FC<QuickJumpModalProps> = ({
  isOpen,
  onClose,
  onJumpToNumber,
  theme,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const num = parseInt(inputValue.replace(/\D/g, ""), 10);
  const isValidNumber = !isNaN(num) && num >= 1 && num <= 1752;
  const location = isValidNumber ? getCanonLocation(num) : null;
  const existingCanon = isValidNumber ? CANON_BY_NUMBER_MAP[num] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidNumber) {
      onJumpToNumber(num);
      onClose();
    }
  };

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const modalBg = isDark ? "bg-[#111827] border-gray-700 text-gray-100" 
    : isSepia ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]" 
    : "bg-white border-stone-200 text-[#1C1917]";

  const inputBg = isDark ? "bg-gray-800 border-gray-700 text-white" 
    : isSepia ? "bg-[#EAE2D3] border-[#D9CDB8] text-[#2C241B]" 
    : "bg-stone-50 border-stone-300 text-stone-900";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">Salto Rapido al Canone</h3>
              <p className="text-xs opacity-60">Digita un numero da 1 a 1752</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Es. 1055, 204, 7, 1752..."
              className={`w-full text-xl font-mono text-center sm:text-left rounded-xl py-3.5 px-4 border focus:outline-none focus:ring-2 focus:ring-blue-600 ${inputBg}`}
            />
          </div>

          {/* Quick jump suggestions / chips */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="opacity-60 text-[11px] w-full sm:w-auto">Canoni frequenti:</span>
            {[7, 204, 331, 849, 1055, 1095, 1254, 1311, 1752].map((canNum) => (
              <button
                key={canNum}
                type="button"
                onClick={() => setInputValue(canNum.toString())}
                className="px-2 py-0.5 rounded border border-inherit hover:bg-black/5 dark:hover:bg-white/5 font-mono text-[11px] cursor-pointer"
              >
                Can. {canNum}
              </button>
            ))}
          </div>

          {/* Preview of destination */}
          {location && (
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Canone {location.number}: {location.bookNumber} ({location.bookTitle})</span>
              </div>
              <p className="text-stone-600 dark:text-gray-300">
                {location.titleNumber} · {location.titleName}
              </p>
              {existingCanon?.rubrica && (
                <p className="italic font-serif opacity-80 pt-0.5">
                  &ldquo;{existingCanon.rubrica}&rdquo;
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!isValidNumber}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Raggiungi Canone</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
