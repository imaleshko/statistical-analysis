import { ALPHABET } from "@/app/constants.ts";

const LETTER_INDEX = new Map(ALPHABET.map((char, index) => [char, index]));
const NON_LETTER = new RegExp(`[^${ALPHABET.join("")}]`, "g");

export const parseNumbers = (data: string): number[] =>
  data
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));

export const parseWordLengths = (data: string): number[] =>
  data
    .split(/\s+/)
    .map((word) => word.replace(/[.,?!:;()[\]"«»—\d-]/g, ""))
    .filter(Boolean)
    .map((word) => word.length);

export const parseSentenceLengths = (data: string): number[] =>
  data
    .split(/[.?!]+\s+/)
    .map((sentence) => sentence.replace(/[.?!]+$/, "").trim())
    .filter(Boolean)
    .map((sentence) => sentence.split(/\s+/).length);

export const parseCustomExpression = (
  text: string,
  customExpression: string,
): string[] => {
  const expressions = customExpression
    .split(/[\s,;]+/)
    .map((expr) => expr.trim().toLowerCase())
    .filter((expression) => expression !== "");

  if (expressions.length === 0 || text.trim() === "") return [];

  const result: string[] = [];

  const lowerText = text.toLowerCase();

  for (const expression of expressions) {
    const count = lowerText.split(expression).length - 1;
    for (let i = 0; i < count; i++) {
      result.push(expression);
    }
  }

  return result;
};

export const parseLetterPairs = (text: string): number[][] => {
  const size = ALPHABET.length;
  const matrix: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0),
  );

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(NON_LETTER, ""))
    .filter(Boolean);

  for (const word of words) {
    for (let i = 0; i < word.length - 1; i++) {
      const char1 = LETTER_INDEX.get(word[i]);
      const char2 = LETTER_INDEX.get(word[i + 1]);
      if (char1 !== undefined && char2 !== undefined) {
        matrix[char1][char2]++;
      }
    }
  }

  return matrix;
};
