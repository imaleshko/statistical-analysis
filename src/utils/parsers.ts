export const parseNumbers = (data: string) => {
  return data.split(", ").map(Number);
};
