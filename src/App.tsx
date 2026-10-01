/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  CANON_BOOKS, 
  ALL_CANONS_LIST, 
  CANON_BY_ID_MAP, 
  CANON_BY_NUMBER_MAP, 
  getCanonLocation 
} from "./data";
import { 
  Book, 
  Title, 
  Canon, 
  Note, 
  Bookmark, 
  HighlightColor, 
  HistoryItem, 
  ThemeMode, 
  FontSize 
} from "./types";
import { Header } from "./components/Header";
import { SidebarLeft } from "./components/SidebarLeft";
import { ReadingStream } from "./components/ReadingStream";
import { SidebarRight } from "./components/SidebarRight";
import { QuickJumpModal } from "./components/QuickJumpModal";
import { ShortcutsModal } from "./components/ShortcutsModal";
import { MobileSettingsModal } from "./components/MobileSettingsModal";
import { Layers, Hash, ChevronLeft, ChevronRight, Languages, Sliders } from "lucide-react";

export default function App() {
  // --- Persistent User Preferences ---
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("cic_1983_theme") as ThemeMode) || "alabaster";
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem("cic_1983_font_size") as FontSize) || "base";
  });

  // --- Persistent Study Data ---
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("cic_1983_notes");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: "note-init-1",
        canonId: "can-7",
        canonNumber: "Can. 7",
        canonSubject: "Promulgazione della legge",
        text: "La promulgazione costituisce il momento formale in cui la legge ecclesiastica viene resa pubblica e istituita. Cfr. Can. 8 per le modalità di pubblicazione su AAS.",
        dateCreated: "Oggi",
      },
      {
        id: "note-init-2",
        canonId: "can-1055",
        canonNumber: "Can. 1055",
        canonSubject: "Definizione del matrimonio",
        text: "Principio fondamentale: il patto matrimoniale (totius vitae consortium) tra battezzati è per sua natura sacramento inscindibile.",
        dateCreated: "Oggi",
      }
    ];
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem("cic_1983_bookmarks");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        canonId: "can-7",
        canonNumber: "Can. 7",
        titleText: "Istituzione della legge",
        dateAdded: "Oggi",
      },
      {
        canonId: "can-1055",
        canonNumber: "Can. 1055",
        titleText: "Il Matrimonio canonico",
        dateAdded: "Oggi",
      }
    ];
  });

  const [highlights, setHighlights] = useState<Record<string, HighlightColor>>(() => {
    const saved = localStorage.getItem("cic_1983_highlights");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      "can-7": "blue",
      "can-1055": "yellow",
    };
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("cic_1983_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { canonId: "can-7", canonNumber: "Can. 7", titleText: "De legibus ecclesiasticis", timestamp: Date.now() }
    ];
  });

  // Save persistent data
  useEffect(() => {
    localStorage.setItem("cic_1983_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cic_1983_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("cic_1983_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("cic_1983_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("cic_1983_highlights", JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    localStorage.setItem("cic_1983_history", JSON.stringify(history));
  }, [history]);

  // --- Active Hierarchy Navigation ---
  const [activeBookId, setActiveBookId] = useState<string>("lib-1");
  const [activeTitleId, setActiveTitleId] = useState<string>("lib1-tit-1");
  const [activeCanonId, setActiveCanonId] = useState<string>("can-7");

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth >= 1024;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Resolve active objects
  const activeBook = CANON_BOOKS.find((b) => b.id === activeBookId) || CANON_BOOKS[0];
  const activeTitle = activeBook.titles.find((t) => t.id === activeTitleId) || activeBook.titles[0];
  const activeCanon = CANON_BY_ID_MAP[activeCanonId] || activeTitle.canons[0] || ALL_CANONS_LIST[0];

  // Record history when activeCanon changes
  const recordHistory = (canon: Canon) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.canonId !== canon.id);
      return [
        {
          canonId: canon.id,
          canonNumber: canon.label,
          titleText: canon.rubrica || activeTitle.latinText,
          timestamp: Date.now(),
        },
        ...filtered.slice(0, 19),
      ];
    });
  };

  // Canon navigation index
  const activeCanonIndex = ALL_CANONS_LIST.findIndex((c) => c.id === activeCanonId);
  const hasPrev = activeCanonIndex > 0;
  const hasNext = activeCanonIndex >= 0 && activeCanonIndex < ALL_CANONS_LIST.length - 1;

  // Title navigation within books
  const allTitlesFlat: { bookId: string; title: Title }[] = [];
  CANON_BOOKS.forEach((b) => {
    b.titles.forEach((t) => {
      allTitlesFlat.push({ bookId: b.id, title: t });
    });
  });

  const currentTitleIndex = allTitlesFlat.findIndex(
    (item) => item.bookId === activeBookId && item.title.id === activeTitleId
  );
  const hasPrevTitle = currentTitleIndex > 0;
  const hasNextTitle = currentTitleIndex < allTitlesFlat.length - 1;

  const handlePrevTitle = () => {
    if (hasPrevTitle) {
      const prev = allTitlesFlat[currentTitleIndex - 1];
      setActiveBookId(prev.bookId);
      setActiveTitleId(prev.title.id);
      if (prev.title.canons.length > 0) {
        handleSelectCanon(prev.title.canons[0].id);
      }
    }
  };

  const handleNextTitle = () => {
    if (hasNextTitle) {
      const next = allTitlesFlat[currentTitleIndex + 1];
      setActiveBookId(next.bookId);
      setActiveTitleId(next.title.id);
      if (next.title.canons.length > 0) {
        handleSelectCanon(next.title.canons[0].id);
      }
    }
  };

  // Select a Title from the sidebar
  const handleSelectTitle = (titleId: string, bookId: string) => {
    setActiveBookId(bookId);
    setActiveTitleId(titleId);
    const targetBook = CANON_BOOKS.find((b) => b.id === bookId);
    const targetTitle = targetBook?.titles.find((t) => t.id === titleId);
    if (targetTitle && targetTitle.canons.length > 0) {
      handleSelectCanon(targetTitle.canons[0].id);
    }
  };

  // Select a Canon and scroll it smoothly into view
  const handleSelectCanon = (canonId: string) => {
    const target = CANON_BY_ID_MAP[canonId];
    if (target) {
      setActiveBookId(target.bookId);
      setActiveTitleId(target.titleId);
      setActiveCanonId(target.id);
      recordHistory(target);

      setTimeout(() => {
        const el = document.getElementById(`canon-card-${target.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.remove("canon-active-pulse");
          void el.offsetWidth; // trigger reflow
          el.classList.add("canon-active-pulse");
        }
      }, 80);
    }
  };

  // Jump to next / prev canon
  const handlePrevCanon = () => {
    if (hasPrev) {
      const prevCanon = ALL_CANONS_LIST[activeCanonIndex - 1];
      handleSelectCanon(prevCanon.id);
    }
  };

  const handleNextCanon = () => {
    if (hasNext) {
      const nextCanon = ALL_CANONS_LIST[activeCanonIndex + 1];
      handleSelectCanon(nextCanon.id);
    }
  };

  // Jump by Canon number (1..1752)
  const handleJumpToNumber = (num: number) => {
    const exact = CANON_BY_NUMBER_MAP[num];
    if (exact) {
      handleSelectCanon(exact.id);
      showToast(`Navigato a ${exact.label}`);
      return;
    }

    // If canon is in the structural schema
    const loc = getCanonLocation(num);
    setActiveBookId(loc.bookId);
    setActiveTitleId(loc.titleId);
    showToast(`Posizionato in ${loc.bookNumber} — ${loc.titleName} (Can. ${num})`);
  };

  // Jump from cross-reference string like "Can. 1056"
  const handleJumpToCanonRef = (refText: string) => {
    const match = refText.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      handleJumpToNumber(num);
    }
  };

  // Bookmarks toggle
  const handleToggleBookmark = (canon: Canon, titleText: string) => {
    const exists = bookmarks.some((b) => b.canonId === canon.id);
    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.canonId !== canon.id));
      showToast(`${canon.label} rimosso dai preferiti`);
    } else {
      const newBm: Bookmark = {
        canonId: canon.id,
        canonNumber: canon.label,
        titleText: canon.rubrica || titleText,
        dateAdded: "Oggi, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBookmarks((prev) => [newBm, ...prev]);
      showToast(`${canon.label} aggiunto ai preferiti`);
    }
  };

  // Highlights
  const handleSetHighlight = (canonId: string, canonNumber: string, color: HighlightColor | null) => {
    setHighlights((prev) => {
      const copy = { ...prev };
      if (!color) {
        delete copy[canonId];
        showToast(`Evidenziazione rimossa da ${canonNumber}`);
      } else {
        copy[canonId] = color;
        showToast(`${canonNumber} evidenziato`);
      }
      return copy;
    });
  };

  // Notes
  const handleAddNote = (canonId: string, text: string) => {
    const target = CANON_BY_ID_MAP[canonId];
    const newNote: Note = {
      id: `note-${Date.now()}`,
      canonId,
      canonNumber: target ? target.label : `Can. ${canonId}`,
      canonSubject: target?.rubrica,
      text,
      dateCreated: "Oggi, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast(`Nota registrata per ${newNote.canonNumber}`);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast("Annotazione rimossa");
  };

  // Copy formal legal citation
  const handleCopyCitation = (canon: Canon) => {
    let citation = `Codex Iuris Canonici (1983), ${canon.label}`;
    if (canon.rubrica) citation += ` [${canon.rubrica}]`;
    citation += `:\n«${canon.italianText}»`;

    if (canon.paragraphs && canon.paragraphs.length > 0) {
      citation += "\n" + canon.paragraphs.map(p => `${p.num || ""} ${p.italianSub}`).join("\n");
    }

    navigator.clipboard.writeText(citation).then(() => {
      showToast(`Citazione formale del ${canon.label} copiata negli appunti`);
    }).catch(() => {
      showToast("Impossibile accedere agli appunti del dispositivo");
    });
  };

  // Search indexing
  const isSearchActive = searchQuery.trim().length > 0;
  const searchResults: { book: Book; title: Title; canon: Canon }[] = [];

  if (isSearchActive) {
    const q = searchQuery.toLowerCase().trim();
    // Check if query is just a canon number
    const isNumOnly = /^\d+$/.test(q);
    const parsedNum = parseInt(q, 10);

    CANON_BOOKS.forEach((book) => {
      book.titles.forEach((title) => {
        title.canons.forEach((canon) => {
          let matches = false;
          if (isNumOnly && canon.number === parsedNum) {
            matches = true;
          } else if (
            canon.label.toLowerCase().includes(q) ||
            (canon.rubrica && canon.rubrica.toLowerCase().includes(q)) ||
            canon.italianText.toLowerCase().includes(q) ||
            canon.latinText.toLowerCase().includes(q)
          ) {
            matches = true;
          } else if (canon.paragraphs) {
            matches = canon.paragraphs.some(
              (p) => p.italianSub.toLowerCase().includes(q) || p.latinSub.toLowerCase().includes(q)
            );
          }

          if (matches) {
            searchResults.push({ book, title, canon });
          }
        });
      });
    });
  }

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") {
        if (e.key === "Escape") {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        e.preventDefault();
        setIsQuickJumpOpen(true);
      } else if (e.key.toLowerCase() === "j" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNextCanon();
      } else if (e.key.toLowerCase() === "k" || e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevCanon();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        setIsRightPanelOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === "b" && activeCanon) {
        e.preventDefault();
        handleToggleBookmark(activeCanon, activeTitle.latinText);
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsRightPanelOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (e.key === "Escape") {
        setSearchQuery("");
        setIsQuickJumpOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCanonIndex, activeCanon, activeTitle]);

  // Export User Data as JSON
  const handleExportUserData = () => {
    const payload = {
      app: "Codex Iuris Canonici 1983",
      exportedAt: new Date().toISOString(),
      notes,
      bookmarks,
      highlights,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CIC_Annotazioni_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("File di backup JSON scaricato con successo");
  };

  // Import User Data from JSON
  const handleImportUserData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.notes && Array.isArray(data.notes)) setNotes(data.notes);
      if (data.bookmarks && Array.isArray(data.bookmarks)) setBookmarks(data.bookmarks);
      if (data.highlights && typeof data.highlights === "object") setHighlights(data.highlights);
      showToast("Dati e note ripristinati con successo!");
    } catch (err) {
      showToast("Formato del file di backup non valido");
    }
  };

  // Download entire application as single-file HTML
  const handleDownloadOfflineHtml = () => {
    // We clone the active document HTML or create a clean downloadable bundle
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([`<!doctype html>\n${htmlContent}`], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Codex_Iuris_Canonici_1983_Offline.html";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Applicazione salvata per l'uso autonomo offline!");
  };

  // Bookmarked and Noted IDs for quick sidebar badges
  const bookmarkedIds = new Set(bookmarks.map((b) => b.canonId));
  const notedIds = new Set(notes.map((n) => n.canonId));

  const appThemeClass = theme === "dark" ? "dark bg-[#0B0F19]" : theme === "sepia" ? "bg-[#FAF7F0]" : "bg-[#FDFCFB]";

  return (
    <div className={`h-[100dvh] w-full flex flex-col overflow-hidden font-sans ${appThemeClass}`}>
      {/* Top Application Bar */}
      <Header
        currentBookNumber={activeBook.number}
        currentBookTitle={activeBook.title}
        currentTitleName={activeTitle.latinText}
        activeCanonLabel={activeCanon ? activeCanon.label : ""}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onPrevCanon={handlePrevCanon}
        onNextCanon={handleNextCanon}
        hasPrev={hasPrev}
        hasNext={hasNext}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onDownloadOffline={handleDownloadOfflineHtml}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenMobileSettings={() => setIsMobileSettingsOpen(true)}
      />

      {/* Main Workbench Body: Sidebar Left | Continuous Reading Stream | Sidebar Right */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Hierarchical Navigation (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <SidebarLeft
            books={CANON_BOOKS}
            activeBookId={activeBookId}
            activeTitleId={activeTitleId}
            activeCanonId={activeCanonId}
            onSelectTitle={handleSelectTitle}
            onSelectCanon={handleSelectCanon}
            theme={theme}
            bookmarkedIds={bookmarkedIds}
            notedIds={notedIds}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Central Reading Stream */}
        <ReadingStream
          currentBook={activeBook}
          currentTitle={activeTitle}
          canons={activeTitle.canons}
          activeCanonId={activeCanonId}
          onSelectCanon={handleSelectCanon}
          onJumpToCanonRef={handleJumpToCanonRef}
          isSearchActive={isSearchActive}
          searchQuery={searchQuery}
          searchResults={searchResults}
          theme={theme}
          fontSize={fontSize}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          highlights={highlights}
          onSetHighlight={handleSetHighlight}
          notes={notes}
          onOpenNoteEditor={(canonId) => {
            handleSelectCanon(canonId);
            setIsRightPanelOpen(true);
          }}
          onToggleLatinInspector={(canonId) => {
            handleSelectCanon(canonId);
            setIsRightPanelOpen(true);
          }}
          onCopyCitation={handleCopyCitation}
          onPrevTitle={handlePrevTitle}
          onNextTitle={handleNextTitle}
          hasPrevTitle={hasPrevTitle}
          hasNextTitle={hasNextTitle}
        />

        {/* Right Study & Latin Workbench (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <SidebarRight
            activeCanon={activeCanon}
            onSelectCanon={handleSelectCanon}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            bookmarks={bookmarks}
            onRemoveBookmark={(canonId) => {
              setBookmarks((prev) => prev.filter((b) => b.canonId !== canonId));
            }}
            highlights={highlights}
            onRemoveHighlight={(canonId) => {
              setHighlights((prev) => {
                const copy = { ...prev };
                delete copy[canonId];
                return copy;
              });
            }}
            history={history}
            onClearHistory={() => setHistory([])}
            isOpen={isRightPanelOpen}
            onClose={() => setIsRightPanelOpen(false)}
            theme={theme}
            onExportUserData={handleExportUserData}
            onImportUserData={handleImportUserData}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <nav
        className={`md:hidden border-t flex items-center justify-around px-2 py-2 fixed bottom-0 left-0 right-0 z-30 select-none shadow-lg backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] ${
          theme === "dark"
            ? "bg-[#111827]/95 border-gray-800 text-gray-200"
            : theme === "sepia"
            ? "bg-[#F3EDE2]/95 border-[#E2D8C7] text-[#2C241B]"
            : "bg-white/95 border-stone-200 text-[#1C1917]"
        }`}
      >
        {/* Indice Libri */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <Layers className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          <span className="text-[10px] font-medium">Indice</span>
        </button>

        {/* Salto Canone (G) */}
        <button
          onClick={() => setIsQuickJumpOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <Hash className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          <span className="text-[10px] font-medium">Canone</span>
        </button>

        {/* Canone Precedente */}
        <button
          onClick={handlePrevCanon}
          disabled={!hasPrev}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[10px] font-medium">Prec</span>
        </button>

        {/* Canone Successivo */}
        <button
          onClick={handleNextCanon}
          disabled={!hasNext}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
          <span className="text-[10px] font-medium">Succ</span>
        </button>

        {/* Studio / Latino */}
        <button
          onClick={() => setIsRightPanelOpen((prev) => !prev)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer ${
            isRightPanelOpen ? "text-blue-700 dark:text-blue-400 font-semibold" : ""
          }`}
        >
          <Languages className="w-5 h-5" />
          <span className="text-[10px] font-medium">Latino</span>
        </button>

        {/* Impostazioni / Aspetto */}
        <button
          onClick={() => setIsMobileSettingsOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-center hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] font-medium">Aspetto</span>
        </button>
      </nav>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-medium shadow-xl backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Quick Jump Modal (Shortcut G) */}
      <QuickJumpModal
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
        onJumpToNumber={handleJumpToNumber}
        theme={theme}
      />

      {/* Keyboard Shortcuts Reference Modal (Shortcut ?) */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />

      {/* Mobile Settings Modal */}
      <MobileSettingsModal
        isOpen={isMobileSettingsOpen}
        onClose={() => setIsMobileSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onDownloadOffline={handleDownloadOfflineHtml}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />
    </div>
  );
}
