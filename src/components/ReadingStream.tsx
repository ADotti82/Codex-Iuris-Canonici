/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Canon, 
  Title, 
  Book, 
  ThemeMode, 
  FontSize, 
  HighlightColor,
  Note
} from "../types";
import { 
  BookOpen, 
  Star, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Languages,
  Highlighter,
  Trash2
} from "lucide-react";

interface ReadingStreamProps {
  currentBook: Book;
  currentTitle: Title;
  canons: Canon[];
  activeCanonId: string;
  onSelectCanon: (canonId: string) => void;
  onJumpToCanonRef: (refText: string) => void;
  isSearchActive: boolean;
  searchQuery: string;
  searchResults: { book: Book; title: Title; canon: Canon }[];
  theme: ThemeMode;
  fontSize: FontSize;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (canon: Canon, titleText: string) => void;
  highlights: Record<string, HighlightColor>;
  onSetHighlight: (canonId: string, canonNumber: string, color: HighlightColor | null) => void;
  notes: Note[];
  onOpenNoteEditor: (canonId: string) => void;
  onToggleLatinInspector: (canonId: string) => void;
  onCopyCitation: (canon: Canon) => void;
  onPrevTitle?: () => void;
  onNextTitle?: () => void;
  hasPrevTitle?: boolean;
  hasNextTitle?: boolean;
  onPrevCanon?: () => void;
  onNextCanon?: () => void;
  hasPrevCanon?: boolean;
  hasNextCanon?: boolean;
  onVisibleCanonChange?: (canonId: string) => void;
}

export const ReadingStream: React.FC<ReadingStreamProps> = ({
  currentBook,
  currentTitle,
  canons,
  activeCanonId,
  onSelectCanon,
  onJumpToCanonRef,
  isSearchActive,
  searchQuery,
  searchResults,
  theme,
  fontSize,
  bookmarkedIds,
  onToggleBookmark,
  highlights,
  onSetHighlight,
  notes,
  onOpenNoteEditor,
  onToggleLatinInspector,
  onCopyCitation,
  onPrevTitle,
  onNextTitle,
  hasPrevTitle,
  hasNextTitle,
  onPrevCanon,
  onNextCanon,
  hasPrevCanon,
  hasNextCanon,
  onVisibleCanonChange,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [inlineLatinOpen, setInlineLatinOpen] = useState<Record<string, boolean>>({});
  const [colorPickerOpenCanonId, setColorPickerOpenCanonId] = useState<string | null>(null);

  // Synchronize visible canon when user manually scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onVisibleCanonChange) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        const activeList = isSearchActive && searchResults.length > 0 
          ? searchResults.map(r => r.canon) 
          : canons;

        // Edge case: scrolled to the very top
        if (container.scrollTop < 60 && activeList.length > 0) {
          const firstId = activeList[0].id;
          if (firstId !== activeCanonId) {
            onVisibleCanonChange(firstId);
          }
          return;
        }

        // Edge case: scrolled to the very bottom
        if (container.scrollHeight - container.scrollTop - container.clientHeight < 60 && activeList.length > 0) {
          const lastId = activeList[activeList.length - 1].id;
          if (lastId !== activeCanonId) {
            onVisibleCanonChange(lastId);
          }
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const articles = container.querySelectorAll("article[id^='canon-card-']");
        let closestCanonId: string | null = null;
        let minDistance = Infinity;
        const focalLine = containerRect.top + 90;

        articles.forEach((art) => {
          const rect = art.getBoundingClientRect();
          if (rect.bottom > containerRect.top + 30 && rect.top < containerRect.bottom - 30) {
            const dist = Math.abs(rect.top - focalLine);
            if (dist < minDistance) {
              minDistance = dist;
              closestCanonId = art.id.replace("canon-card-", "");
            }
          }
        });

        if (closestCanonId && closestCanonId !== activeCanonId) {
          onVisibleCanonChange(closestCanonId);
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeCanonId, onVisibleCanonChange, canons, isSearchActive, searchResults]);

  const toggleInlineLatin = (canonId: string) => {
    setInlineLatinOpen((prev) => ({
      ...prev,
      [canonId]: !prev[canonId],
    }));
  };

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  // Font size multiplier with mobile responsiveness
  const textBodySize = fontSize === "sm" ? "text-xs sm:text-sm leading-relaxed" 
    : fontSize === "base" ? "text-[15px] sm:text-base leading-relaxed" 
    : fontSize === "lg" ? "text-base sm:text-lg leading-relaxed" 
    : "text-lg sm:text-xl leading-relaxed";

  const containerBg = isDark ? "bg-[#0B0F19] text-gray-200" 
    : isSepia ? "bg-[#FAF7F0] text-[#2C241B]" 
    : "bg-[#FDFCFB] text-[#1C1917]";

  const cardBg = isDark ? "bg-[#111827] border-gray-800 text-gray-200" 
    : isSepia ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]" 
    : "bg-white border-stone-200 text-[#1C1917]";

  const cardActiveBorder = isDark ? "ring-2 ring-blue-500/70 bg-gray-900/90" 
    : isSepia ? "ring-2 ring-[#B45309]/50 bg-[#EFE8DC]" 
    : "ring-2 ring-blue-700/40 bg-stone-50/60";

  const getHighlightBg = (color?: HighlightColor) => {
    if (!color) return "";
    switch (color) {
      case "yellow": return isDark ? "bg-amber-950/40 border-l-4 border-l-amber-400" : isSepia ? "bg-[#FDF3C7]/60 border-l-4 border-l-amber-500" : "bg-amber-50 border-l-4 border-l-amber-400";
      case "green": return isDark ? "bg-emerald-950/40 border-l-4 border-l-emerald-400" : isSepia ? "bg-[#D1FAE5]/60 border-l-4 border-l-emerald-600" : "bg-emerald-50 border-l-4 border-l-emerald-500";
      case "blue": return isDark ? "bg-sky-950/40 border-l-4 border-l-sky-400" : isSepia ? "bg-[#E0F2FE]/60 border-l-4 border-l-sky-600" : "bg-sky-50 border-l-4 border-l-sky-500";
      case "red": return isDark ? "bg-rose-950/40 border-l-4 border-l-rose-400" : isSepia ? "bg-[#FFE4E6]/60 border-l-4 border-l-rose-600" : "bg-rose-50 border-l-4 border-l-rose-500";
      default: return "";
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/80 text-inherit px-0.5 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <main
      ref={containerRef}
      id="reading-stream-container"
      className={`flex-1 overflow-y-auto px-2.5 sm:px-6 md:px-8 py-3 sm:py-6 select-text transition-colors pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8 ${containerBg}`}
    >
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        
        {/* Search Mode Header or Normal Title Header */}
        {isSearchActive ? (
          <div className="border-b border-inherit pb-4 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-serif font-bold text-blue-900 dark:text-blue-300">
                Risultati della ricerca per &ldquo;{searchQuery}&rdquo;
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                {searchResults.length} {searchResults.length === 1 ? "canone trovato" : "canoni trovati"}
              </span>
            </div>
            <p className="text-xs opacity-75 mt-1">
              Clicca su un canone per posizionarti ed esaminarlo nel dettaglio.
            </p>
          </div>
        ) : (
          <header className="border-b border-inherit pb-6 mb-8 text-center space-y-2">
            <div className="text-xs uppercase font-serif tracking-widest text-blue-800 dark:text-blue-400 font-semibold">
              {currentBook.number} · {currentBook.title}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
              {currentTitle.latinText}
            </h1>
            <p className="text-base italic font-serif opacity-80">
              {currentTitle.italianText}
            </p>
            {currentTitle.canonRange && (
              <div className="pt-1">
                <span className="text-xs font-mono opacity-60 px-2 py-0.5 rounded-full border border-inherit">
                  {currentTitle.canonRange}
                </span>
              </div>
            )}
          </header>
        )}

        {/* Content stream: List of search results or list of chapter canons */}
        <div className="space-y-6">
          {(isSearchActive ? searchResults.map(r => r.canon) : canons).map((canon) => {
            const isActive = canon.id === activeCanonId;
            const isBookmarked = bookmarkedIds.has(canon.id);
            const canonNotes = notes.filter((n) => n.canonId === canon.id);
            const canonHighlight = highlights[canon.id];
            const isInlineLatin = !!inlineLatinOpen[canon.id];

            return (
              <article
                key={canon.id}
                id={`canon-card-${canon.id}`}
                onClick={() => onSelectCanon(canon.id)}
                className={`relative rounded-xl border p-3.5 sm:p-5 md:p-6 transition-all duration-200 shadow-xs scroll-mt-4 sm:scroll-mt-6 ${cardBg} ${
                  isActive ? `${cardActiveBorder} shadow-md` : "hover:border-stone-300 dark:hover:border-gray-700"
                } ${getHighlightBg(canonHighlight)}`}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute -left-1 top-4 sm:top-6 w-1.5 sm:w-2 h-6 bg-blue-700 dark:bg-blue-400 rounded-r" />
                )}

                {/* Canon Header Card */}
                <div className="flex items-center justify-between pb-2.5 border-b border-inherit mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base sm:text-lg text-blue-900 dark:text-blue-300 tracking-tight">
                      {canon.label}
                    </span>
                    {canon.rubrica && (
                      <>
                        <span className="text-stone-300 dark:text-gray-600">/</span>
                        <span className="text-xs font-sans font-medium text-stone-600 dark:text-gray-300 italic">
                          {canon.rubrica}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Bookmark badge if saved */}
                  {isBookmarked && (
                    <span className="flex items-center gap-1 text-[11px] font-sans text-amber-600 dark:text-amber-400 font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Nei segnalibri</span>
                    </span>
                  )}
                </div>

                {/* Italian Normative Text (Main Reading) */}
                <div className={`font-serif ${textBodySize} space-y-2.5 sm:space-y-3`}>
                  {canon.paragraphs && canon.paragraphs.length > 0 ? (
                    canon.paragraphs.map((p, pIdx) => (
                      <div key={pIdx} className="flex gap-2">
                        {p.num && (
                          <span className="font-sans font-bold text-blue-800 dark:text-blue-400 shrink-0">
                            {p.num}
                          </span>
                        )}
                        <p className="flex-1">
                          {isSearchActive 
                            ? highlightMatch(p.italianSub, searchQuery)
                            : p.italianSub}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>
                      {isSearchActive 
                        ? highlightMatch(canon.italianText, searchQuery)
                        : canon.italianText}
                    </p>
                  )}
                </div>

                {/* Inline Latin Collapsible (Parallel authentic Latin view) */}
                {isInlineLatin && (
                  <div className="mt-3.5 pt-3 border-t border-dashed border-inherit bg-amber-50/50 dark:bg-gray-800/60 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-serif italic text-stone-800 dark:text-gray-200 space-y-2 border-l-4 border-l-amber-500 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] uppercase font-sans font-bold text-amber-900 dark:text-amber-300 tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5" />
                        <span>Testo Ufficiale Latino</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const fullLatin = canon.paragraphs && canon.paragraphs.length > 0
                              ? `${canon.label}\n` + canon.paragraphs.map(p => `${p.num ? p.num + " " : ""}${p.latinSub}`).join("\n")
                              : `${canon.label}\n${canon.latinText}`;
                            navigator.clipboard.writeText(fullLatin);
                          }}
                          className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer flex items-center gap-1"
                          title="Copia testo latino"
                        >
                          <Copy className="w-3 h-3" />
                          <span className="normal-case font-normal text-[10px]">Copia</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleInlineLatin(canon.id); }}
                          className="text-stone-400 hover:text-stone-700 dark:hover:text-gray-100 cursor-pointer"
                        >
                          Chiudi
                        </button>
                      </div>
                    </div>
                    {canon.paragraphs && canon.paragraphs.length > 0 ? (
                      canon.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="leading-relaxed">
                          {p.num && <strong className="font-sans not-italic mr-1.5 text-blue-900 dark:text-blue-300">{p.num}</strong>}
                          {p.latinSub}
                        </p>
                      ))
                    ) : (
                      <p className="leading-relaxed">{canon.latinText}</p>
                    )}
                  </div>
                )}

                {/* Cross References (Clickable Links) */}
                {canon.references && canon.references.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-mono opacity-60">Riferimenti:</span>
                    {canon.references.map((ref) => (
                      <button
                        key={ref}
                        onClick={(e) => {
                          e.stopPropagation();
                          onJumpToCanonRef(ref);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:bg-blue-100 hover:underline font-mono text-[11px] transition-colors cursor-pointer"
                      >
                        {ref}
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Fonti & Interpretazioni Pontificie */}
                {canon.fonti && canon.fonti.length > 0 && (
                  <div className="mt-3 p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] font-sans">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 mr-1.5">
                      Fonti & Interpretazioni:
                    </span>
                    <span className="text-emerald-900 dark:text-emerald-200 italic">
                      {canon.fonti.join(" • ")}
                    </span>
                  </div>
                )}

                {/* Personal Notes Snippet if any */}
                {canonNotes.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs">
                    <div className="flex items-center gap-1.5 font-sans font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{canonNotes.length === 1 ? "1 Annotazione personale" : `${canonNotes.length} Annotazioni personali`}</span>
                    </div>
                    <p className="text-stone-700 dark:text-gray-300 italic line-clamp-2">
                      &ldquo;{canonNotes[0].text}&rdquo;
                    </p>
                  </div>
                )}

                {/* Action Toolbar on Bottom */}
                <div className="mt-3.5 pt-2.5 border-t border-inherit flex flex-wrap items-center justify-between gap-1.5 text-xs">
                  {/* Left action tools */}
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    {/* Latin toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInlineLatin(canon.id);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-sans font-medium transition-colors cursor-pointer min-h-[36px] active:scale-95 ${
                        isInlineLatin
                          ? "bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-semibold"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                      title="Visualizza testo latino a fronte"
                    >
                      <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Latino</span>
                    </button>

                    {/* Highlight Picker button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setColorPickerOpenCanonId(colorPickerOpenCanonId === canon.id ? null : canon.id);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer min-h-[36px] active:scale-95 ${
                          canonHighlight ? "text-amber-600 dark:text-amber-400 font-semibold" : ""
                        }`}
                        title="Evidenzia canone"
                      >
                        <Highlighter className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Evidenzia</span>
                      </button>

                      {/* Color Picker Flyout */}
                      {colorPickerOpenCanonId === canon.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 bottom-full mb-1.5 z-40 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-stone-200 dark:border-gray-700 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "yellow");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-6 h-6 rounded-full bg-yellow-400 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-yellow-500 shadow-xs"
                            title="Giallo Studio"
                          />
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "green");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-6 h-6 rounded-full bg-emerald-400 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-emerald-500 shadow-xs"
                            title="Verde Dottrinale"
                          />
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "blue");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-6 h-6 rounded-full bg-sky-400 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-sky-500 shadow-xs"
                            title="Blu Giurisprudenziale"
                          />
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "red");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-6 h-6 rounded-full bg-rose-400 hover:scale-110 active:scale-90 transition-transform cursor-pointer border border-rose-500 shadow-xs"
                            title="Rosso Vincolante"
                          />
                          {canonHighlight && (
                            <button
                              onClick={() => {
                                onSetHighlight(canon.id, canon.label, null);
                                setColorPickerOpenCanonId(null);
                              }}
                              className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-gray-200 cursor-pointer"
                              title="Rimuovi evidenziazione"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Note editor button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenNoteEditor(canon.id);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer min-h-[36px] active:scale-95"
                      title="Aggiungi o modifica nota"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>{canonNotes.length > 0 ? `Note (${canonNotes.length})` : "Annota"}</span>
                    </button>
                  </div>

                  {/* Right action tools */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(canon, currentTitle.latinText);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer min-h-[36px] active:scale-95 ${
                        isBookmarked ? "text-amber-600 dark:text-amber-400 font-semibold" : ""
                      }`}
                      title={isBookmarked ? "Rimuovi dai segnalibri" : "Aggiungi ai segnalibri"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                      <span className="hidden xs:inline">{isBookmarked ? "Salvato" : "Segnalibro"}</span>
                    </button>

                    {/* Copy citation */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyCitation(canon);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer min-h-[36px] active:scale-95"
                      title="Copia citazione formale negli appunti"
                    >
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span className="hidden sm:inline">Copia</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Direct Canon & Title Footer Navigation */}
        {!isSearchActive && (
          <div className="pt-6 pb-12 border-t border-inherit space-y-4">
            {/* Quick Prev / Next Canon Jump Cards */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onPrevCanon}
                disabled={!hasPrevCanon}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-inherit hover:bg-black/5 dark:hover:bg-white/5 active:scale-98 disabled:opacity-25 disabled:pointer-events-none text-xs font-serif font-semibold transition cursor-pointer"
                title="Vai al canone precedente"
              >
                <ChevronLeft className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Canone precedente</span>
              </button>

              <button
                onClick={onNextCanon}
                disabled={!hasNextCanon}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-900 dark:bg-blue-700 hover:bg-blue-800 active:scale-98 disabled:opacity-25 disabled:pointer-events-none text-white text-xs font-serif font-semibold shadow-xs transition cursor-pointer"
                title="Vai al canone successivo"
              >
                <span>Canone successivo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Title / Rubric Navigation */}
            <nav className="pt-3 border-t border-dashed border-inherit flex items-center justify-between gap-2 text-xs">
              {hasPrevTitle && onPrevTitle ? (
                <button
                  onClick={onPrevTitle}
                  className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg opacity-75 hover:opacity-100 font-sans transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px] sm:max-w-none">Titolo prec.</span>
                </button>
              ) : (
                <div />
              )}

              {hasNextTitle && onNextTitle && (
                <button
                  onClick={onNextTitle}
                  className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg opacity-75 hover:opacity-100 font-sans transition-colors cursor-pointer ml-auto"
                >
                  <span className="truncate max-w-[140px] sm:max-w-none">Titolo succ.</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </main>
  );
};
