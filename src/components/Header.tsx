/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Hash, 
  Download, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  Type,
  Menu,
  Sliders,
  X,
  Smartphone
} from "lucide-react";
import { ThemeMode, FontSize } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";

interface HeaderProps {
  currentBookNumber: string;
  currentBookTitle: string;
  currentTitleName: string;
  activeCanonLabel: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenQuickJump: () => void;
  onPrevCanon: () => void;
  onNextCanon: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenShortcuts: () => void;
  onDownloadOffline: () => void;
  onOpenMobileMenu?: () => void;
  onOpenMobileSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBookNumber,
  currentBookTitle,
  currentTitleName,
  activeCanonLabel,
  searchQuery,
  onSearchChange,
  onOpenQuickJump,
  onPrevCanon,
  onNextCanon,
  hasPrev,
  hasNext,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  isFocusMode,
  onToggleFocusMode,
  onOpenShortcuts,
  onDownloadOffline,
  onOpenMobileMenu,
  onOpenMobileSettings,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMobileSearchActive) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 60);
    }
  }, [isMobileSearchActive]);

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const headerBg = isDark 
    ? "bg-[#111827] border-gray-800 text-gray-100" 
    : isSepia 
    ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]" 
    : "bg-[#FFFFFF] border-stone-200 text-[#1C1917]";
  
  const inputBg = isDark 
    ? "bg-gray-800 text-gray-100 border-gray-700" 
    : isSepia 
    ? "bg-[#EAE2D3] text-[#2C241B] border-[#D9CDB8]" 
    : "bg-stone-100 text-stone-900 border-stone-200";

  const buttonHover = isDark 
    ? "hover:bg-gray-800 text-gray-300 hover:text-white" 
    : isSepia 
    ? "hover:bg-[#E5DCCB] text-[#5C4F3F] hover:text-[#2C241B]" 
    : "hover:bg-stone-100 text-stone-600 hover:text-stone-900";

  return (
    <header className={`h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] border-b flex items-center justify-between px-3 md:px-4 flex-shrink-0 z-30 select-none transition-colors ${headerBg}`}>
      {/* ========================================================= */}
      {/* MOBILE-ONLY HEADER VIEW                                  */}
      {/* ========================================================= */}
      <div className="flex md:hidden items-center justify-between w-full gap-2">
        {isMobileSearchActive ? (
          /* Mobile full-width search input */
          <div className="flex items-center gap-2 w-full animate-in fade-in duration-100">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-stone-400" />
              </div>
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cerca canone (es. 1055) o parola..."
                className={`w-full text-sm rounded-lg py-2 pl-9 pr-8 border focus:outline-none focus:ring-1.5 focus:ring-blue-600 ${inputBg}`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-2 flex items-center px-1 text-sm opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsMobileSearchActive(false);
                onSearchChange("");
              }}
              className="text-xs font-semibold px-2 py-2 text-blue-700 dark:text-blue-400 cursor-pointer shrink-0"
            >
              Chiudi
            </button>
          </div>
        ) : (
          /* Normal mobile top bar */
          <>
            {/* Left: Menu button + Brand */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onOpenMobileMenu}
                className="p-2 -ml-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform cursor-pointer shrink-0"
                title="Apri indice dei libri e titoli"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-blue-900 dark:text-blue-300" />
              </button>

              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-6 h-6 rounded bg-[#1E3A8A] flex items-center justify-center text-white font-serif font-bold text-[10px] tracking-wider shadow-xs shrink-0">
                  CIC
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-serif font-bold text-xs tracking-tight truncate">
                    CIC 1983
                  </span>
                  <span className="text-[10px] opacity-75 font-sans font-medium text-blue-800 dark:text-blue-300 truncate">
                    {activeCanonLabel || currentBookNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick actions on mobile */}
            <div className="flex items-center gap-1 shrink-0">
              {/* PWA Install Button */}
              <PWAInstallButton variant="header" />

              {/* Quick Jump */}
              <button
                onClick={onOpenQuickJump}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-stone-700 dark:text-gray-200"
                title="Vai al canone per numero"
                aria-label="Cerca per numero canone"
              >
                <Hash className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              </button>

              {/* Search trigger */}
              <button
                onClick={() => setIsMobileSearchActive(true)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-stone-700 dark:text-gray-200"
                title="Cerca nel Codice"
                aria-label="Cerca"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Settings / Appearance trigger */}
              <button
                onClick={onOpenMobileSettings}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-stone-700 dark:text-gray-200"
                title="Impostazioni tema e carattere"
                aria-label="Impostazioni"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP HEADER VIEW (Hidden on mobile)                    */}
      {/* ========================================================= */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Zone 1: Brand title & Location breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded bg-[#1E3A8A] flex items-center justify-center text-white font-serif font-bold text-xs tracking-wider shadow-sm shrink-0">
            CIC
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm tracking-wide shrink-0">
                Codex Iuris Canonici
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold tracking-wider">
                1983
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-gray-400 truncate">
              <span className="font-medium">{currentBookNumber}</span>
              <span className="opacity-40">·</span>
              <span className="truncate max-w-[140px] lg:max-w-[220px]" title={currentBookTitle}>
                {currentBookTitle}
              </span>
              {activeCanonLabel && (
                <>
                  <span className="opacity-40">·</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-400">
                    {activeCanonLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation, Search, and Quick Jump */}
        <div className="flex items-center gap-2 flex-1 max-w-xl mx-4">
          {/* Previous / Next buttons */}
          <div className="flex items-center rounded-lg border border-stone-200 dark:border-gray-700 p-0.5 shrink-0">
            <button
              onClick={onPrevCanon}
              disabled={!hasPrev}
              title="Canone precedente (← o K)"
              className={`p-1.5 rounded transition-colors ${buttonHover} disabled:opacity-30 disabled:pointer-events-none cursor-pointer`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextCanon}
              disabled={!hasNext}
              title="Canone successivo (→ o J)"
              className={`p-1.5 rounded transition-colors ${buttonHover} disabled:opacity-30 disabled:pointer-events-none cursor-pointer`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump by Number Button */}
          <button
            onClick={onOpenQuickJump}
            title="Vai direttamente a un canone per numero (G)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-gray-700 text-xs font-medium cursor-pointer transition-colors ${buttonHover} shrink-0`}
          >
            <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Vai al canone</span>
            <kbd className="hidden lg:inline text-[10px] font-mono opacity-60 bg-black/5 dark:bg-white/10 px-1 rounded">G</kbd>
          </button>

          {/* Search Input Box */}
          <div className="relative flex-1 group min-w-[140px]">
            <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-stone-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cerca canone (es. 1055) o parola..."
              className={`w-full text-xs rounded-lg py-1.5 pl-8 pr-12 border focus:outline-none focus:ring-1.5 focus:ring-blue-600 transition-all ${inputBg}`}
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-8 flex items-center text-[11px] text-stone-400 hover:text-stone-700 px-1 cursor-pointer"
              >
                ×
              </button>
            ) : null}
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <kbd className="text-[10px] font-mono text-stone-400 opacity-70">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* Zone 3: Actions & Study Tools */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Font size toggle */}
          <div className="hidden lg:flex items-center border border-stone-200 dark:border-gray-700 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => onFontSizeChange(fontSize === "xl" ? "lg" : fontSize === "lg" ? "base" : "sm")}
              title="Riduci dimensione carattere"
              disabled={fontSize === "sm"}
              className={`px-1.5 py-1 rounded transition-colors ${buttonHover} disabled:opacity-30 cursor-pointer`}
            >
              A-
            </button>
            <span className="px-1 text-[11px] opacity-60">
              <Type className="w-3 h-3 inline" />
            </span>
            <button
              onClick={() => onFontSizeChange(fontSize === "sm" ? "base" : fontSize === "base" ? "lg" : "xl")}
              title="Aumenta dimensione carattere"
              disabled={fontSize === "xl"}
              className={`px-1.5 py-1 rounded transition-colors ${buttonHover} disabled:opacity-30 cursor-pointer`}
            >
              A+
            </button>
          </div>

          {/* Theme mode segmented selector */}
          <div className="flex items-center border border-stone-200 dark:border-gray-700 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => onThemeChange("alabaster")}
              title="Tema Carta Calda"
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                theme === "alabaster" ? "bg-white text-stone-900 shadow-xs font-semibold" : buttonHover
              }`}
            >
              Avorio
            </button>
            <button
              onClick={() => onThemeChange("sepia")}
              title="Tema Pergamena Seppia"
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                theme === "sepia" ? "bg-[#DFD4C0] text-[#2C241B] shadow-xs font-semibold" : buttonHover
              }`}
            >
              Seppia
            </button>
            <button
              onClick={() => onThemeChange("dark")}
              title="Tema Notte / Scuro"
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                theme === "dark" ? "bg-gray-700 text-white shadow-xs font-semibold" : buttonHover
              }`}
            >
              Notte
            </button>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Focus Mode toggle */}
          <button
            onClick={onToggleFocusMode}
            title={isFocusMode ? "Disattiva modalità Focus (F)" : "Attiva modalità Focus senza distrazioni (F)"}
            className={`p-2 rounded-lg border border-stone-200 dark:border-gray-700 transition-colors cursor-pointer ${
              isFocusMode ? "bg-blue-600 text-white border-blue-600" : buttonHover
            }`}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Offline Button */}
          <button
            onClick={onDownloadOffline}
            title="Salva Codice completo come file HTML offline"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Scarica Offline</span>
          </button>

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={onOpenShortcuts}
            title="Scorciatoie da tastiera e guida (?)"
            className={`p-2 rounded-lg border border-stone-200 dark:border-gray-700 transition-colors cursor-pointer ${buttonHover}`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
