/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Canon, 
  Note, 
  Bookmark, 
  Highlight, 
  HistoryItem, 
  ThemeMode, 
  HighlightColor 
} from "../types";
import { 
  Languages, 
  FileText, 
  Star, 
  Highlighter, 
  History, 
  Download, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  X,
  Plus,
  ExternalLink,
  Save
} from "lucide-react";

interface SidebarRightProps {
  activeCanon: Canon | null;
  onSelectCanon: (canonId: string) => void;
  notes: Note[];
  onAddNote: (canonId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  bookmarks: Bookmark[];
  onRemoveBookmark: (canonId: string) => void;
  highlights: Record<string, HighlightColor>;
  onRemoveHighlight: (canonId: string) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onExportUserData: () => void;
  onImportUserData: (jsonData: string) => void;
}

type TabType = "latin" | "notes" | "bookmarks" | "highlights" | "history";

export const SidebarRight: React.FC<SidebarRightProps> = ({
  activeCanon,
  onSelectCanon,
  notes,
  onAddNote,
  onDeleteNote,
  bookmarks,
  onRemoveBookmark,
  highlights,
  onRemoveHighlight,
  history,
  onClearHistory,
  isOpen,
  onClose,
  theme,
  onExportUserData,
  onImportUserData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("latin");
  const [newNoteText, setNewNoteText] = useState("");
  const [copiedLatin, setCopiedLatin] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const panelBg = isDark ? "bg-[#111827] border-gray-800 text-gray-200" 
    : isSepia ? "bg-[#F3EDE2] border-[#E2D8C7] text-[#2C241B]" 
    : "bg-[#F8F6F0] border-stone-200 text-[#1C1917]";

  const inputBg = isDark ? "bg-gray-800 border-gray-700 text-gray-100" 
    : isSepia ? "bg-[#EAE2D3] border-[#D9CDB8] text-[#2C241B]" 
    : "bg-white border-stone-300 text-stone-900";

  const cardBg = isDark ? "bg-gray-800/80 border-gray-700" 
    : isSepia ? "bg-[#FAF7F0] border-[#E5DAC6]" 
    : "bg-white border-stone-200";

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCanon || !newNoteText.trim()) return;
    onAddNote(activeCanon.id, newNoteText.trim());
    setNewNoteText("");
  };

  const handleCopyLatin = () => {
    if (!activeCanon) return;
    const fullLatin = activeCanon.paragraphs && activeCanon.paragraphs.length > 0
      ? `${activeCanon.label}\n` + activeCanon.paragraphs.map(p => `${p.num ? p.num + " " : ""}${p.latinSub}`).join("\n")
      : `${activeCanon.label}\n${activeCanon.latinText}`;
    navigator.clipboard.writeText(fullLatin);
    setCopiedLatin(true);
    setTimeout(() => setCopiedLatin(false), 2000);
  };

  // Filter notes for the active canon
  const activeCanonNotes = activeCanon ? notes.filter(n => n.canonId === activeCanon.id) : [];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      <aside
        className={`fixed md:static inset-y-0 right-0 z-50 md:z-0 w-[92vw] max-w-sm sm:max-w-md md:w-80 lg:w-96 h-full border-l flex flex-col flex-shrink-0 select-none overflow-hidden transition-all duration-200 shadow-2xl md:shadow-none ${panelBg}`}
      >
      {/* Header and Tab Bar */}
      <div className="border-b border-inherit p-3 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Banco di Studio
            </span>
            {activeCanon && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-semibold">
                {activeCanon.label}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 cursor-pointer"
            title="Chiudi pannello laterale"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-inherit bg-black/5 dark:bg-white/5 text-xs">
          <button
            onClick={() => setActiveTab("latin")}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "latin" ? "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow-xs font-semibold" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Latino</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "notes" ? "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow-xs font-semibold" : "opacity-70 hover:opacity-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note {notes.length > 0 && `(${notes.length})`}</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "bookmarks" ? "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow-xs font-semibold" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Preferiti</span>
          </button>
          <button
            onClick={() => setActiveTab("highlights")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "highlights" ? "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow-xs font-semibold" : "opacity-70 hover:opacity-100"
            }`}
            title="Evidenziazioni"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "history" ? "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 shadow-xs font-semibold" : "opacity-70 hover:opacity-100"
            }`}
            title="Cronologia consultazioni"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: LATIN AUTHENTIC TEXT */}
        {activeTab === "latin" && (
          <div className="space-y-4">
            {activeCanon ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-inherit">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-blue-900 dark:text-blue-300">
                      {activeCanon.label} — Textus Authenticus
                    </h3>
                    {activeCanon.rubrica && (
                      <p className="text-[11px] font-sans italic opacity-75">
                        {activeCanon.rubrica}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCopyLatin}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title="Copia testo latino"
                  >
                    {copiedLatin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLatin ? "Copiato" : "Copia"}</span>
                  </button>
                </div>

                <div className="font-serif italic text-xs leading-relaxed space-y-3 select-text bg-black/2 dark:bg-white/2 p-3 rounded-lg border border-inherit">
                  {activeCanon.paragraphs && activeCanon.paragraphs.length > 0 ? (
                    activeCanon.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex gap-2">
                        {p.num && (
                          <span className="font-sans font-bold not-italic text-blue-800 dark:text-blue-400 shrink-0">
                            {p.num}
                          </span>
                        )}
                        <p className="flex-1">{p.latinSub}</p>
                      </div>
                    ))
                  ) : (
                    <p>{activeCanon.latinText}</p>
                  )}
                </div>

                {activeCanon.fonti && activeCanon.fonti.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-sans space-y-1">
                    <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <span>Fonti & Interpretazioni Pontificie</span>
                    </div>
                    <ul className="space-y-1 text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                      {activeCanon.fonti.map((f, i) => (
                        <li key={i} className="list-disc ml-3.5">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 text-[11px] opacity-75 font-sans space-y-1">
                  <p><strong>Promulgato:</strong> 25 Ianuarii 1983 da Papa Giovanni Paolo II</p>
                  <p><strong>Commentario ufficiale:</strong> Acta Apostolicae Sedis (AAS)</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 opacity-60 text-xs">
                Seleziona un canone nel testo centrale per visualizzare il riscontro in latino.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NOTES & ANNOTATIONS */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            {activeCanon && (
              <form onSubmit={handleCreateNote} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Nuova nota per {activeCanon.label}</span>
                </div>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Scrivi osservazioni dottrinali, canoni collegati, lezioni..."
                  rows={3}
                  className={`w-full text-xs rounded-lg p-2.5 border focus:outline-none focus:ring-1.5 focus:ring-blue-600 ${inputBg}`}
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-900 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salva Annotazione</span>
                </button>
              </form>
            )}

            {/* List of notes for active canon */}
            {activeCanon && activeCanonNotes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-inherit">
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                  Note su questo canone ({activeCanonNotes.length})
                </div>
                {activeCanonNotes.map((note) => (
                  <div key={note.id} className={`p-2.5 rounded-lg border text-xs space-y-1.5 ${cardBg}`}>
                    <div className="flex items-center justify-between text-[10px] opacity-60">
                      <span>{note.dateCreated}</span>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Elimina nota"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="select-text whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* All other saved notes */}
            <div className="space-y-2 pt-4 border-t border-inherit">
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                Tutte le annotazioni ({notes.length})
              </div>
              {notes.length === 0 ? (
                <div className="text-center py-6 text-xs opacity-60">
                  Nessuna annotazione salvata.
                </div>
              ) : (
                notes.map((note) => (
                  <div 
                    key={note.id} 
                    onClick={() => onSelectCanon(note.canonId)}
                    className={`p-2.5 rounded-lg border text-xs space-y-1 hover:border-blue-400 transition-colors cursor-pointer ${cardBg}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-800 dark:text-blue-300">
                        {note.canonNumber}
                      </span>
                      <span className="text-[10px] opacity-60">{note.dateCreated}</span>
                    </div>
                    <p className="line-clamp-2 opacity-90">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKMARKS */}
        {activeTab === "bookmarks" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-60 pb-1 border-b border-inherit">
              <span>Canoni Preferiti ({bookmarks.length})</span>
            </div>
            {bookmarks.length === 0 ? (
              <div className="text-center py-12 text-xs opacity-60">
                Nessun canone aggiunto ai segnalibri. Clicca la stella su qualsiasi canone per salvarlo.
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.canonId}
                  onClick={() => onSelectCanon(bm.canonId)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer ${cardBg}`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-mono font-bold text-blue-800 dark:text-blue-300">
                      {bm.canonNumber}
                    </span>
                    <span className="text-[11px] truncate opacity-75" title={bm.titleText}>
                      {bm.titleText}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(bm.canonId);
                    }}
                    className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Rimuovi dai preferiti"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: HIGHLIGHTS */}
        {activeTab === "highlights" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-60 pb-1 border-b border-inherit">
              <span>Evidenziazioni ({Object.keys(highlights).length})</span>
            </div>
            {Object.keys(highlights).length === 0 ? (
              <div className="text-center py-12 text-xs opacity-60">
                Nessun canone evidenziato. Usa il pulsante &ldquo;Evidenzia&rdquo; sui canoni per organizzare i tuoi studi per colore.
              </div>
            ) : (
              Object.entries(highlights).map(([canonId, color]) => {
                const colorDot = color === "yellow" ? "bg-amber-400"
                  : color === "green" ? "bg-emerald-500"
                  : color === "blue" ? "bg-sky-500"
                  : "bg-rose-500";

                const colorName = color === "yellow" ? "Studio generale"
                  : color === "green" ? "Dottrina"
                  : color === "blue" ? "Giurisprudenza"
                  : "Sanzione / Vincolo";

                return (
                  <div
                    key={canonId}
                    onClick={() => onSelectCanon(canonId)}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer ${cardBg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${colorDot} shrink-0`} />
                      <div>
                        <span className="font-mono font-bold">
                          {canonId.replace("can-", "Can. ")}
                        </span>
                        <span className="text-[11px] opacity-60 ml-2">
                          {colorName}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveHighlight(canonId);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Rimuovi evidenziazione"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-60 pb-1 border-b border-inherit">
              <span>Cronologia Recente</span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Cancella
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12 text-xs opacity-60">
                Nessuna consultazione recente registrata.
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={`${item.canonId}-${idx}`}
                  onClick={() => onSelectCanon(item.canonId)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer ${cardBg}`}
                >
                  <span className="font-mono font-semibold text-blue-800 dark:text-blue-300">
                    {item.canonNumber}
                  </span>
                  <span className="text-[10px] opacity-60">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Data Backup / Restore */}
      <div className="p-3 border-t border-inherit flex items-center justify-between gap-2 text-xs shrink-0">
        <button
          onClick={onExportUserData}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-inherit hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-medium transition-colors cursor-pointer"
          title="Esporta note ed evidenziazioni in un file JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Esporta Dati</span>
        </button>
        <label
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-inherit hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-medium transition-colors cursor-pointer"
          title="Importa file di backup JSON"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Importa</span>
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const content = ev.target?.result as string;
                  if (content) onImportUserData(content);
                };
                reader.readAsText(file);
              }
            }}
          />
        </label>
      </div>
    </aside>
  </>
  );
};
