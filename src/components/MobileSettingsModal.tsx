/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Type, Download, HelpCircle, Palette, Sparkles, Check } from "lucide-react";
import { ThemeMode, FontSize } from "../types";

interface MobileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  onDownloadOffline: () => void;
  onOpenShortcuts: () => void;
}

export const MobileSettingsModal: React.FC<MobileSettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  onDownloadOffline,
  onOpenShortcuts,
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const modalBg = isDark
    ? "bg-[#111827] border-gray-700 text-gray-100"
    : isSepia
    ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]"
    : "bg-white border-stone-200 text-[#1C1917]";

  const buttonActive = isDark
    ? "bg-blue-600 text-white font-semibold"
    : isSepia
    ? "bg-[#DFD4C0] text-[#2C241B] font-semibold border-[#B8A88E]"
    : "bg-blue-900 text-white font-semibold";

  const buttonInactive = isDark
    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
    : isSepia
    ? "bg-[#EAE2D3] text-[#5C4F3F] hover:bg-[#DFD4C0]"
    : "bg-stone-100 text-stone-700 hover:bg-stone-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-serif font-bold text-base">Impostazioni e Aspetto</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
            Tema visivo
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onThemeChange("alabaster")}
              className={`py-2.5 px-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                theme === "alabaster" ? buttonActive : buttonInactive
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-[#FDFCFB] border border-stone-300" />
              <span>Avorio</span>
            </button>
            <button
              onClick={() => onThemeChange("sepia")}
              className={`py-2.5 px-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                theme === "sepia" ? buttonActive : buttonInactive
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-[#FAF7F0] border border-[#C5B7A0]" />
              <span>Seppia</span>
            </button>
            <button
              onClick={() => onThemeChange("dark")}
              className={`py-2.5 px-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                theme === "dark" ? buttonActive : buttonInactive
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-[#0B0F19] border border-gray-600" />
              <span>Notte</span>
            </button>
          </div>
        </div>

        {/* Font size */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>Dimensione testo</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {(["sm", "base", "lg", "xl"] as FontSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onFontSizeChange(size)}
                className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                  fontSize === size ? buttonActive : buttonInactive
                }`}
              >
                {size === "sm" ? "Compatto" : size === "base" ? "Normale" : size === "lg" ? "Grande" : "Max"}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-inherit">
          <button
            onClick={() => {
              onDownloadOffline();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Scarica Codice Completo (HTML offline)</span>
            </div>
            <span className="text-[10px] opacity-80 font-mono">1752 canoni</span>
          </button>

          <button
            onClick={() => {
              onOpenShortcuts();
              onClose();
            }}
            className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-xs border transition-colors cursor-pointer ${buttonInactive}`}
          >
            <HelpCircle className="w-4 h-4 opacity-70" />
            <span>Guida e Scorciatoie da tastiera</span>
          </button>
        </div>
      </div>
    </div>
  );
};
