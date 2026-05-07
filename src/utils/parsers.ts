export const parseNumbers = (data: string): number[] => {
  return data
    .split(/[\s,;]+/)
    .filter((s) => s !== "")
    .map(Number)
    .filter((n) => !isNaN(n));
};

export const parseWordLength = (data: string): number[] => {
  return data
    .split(/\s+/)
    .map((word) => word.replace(/[.,?!:;()[\]"«»—]/g, ""))
    .filter((word) => word !== "")
    .map((word) => word.length);
};

export const parseSentenceLength = (data: string): number[] => {
  return data
    .split(/[.?!]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence !== "")
    .map((sentence) => sentence.length)
    .filter((length) => length > 0);
};
