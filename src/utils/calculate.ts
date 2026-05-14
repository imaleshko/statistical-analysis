export type DistributionRow<T = number> = {
  value: T;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
  relativeCumulativeFrequency: number;
};

export type EdfPiece = {
  range: string;
  value: string;
};

export interface BaseStatistics<T> {
  variationalSeries: T[];
  distribution: DistributionRow<T>[];
  total: number;
}

export interface Statistics extends BaseStatistics<number> {
  edf: EdfPiece[];
  mode: number[];
  median: number;
  mean: number;
  variance: number;
  standardDeviation: number;
  rawMoment: number;
  momentOrder: number;
}

export type CategoricalStatistics = BaseStatistics<string>;

export const calculate = (data: number[], order: number): Statistics => {
  const length = data.length;
  const variationalSeries = [...data].sort((a, b) => a - b);

  const frequenciesByValue = new Map<number, number>();
  for (const value of variationalSeries) {
    frequenciesByValue.set(value, (frequenciesByValue.get(value) ?? 0) + 1);
  }

  const distribution: DistributionRow[] = [];
  let cumulative = 0;
  for (const [value, frequency] of frequenciesByValue) {
    distribution.push({
      value,
      frequency,
      relativeFrequency: frequency / length,
      cumulativeFrequency: cumulative,
      relativeCumulativeFrequency: cumulative / length,
    });
    cumulative += frequency;
  }

  const edf: EdfPiece[] = [];
  edf.push({ range: `x ≤ ${distribution[0].value}`, value: "0" });
  for (let i = 0; i < distribution.length - 1; i++) {
    edf.push({
      range: `${distribution[i].value} < x ≤ ${distribution[i + 1].value}`,
      value: distribution[i + 1].relativeCumulativeFrequency.toFixed(2),
    });
  }
  edf.push({
    range: `x > ${distribution.at(-1)!.value}`,
    value: "1",
  });

  const maxFrequency = Math.max(...distribution.map((row) => row.frequency));
  const mode = distribution
    .filter((row) => row.frequency === maxFrequency)
    .map((row) => row.value);

  const mid = length / 2;
  const median =
    length % 2 === 0
      ? (variationalSeries[mid - 1] + variationalSeries[mid]) / 2
      : variationalSeries[Math.floor(mid)];

  const mean =
    distribution.reduce(
      (sum, { value, frequency }) => sum + value * frequency,
      0,
    ) / length;

  const variance =
    distribution.reduce(
      (sum, { value, frequency }) => sum + (value - mean) ** 2 * frequency,
      0,
    ) / length;

  const standardDeviation = Math.sqrt(variance);

  const rawMoment =
    distribution.reduce(
      (sum, { value, frequency }) => sum + value ** order * frequency,
      0,
    ) / length;

  const momentOrder = order;

  return {
    variationalSeries,
    distribution,
    total: length,
    edf,
    mode,
    median,
    mean,
    variance,
    standardDeviation,
    rawMoment,
    momentOrder,
  };
};

export const calculateCategorical = (data: string[]): CategoricalStatistics => {
  const length = data.length;
  const variationalSeries = [...data].sort((a, b) => a.localeCompare(b));

  const frequenciesByValue = new Map<string, number>();
  for (const value of variationalSeries) {
    frequenciesByValue.set(value, (frequenciesByValue.get(value) ?? 0) + 1);
  }

  const distribution = [];
  let cumulative = 0;
  for (const [value, frequency] of frequenciesByValue) {
    distribution.push({
      value,
      frequency,
      relativeFrequency: frequency / length,
      cumulativeFrequency: cumulative,
      relativeCumulativeFrequency: cumulative / length,
    });
    cumulative += frequency;
  }

  return {
    variationalSeries,
    distribution,
    total: length,
  };
};
