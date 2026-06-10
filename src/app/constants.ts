import type { InputMode } from "@/interfaces/interfaces.ts";

export const MODES: { id: InputMode; label: string }[] = [
  { id: "numbers", label: "Числа" },
  { id: "words", label: "Довжина слів" },
  { id: "sentences", label: "Довжина речень" },
  { id: "custom", label: "Пошук символів" },
  { id: "correlation", label: "Кореляція" },
];

export const PLACEHOLDERS: Record<InputMode, string> = {
  numbers: "Числа через пробіл, кому або крапку з комою",
  words: "Текст",
  sentences: "Текст",
  custom: "Текст",
  correlation: "Текст",
};

export const ALPHABET = [
  "а",
  "б",
  "в",
  "г",
  "ґ",
  "д",
  "е",
  "є",
  "ж",
  "з",
  "и",
  "і",
  "ї",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "ь",
  "ю",
  "я",
];
