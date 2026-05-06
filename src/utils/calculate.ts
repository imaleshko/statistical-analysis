type Frequency = Record<string, number>;

interface CalculateResult {
  frequency: Frequency;
  relativeFrequency: Frequency;
  cumulativeFrequency: Frequency;
  relativeCumulativeFrequency: Frequency;
  total: number;
  mo: string[];
  me: number;
  mean: number;
  variance: number;
  standardDeviation: number;
  rawMoment: number;
}

export const calculate = (data: number[]): CalculateResult => {
  const length = data.length;
  const variationalSeries = [...data].sort((a, b) => a - b);

  const frequency: Frequency = {};
  variationalSeries.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
  });

  const relativeFrequency = Object.fromEntries(
    Object.entries(frequency).map(([key, value]) => [key, value / length]),
  );

  const cumulativeFrequencyEntries: [string, number][] =
    Object.entries(frequency);
  let cumulative = 0;
  const cumulativeFrequency = Object.fromEntries(
    cumulativeFrequencyEntries.map(([key, value]) => {
      const current = cumulative;
      cumulative += value;
      return [key, current];
    }),
  );

  const relativeCumulativeFrequency = Object.fromEntries(
    Object.entries(cumulativeFrequency).map(([key, value]) => [
      key,
      value / length,
    ]),
  );

  const maxFrequency = Math.max(...Object.values(frequency));
  const mo = Object.entries(frequency)
    .filter(([, value]) => value === maxFrequency)
    .map(([key]) => key);

  let me;
  if (length % 2 === 0) {
    me =
      (variationalSeries[length / 2 - 1] + variationalSeries[length / 2]) / 2;
  } else {
    me = variationalSeries[Math.floor(length / 2)];
  }

  const mean =
    Object.entries(frequency).reduce((acc, [key, value]) => {
      return acc + Number(key) * value;
    }, 0) / length;

  const variance =
    Object.entries(frequency).reduce((acc, [key, value]) => {
      return acc + (Number(key) - mean) ** 2 * value;
    }, 0) / length;

  const standardDeviation = Math.sqrt(variance);

  const rawMoment =
    Object.entries(frequency).reduce((acc, [key, value]) => {
      return acc + Number(key) ** 2 * value;
    }, 0) / length;

  return {
    frequency,
    relativeFrequency,
    cumulativeFrequency,
    relativeCumulativeFrequency,
    total: length,
    mo,
    me,
    mean,
    variance,
    standardDeviation,
    rawMoment,
  };
};
