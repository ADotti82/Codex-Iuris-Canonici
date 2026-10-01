/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
}) => {
  const [inlineLatinOpen, setInlineLatinOpen] = useState<Record<string, boolean>>({});
  const [colorPickerOpenCanonId, setColorPickerOpenCanonId] = useState<string | null>(null);

  const toggleInlineLatin = (canonId: string) => {
    setInlineLatinOpen((prev) => ({
      ...prev,
      [canonId]: !prev[canonId],
    }));
  };

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  // Font size multiplier
  const textBodySize = fontSize === "sm" ? "text-sm leading-relaxed" 
    : fontSize === "base" ? "text-base leading-relaxed" 
    : fontSize === "lg" ? "text-lg leading-loose" 
    : "text-xl leading-loose";

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
    <main className={`flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 md:py-6 select-text transition-colors pb-28 md:pb-8 ${containerBg}`}>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        
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
                className={`relative rounded-xl border p-5 md:p-6 transition-all duration-200 shadow-xs ${cardBg} ${
                  isActive ? `${cardActiveBorder} shadow-md` : "hover:border-stone-300 dark:hover:border-gray-700"
                } ${getHighlightBg(canonHighlight)}`}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute -left-1 top-6 w-2 h-6 bg-blue-700 dark:bg-blue-400 rounded-r" />
                )}

                {/* Canon Header Card */}
                <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base md:text-lg text-blue-900 dark:text-blue-300 tracking-tight">
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
                <div className={`font-serif ${textBodySize} space-y-3`}>
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

                {/* Inline Latin Collapsible (If user opened inline) */}
                {isInlineLatin && (
                  <div className="mt-4 pt-3 border-t border-dashed border-inherit bg-stone-50/50 dark:bg-gray-800/40 rounded-lg p-3 text-xs font-serif italic text-stone-700 dark:text-gray-300 space-y-2">
                    <div className="flex items-center justify-between text-[11px] uppercase font-sans font-bold text-stone-500 tracking-wider">
                      <span>Testo Ufficiale Latino</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleInlineLatin(canon.id); }}
                        className="text-stone-400 hover:text-stone-700 dark:hover:text-gray-100 cursor-pointer"
                      >
                        Chiudi
                      </button>
                    </div>
                    {canon.paragraphs && canon.paragraphs.length > 0 ? (
                      canon.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>
                          {p.num && <strong className="font-sans not-italic mr-1">{p.num}</strong>}
                          {p.latinSub}
                        </p>
                      ))
                    ) : (
                      <p>{canon.latinText}</p>
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
                <div className="mt-4 pt-3 border-t border-inherit flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Left action tools */}
                  <div className="flex items-center gap-1.5">
                    {/* Latin toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLatinInspector(canon.id);
                        toggleInlineLatin(canon.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer"
                      title="Visualizza testo latino"
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
                        className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer ${
                          canonHighlight ? "text-amber-600 dark:text-amber-400" : ""
                        }`}
                        title="Evidenzia canone"
                      >
                        <Highlighter className="w-3.5 h-3.5" />
                        <span>Evidenzia</span>
                      </button>

                      {/* Color Picker Flyout */}
                      {colorPickerOpenCanonId === canon.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-0 bottom-full mb-1 z-30 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-stone-200 dark:border-gray-700 flex items-center gap-2"
                        >
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "yellow");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-5 h-5 rounded-full bg-yellow-400 hover:scale-110 transition-transform cursor-pointer border border-yellow-500 shadow-xs"
                            title="Giallo Studio"
                          />
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "green");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-110 transition-transform cursor-pointer border border-emerald-500 shadow-xs"
                            title="Verde Dottrinale"
                          />
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "blue");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-5 h-5 rounded-full bg-sky-400 hover:scale-110 transition-transform cursor-pointer border border-sky-500 shadow-xs"
                            title="Blu Giurisprudenziale"
                          />
                          <button
                            onClick={() => {
                              onSetHighlight(canon.id, canon.label, "red");
                              setColorPickerOpenCanonId(null);
                            }}
                            className="w-5 h-5 rounded-full bg-rose-400 hover:scale-110 transition-transform cursor-pointer border border-rose-500 shadow-xs"
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
                              <Trash2 className="w-3.5 h-3.5" />
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
                      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer"
                      title="Aggiungi o modifica nota"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>{canonNotes.length > 0 ? "Note" : "Annota"}</span>
                    </button>
                  </div>

                  {/* Right action tools */}
                  <div className="flex items-center gap-1.5">
                    {/* Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(canon, currentTitle.latinText);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer ${
                        isBookmarked ? "text-amber-600 dark:text-amber-400 font-semibold" : ""
                      }`}
                      title={isBookmarked ? "Rimuovi dai segnalibri" : "Aggiungi ai segnalibri"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                      <span className="hidden sm:inline">{isBookmarked ? "Salvato" : "Segnalibro"}</span>
                    </button>

                    {/* Copy citation */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyCitation(canon);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 font-sans font-medium transition-colors cursor-pointer"
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

        {/* Previous and Next Chapter / Title Footer Controls */}
        {!isSearchActive && (
          <nav className="pt-8 pb-12 border-t border-inherit flex items-center justify-between gap-4">
            {hasPrevTitle && onPrevTitle ? (
              <button
                onClick={onPrevTitle}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-inherit hover:bg-black/5 dark:hover:bg-white/5 font-serif text-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Titolo precedente</span>
              </button>
            ) : (
              <div />
            )}

            {hasNextTitle && onNextTitle && (
              <button
                onClick={onNextTitle}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 dark:bg-blue-700 hover:bg-blue-800 text-white font-serif text-sm shadow-xs transition-colors cursor-pointer ml-auto"
              >
                <span>Titolo successivo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </nav>
        )}
      </div>
    </main>
  );
};
