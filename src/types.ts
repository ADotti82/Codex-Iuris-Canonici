/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CanonParagraph {
  num?: string; // e.g. "§ 1.", "§ 2.", "1°", "2°"
  latinSub: string;
  italianSub: string;
}

export interface Canon {
  id: string; // e.g. "can-1055"
  number: number; // numeric e.g. 1055
  label: string; // e.g. "Can. 1055"
  rubrica?: string; // e.g. "De matrimonio" or subheading
  latinText: string;
  italianText: string;
  paragraphs?: CanonParagraph[];
  references: string[]; // e.g. ["Can. 1056", "Can. 1095"]
  bookId: string;
  titleId: string;
  chapterTitle?: string;
  fonti?: string[];
}

export interface Chapter {
  id: string;
  number: string;
  latinTitle: string;
  italianTitle: string;
  canonRange?: string;
  canons: Canon[];
}

export interface Title {
  id: string;
  number: string; // e.g. "Titolo I"
  latinText: string;
  italianText: string;
  canonRange?: string;
  partName?: string;
  sectionName?: string;
  chapters?: Chapter[];
  canons: Canon[];
}

export interface Book {
  id: string;
  number: string; // e.g. "Libro I"
  title: string; // Latin title, e.g. "De normis generalibus"
  italianTitle: string; // Italian title, e.g. "Le norme generali"
  canonRange: string; // e.g. "Cann. 1 – 203"
  partsCount?: number;
  titles: Title[];
}

export interface Note {
  id: string;
  canonId: string;
  canonNumber: string;
  canonSubject?: string;
  text: string;
  dateCreated: string;
}

export interface Bookmark {
  canonId: string;
  canonNumber: string;
  titleText: string;
  dateAdded: string;
}

export type HighlightColor = "yellow" | "green" | "blue" | "red";

export interface Highlight {
  canonId: string;
  canonNumber: string;
  color: HighlightColor;
  date: string;
}

export interface HistoryItem {
  canonId: string;
  canonNumber: string;
  titleText: string;
  timestamp: number;
}

export type ThemeMode = "alabaster" | "sepia" | "dark";
export type FontSize = "sm" | "base" | "lg" | "xl";
