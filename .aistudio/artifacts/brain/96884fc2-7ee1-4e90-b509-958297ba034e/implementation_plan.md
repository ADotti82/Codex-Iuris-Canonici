# Piattaforma di Consultazione Professionale del Codice di Diritto Canonico

Un'applicazione specialistica per la consultazione, ricerca e annotazione del *Codex Iuris Canonici* (1983), progettata con rigore editoriale, navigazione gerarchica completa dei 7 Libri, flusso continuo dei canoni e strumenti di studio avanzati funzionanti interamente offline in un unico file autonomo.

---

### Decisioni Confermate e Linee Guida

> [!IMPORTANT]
> In base alle tue indicazioni nella fase preliminare, il progetto è impostato sui seguenti capisaldi:

- **Corpus normativo completo**: Ricostruzione dell'intera architettura dei 7 Libri del Codice (Libro I: Norme generali; Libro II: Il Popolo di Dio; Libro III: La funzione d'insegnare; Libro IV: La funzione di santificare; Libro V: I beni temporali; Libro VI: Le sanzioni penali; Libro VII: I processi) con tutti i relativi Titoli, Capitoli e Canoni numerati da 1 a 1752 con paragrafi § e numeri 1°, 2°.
- **Modalità di lettura bilingue**: Testo principale in lingua italiana ad altissima leggibilità, con testo ufficiale latino accessibile a comparsa istantanea (scheda/cassetto laterale o pannello espandibile per ciascun canone) per il confronto esegetico senza appesantire la lettura continua.
- **Flusso continuo per Capitolo**: I canoni scorrono in modo naturale e continuo raggruppati per capitolo/titolo, con evidenziazione del canone attivo e salto immediato (ancoraggio fluido) alla digitazione o selezione di qualsiasi numero di canone.
- **Portabilità e distribuzione a file unico**: Interamente eseguibile offline in un singolo file HTML autonomo (CSS, font, logica e dati integrati), salvabile direttamente con un click o esportabile per l'uso senza connessione né server.

---

## 1. Panoramica ed Esperienza d'Uso

### A chi si rivolge
Canonisti, docenti, sacerdoti, studenti di teologia e diritto canonico, operatori dei tribunali ecclesiastici e studiosi che necessitano di uno strumento di lavoro rapido, affidabile e privo di distrazioni.

### Valore fondamentale
Superare i limiti dei tradizionali PDF o siti web statici offrendo:
1. **Precisione di ricerca immediata**: Digitare "1055" porta all'istante al canone sul matrimonio; digitare parole chiave evidenzia all'istante le ricorrenze nel testo.
2. **Navigazione contestuale rapida**: Saltare tra canone precedente e successivo, navigare per capitolo e seguire i riferimenti incrociati cliccabili (es. rimandi interni come "cf. can. 124").
3. **Studio e personalizzazione duratura**: Evidenziare passaggi normativi in vari colori, appuntare note esegetiche a bordo canone e salvare segnalibri tematici con persistenza automatica nel browser (LocalStorage) ed esportazione/backup in JSON.

---

## 2. Esperienza Utente e Design Visivo

Ispirato ai principi della tipografia istituzionale ed editoriale accademica (*Museum & Archival Editorial Design*), combinando l'eleganza di un'opera giuridica classica con l'ergonomia dei moderni strumenti di produttività (Linear, Obsidian, Raycast).

### Struttura dell'Interfaccia a Tre Zone
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BARRA SUPERIORE: [Titolo Codice] — [Breadcrumb gerarchico dinamico] — [Cerca] [Azioni] │
├──────────────┬──────────────────────────────────────────────────────────┬──────────────┤
│ SIDEBAR SX   │ AREA CENTRALE DI LETTURA                                 │ PANNELLO DX  │
│ (Gerarchia)  │                                                          │ (Strumenti)  │
│              │ Titolo del Capitolo / Materia                            │              │
│ • Libro I    │                                                          │ [Segnalibri] │
│   └ Titolo I │ Can. 7                                                   │ [Note]       │
│     └ Cap. I │ Lex instituitur cum promulgatur.                         │ [Evidenz.]   │
│ • Libro II   │ [Scheda Latino] [Evidenzia] [Nota] [Segnalibro] [Copia]  │ [Cronologia] │
│ • Libro III  │                                                          │              │
│ • Libro IV   │ Can. 8 § 1.                                              │ Scheda ese-  │
│ • Libro V    │ Le leggi ecclesiastiche universali sono promulgate...    │ getica del   │
│ • Libro VI   │                                                          │ canone sele- │
│ • Libro VII  │ Can. 9                                                   │ zionato      │
│              │ Le leggi riguardano le cose future...                    │ (Testo Lat.) │
├──────────────┴──────────────────────────────────────────────────────────┴──────────────┤
│ BARRA DI NAVIGAZIONE RAPIDA: [Canone Precedente] ── [Vai al canone...] ── [Canone Succ]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tavolozza Cromatica e Modalità di Lettura
- **Carta Calda / Alabastro (Predefinito)**: Sfondo avorio caldo (`#FBF9F5` / `#F7F4EE`), testo in inchiostro antracite caldo (`#1C1917`), bordi sottili in pietra naturale (`#E5E0D8`), accenti in blu lapis ecclesiastico (`#1E3A8A`) e oro caldo (`#B45309`).
- **Seppia / Pergamena Antica**: Contrasto morbido per sessioni di lettura prolungate con tonalità riposanti per la vista.
- **Scuro Notturno**: Sfondo ardesia profonda (`#0F172A`) con contrasto curato per ambienti con scarsa illuminazione.
- **Modalità Focus**: Con un solo clic o tasto (`F`), la barra laterale e il pannello note scivolano via lasciando la pagina pulita a tutta larghezza con margini ottimali (65–75 caratteri per riga).

### Tipografia
- **Intestazioni e Numeri di Canone**: Carattere graziato ad alta leggibilità e solennità (*Cinzel* o *Cormorant Garamond* / serif raffinato).
- **Testo Normativo**: Carattere da libro chiaro, bilanciato e proporzionato (*Source Serif* o *Lora*) per garantire facilità di lettura anche nei paragrafi complessi.
- **Numerazione e Riferimenti**: Cifre tabulari chiare (`tabular-nums`) per la scansione rapida di canoni, commi e paragrafi (§ 1, § 2, 1°, 2°).

---

## 3. Specifiche Funzionali Dettagliate

### 1. Navigazione Strutturale e Salto Istantaneo
- **Indice Gerarchico Espandibile**: Albero completo dei 7 Libri, Parti, Sezioni, Titoli e Capitoli con contatore canoni.
- **Salto Diretto al Canone**: Barra di inserimento rapido sempre accessibile (es. premendo `G` o cliccando l'indicatore) dove basta digitare il numero per saltare all'istante con scorrimento fluido ed evidenziazione a impulso luminoso.
- **Pulsanti Canone Prec. / Succ.**: Scorciatoie da tastiera (`J` / `K` o frecce `←` / `→`) e pulsanti fluttuanti per avanzare linearmente nel Codice.
- **Breadcrumb Interattivo**: Traccia sempre la posizione esatta (es. *Libro II > Parte I > Titolo III > Capitolo I > Can. 235*).

### 2. Ricerca Avanzata
- **Modalità Ibrida**: Ricerca istantanea per numero canonico o full-text per parole chiave.
- **Filtri di Ricerca**: Possibilità di cercare nell'intero Codice o circoscrivere la ricerca a un singolo Libro.
- **Evidenziazione Risultati**: Le parole cercate vengono evidenziate direttamente all'interno dei canoni trovati, con conteggio delle occorrenze e anteprima di contesto.

### 3. Testo Bilingue e Strumenti Esegetici
- **Testo Latino a Comparsa**: Per ogni canone, un pulsante discreto ("Latino") apre una vista a confronto (o cassetto laterale) con il testo latino autentico, le note e le fonti canoniche.
- **Riferimenti Incrociati Ipertestuali**: Ogni menzione a un altro canone all'interno del testo o delle note è un link attivo che apre un'anteprima contestuale (popover) o porta direttamente al canone citato.
- **Copia Rapida**: Copia formattata del canone (con dicitura formale, es. *Codex Iuris Canonici, Can. 1055, § 1*) pronta per essere incollata in atti, lezioni o scritti.

### 4. Strumenti Personali dello Studioso (Persistenza Locale)
- **Evidenziatore Multicolore**: Possibilità di selezionare testo o evidenziare interi canoni con 4 tinte distinte (Giallo studio, Verde dottrinale, Blu giurisprudenziale, Rosso vincolante).
- **Note Personali**: Editor di annotazioni per ogni canone con salvataggio istantaneo, datazione automatica e ricerca interna alle note.
- **Segnalibri Organizzati**: Possibilità di aggiungere canoni ai preferiti ed etichettarli.
- **Cronologia Recenti**: Registro degli ultimi canoni consultati per tornare rapidamente indietro durante le sessioni di studio.
- **Backup & Ripristino**: Esportazione e importazione in formato JSON per conservare le proprie note ed evidenziazioni nel tempo.

### 5. Esportazione e Fruizione a File Unico
- Pulsante dedicato "Scarica Codice Offline (.html)" che permette all'utente di scaricare in qualsiasi momento la pagina come file `.html` autonomo e autosufficiente, aprendolo su qualsiasi computer, tablet o smartphone anche in aereo o senza connessione internet.

---

## 4. Architettura Tecnica e Modello Dati

### Flusso dell'Architettura Componenti
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ React Root & Global State (Theme, ActiveCanon, SearchQuery, UserStorage)       │
├───────────────────────┬────────────────────────────────┬───────────────────────┤
│ SidebarNav            │ ReadingStream                  │ InspectorPanel        │
│ ├─ BookAccordion      │ ├─ BreadcrumbHeader            │ ├─ LatinComparison    │
│ ├─ TitleList          │ ├─ ChapterSection              │ ├─ NoteEditor         │
│ └─ QuickCanonIndex    │ │  └─ CanonCard                │ ├─ HighlightManager   │
│                       │ │     ├─ CanonHeader & Badges  │ ├─ BookmarksList      │
│                       │ │     ├─ Paragraphs (§)        │ └─ HistoryViewer      │
│                       │ │     └─ InlineActionToolbar   │                       │
│                       │ └─ StreamPaginationFooter      │                       │
└───────────────────────┴────────────────────────────────┴───────────────────────┘
```

### Struttura del Corpus Dati
Il corpus normativo è organizzato in una struttura fortemente tipizzata in TypeScript:
- `Book` -> `Part` (opzionale) -> `Section` (opzionale) -> `Title` -> `Chapter` -> `Canon[]`
- Ciascun `Canon`:
  - `id`: identificativo univoco (es. `"can-1055"`)
  - `number`: numero intero `1055` e dicitura `"Can. 1055"`
  - `italianText`: testo normativo tradotto
  - `latinText`: testo ufficiale latino
  - `paragraphs`: array di paragrafi numerati (§ 1, § 2, ecc.) con testo latino e italiano
  - `references`: array di ID canoni correlati per i collegamenti ipertestuali

### Persistenza
Tutte le modifiche (note, evidenziazioni, preferiti, dimensione font, tema attivo) sono sincronizzate istantaneamente in `window.localStorage` con un prefisso dedicato `cic_1983_*`.

---

## 5. Fasi di Esecuzione Operativa (dopo approvazione)

1. **Creazione del Corpus Completo e Struttura Canonica**:
   - Predisposizione dell'intera gerarchia dei 7 Libri del Codice con partizioni, titoli, capitoli e canoni con paragrafi.
2. **Implementazione del Layout Editoriale Accademico**:
   - Layout a tre colonne responsive (Sidebar Gerarchica, Flusso Canoni, Pannello Ispettore/Strumenti).
   - Tipografia accademica raffinata con selettore tema (Avorio, Seppia, Notte) e modalità Focus.
3. **Motore di Ricerca e Navigazione Rapida**:
   - Indicizzazione istantanea per numero e testo con evidenziazione sintattica.
   - Scorciatoie da tastiera e navigatore avanti/indietro.
4. **Strumenti Esegetici e di Studio**:
   - Scheda laterale con testo latino a fronte.
   - Sistema di note personali, evidenziazioni a colori e segnalibri con salvataggio locale.
   - Backup/esportazione dati e pulsante di download del file unico HTML offline.
5. **Verifica e Compilazione**:
   - Verifica di conformità e test di compilazione senza errori.
