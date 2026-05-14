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
