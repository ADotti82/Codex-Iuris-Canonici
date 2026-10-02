/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Book, Title, Canon, ThemeMode } from "../types";
import { ChevronDown, ChevronRight, BookOpen, Layers, BookmarkCheck, FileText, X, Smartphone } from "lucide-react";
import { PWAInstallButton } from "./PWAInstallButton";

interface SidebarLeftProps {
  books: Book[];
  activeBookId: string;
  activeTitleId: string;
  activeCanonId: string;
  onSelectTitle: (titleId: string, bookId: string) => void;
  onSelectCanon: (canonId: string) => void;
  theme: ThemeMode;
  bookmarkedIds: Set<string>;
  notedIds: Set<string>;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  books,
  activeBookId,
  activeTitleId,
  activeCanonId,
  onSelectTitle,
  onSelectCanon,
  theme,
  bookmarkedIds,
  notedIds,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Keep track of which books are open
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(() => ({
    "lib-1": true,
    "lib-2": false,
    "lib-3": false,
    "lib-4": true, // Often viewed (Sacraments / Matrimony)
    "lib-5": false,
    "lib-6": false,
    "lib-7": false,
  }));

  const [filterQuery, setFilterQuery] = useState("");

  const toggleBook = (bookId: string) => {
    setExpandedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleTitleClick = (titleId: string, bookId: string) => {
    onSelectTitle(titleId, bookId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleCanonClick = (canonId: string) => {
    onSelectCanon(canonId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const sidebarBg = isDark 
    ? "bg-[#111827] border-gray-800 text-gray-200" 
    : isSepia 
    ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]" 
    : "bg-[#F8F6F0] border-stone-200 text-[#1C1917]";

  const filterBg = isDark
    ? "bg-gray-800 text-gray-100 border-gray-700"
    : isSepia
    ? "bg-[#EAE2D3] text-[#2C241B] border-[#D9CDB8]"
    : "bg-white text-stone-900 border-stone-200";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-0
          w-[88vw] max-w-xs sm:max-w-sm md:w-72 lg:w-80 h-full
          pt-[env(safe-area-inset-top)] pb-[max(0.5rem,env(safe-area-inset-bottom))]
          border-r flex flex-col flex-shrink-0 select-none overflow-hidden transition-transform duration-200
          ${isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
          ${sidebarBg}
        `}
      >
        {/* Header index title & filter */}
        <div className="p-3 border-b border-inherit flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400">
              <Layers className="w-4 h-4" />
              <span>Indice Sistematico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono opacity-60">7 Libri</span>
              {/* Close Button on Mobile */}
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 cursor-pointer"
                title="Chiudi indice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtra per libro, titolo o materia..."
            className={`w-full text-xs rounded-lg px-2.5 py-2 border focus:outline-none focus:ring-1.5 focus:ring-blue-600 transition-colors ${filterBg}`}
          />
        </div>

        {/* Accordion scroll area */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {books.map((book) => {
            const isExpanded = !!expandedBooks[book.id];
            const isBookActive = book.id === activeBookId;

            // Check if filter matches book title or any inner title
            const q = filterQuery.toLowerCase().trim();
            const matchesBook = !q || 
              book.number.toLowerCase().includes(q) || 
              book.title.toLowerCase().includes(q) || 
              book.italianTitle.toLowerCase().includes(q) ||
              book.titles.some(t => t.latinText.toLowerCase().includes(q) || t.italianText.toLowerCase().includes(q));

            if (!matchesBook) return null;

            return (
              <div key={book.id} className="rounded-lg overflow-hidden transition-colors">
                {/* Book Header Accordion Button */}
                <button
                  onClick={() => toggleBook(book.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isBookActive
                      ? isDark ? "bg-gray-800/80 text-white font-semibold" : isSepia ? "bg-[#E7DFC9] font-semibold" : "bg-stone-200/70 font-semibold"
                      : isDark ? "hover:bg-gray-800/40 text-gray-300" : isSepia ? "hover:bg-[#EAE2D3] text-[#42372A]" : "hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-serif font-bold uppercase tracking-tight">
                        {book.number}
                      </span>
                      <span className="text-[11px] font-sans truncate opacity-80" title={book.italianTitle}>
                        {book.italianTitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] font-mono opacity-50">{book.canonRange}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </div>
                </button>

                {/* Subtitles & Canons within book */}
                {isExpanded && (
                  <div className="mt-1 ml-3 pl-2 border-l border-stone-300 dark:border-gray-700 space-y-1 py-1">
                    {book.titles.map((title) => {
                      const isTitleActive = title.id === activeTitleId;

                      return (
                        <div key={title.id} className="rounded-md">
                          <button
                            onClick={() => handleTitleClick(title.id, book.id)}
                            className={`w-full text-left p-2 rounded transition-all cursor-pointer ${
                              isTitleActive
                                ? isDark
                                  ? "bg-blue-900/40 text-blue-200 font-medium"
                                  : isSepia
                                  ? "bg-[#DFD4C0] text-[#2C241B] font-medium"
                                  : "bg-blue-50 text-blue-900 font-medium"
                                : isDark
                                ? "hover:bg-gray-800/40 text-gray-400 hover:text-gray-200"
                                : isSepia
                                ? "hover:bg-[#ECE4D5] text-[#5C4F3F] hover:text-[#2C241B]"
                                : "hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                            }`}
                          >
                            <div className="text-[10px] font-mono opacity-70">
                              {title.number} {title.canonRange ? `· ${title.canonRange}` : ""}
                            </div>
                            <div className="text-xs truncate font-serif" title={title.latinText}>
                              {title.latinText}
                            </div>
                            <div className="text-[10px] truncate opacity-75 font-sans" title={title.italianText}>
                              {title.italianText}
                            </div>
                          </button>

                          {/* If this title is currently active, show child canons for rapid picking */}
                          {isTitleActive && (
                            <div className="mt-1 ml-2 pl-2 border-l border-blue-400/40 space-y-0.5 max-h-56 overflow-y-auto pr-1">
                              {title.canons.map((canon) => {
                                const isCanonActive = canon.id === activeCanonId;
                                const isBookmarked = bookmarkedIds.has(canon.id);
                                const hasNotes = notedIds.has(canon.id);

                                return (
                                  <button
                                    key={canon.id}
                                    onClick={() => handleCanonClick(canon.id)}
                                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between text-xs transition-colors cursor-pointer ${
                                      isCanonActive
                                        ? "bg-blue-600 text-white font-medium"
                                        : isDark
                                        ? "hover:bg-gray-800/80 text-gray-300"
                                        : isSepia
                                        ? "hover:bg-[#E2D7C2] text-[#42372A]"
                                        : "hover:bg-stone-200/60 text-stone-700"
                                    }`}
                                  >
                                    <span className="font-mono text-[11px] truncate">
                                      {canon.label} {canon.rubrica ? `— ${canon.rubrica}` : ""}
                                    </span>
                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                      {isBookmarked && (
                                        <BookmarkCheck className={`w-3 h-3 ${isCanonActive ? "text-white" : "text-amber-500"}`} />
                                      )}
                                      {hasNotes && (
                                        <FileText className={`w-3 h-3 ${isCanonActive ? "text-white" : "text-blue-500"}`} />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* PWA Install Promo in Mobile Drawer */}
        <div className="p-2 border-t border-inherit">
          <PWAInstallButton variant="mobile-action" />
        </div>

        {/* Bottom status stats */}
        <div className="p-2.5 border-t border-inherit text-[10px] font-mono opacity-60 flex items-center justify-between shrink-0">
          <span>Codex 1983</span>
          <span>1752 Canoni</span>
        </div>
      </aside>
    </>
  );
};
