/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Title, Canon } from "../types";
import canonsRaw from "./canonsData.json";

export interface CanonLocation {
  number: number;
  bookId: string;
  bookNumber: string;
  bookTitle: string;
  titleId: string;
  titleNumber: string;
  titleName: string;
}

export const CANON_BOOKS: Book[] = canonsRaw as unknown as Book[];

export const CANON_BY_ID_MAP: Record<string, Canon> = {};
export const CANON_BY_NUMBER_MAP: Record<number, Canon> = {};
export const ALL_CANONS_LIST: Canon[] = [];

// Index all 1752 canons
CANON_BOOKS.forEach((book) => {
  book.titles.forEach((title) => {
    title.canons.forEach((canon) => {
      CANON_BY_ID_MAP[canon.id] = canon;
      CANON_BY_NUMBER_MAP[canon.number] = canon;
      ALL_CANONS_LIST.push(canon);
    });
  });
});

// Sort sequentially 1 -> 1752
ALL_CANONS_LIST.sort((a, b) => a.number - b.number);

export function getCanonLocation(num: number): CanonLocation {
  for (const book of CANON_BOOKS) {
    for (const title of book.titles) {
      if (title.canons.some((c) => c.number === num)) {
        return {
          number: num,
          bookId: book.id,
          bookNumber: book.number,
          bookTitle: book.title,
          titleId: title.id,
          titleNumber: title.number,
          titleName: title.italianText,
        };
      }
    }
  }

  return {
    number: num,
    bookId: "lib-1",
    bookNumber: "Libro I",
    bookTitle: "De normis generalibus",
    titleId: "lib1-intro",
    titleNumber: "Norme preliminari",
    titleName: "Norme preliminari",
  };
}
