import type {
  CategoricalStatistics,
  Correlation,
  DistributionRow,
  EdfPiece,
  Statistics,
} from "@/interfaces/interfaces.ts";

export const calculateBase = (data: number[], order: number): Statistics => {
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

  const distribution: DistributionRow<string>[] = [];
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

export const calculateCorrelation = (
  matrix: number[][],
): Correlation | null => {
  const size = matrix.length;

  let n = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  const rowX = new Array(size).fill(0);
  const rowY = new Array(size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const frequencies = matrix[i][j];

      if (frequencies > 0) {
        const valueX = i + 1;
        const valueY = j + 1;

        n += frequencies;
        sumX += valueX * frequencies;
        sumY += valueY * frequencies;
        sumXY += valueX * valueY * frequencies;
        sumX2 += valueX ** 2 * frequencies;
        sumY2 += valueY ** 2 * frequencies;

        rowX[i] += frequencies;
        rowY[j] += frequencies;
      }
    }
  }

  if (n === 0) return null;

  const meanX = sumX / n;
  const meanY = sumY / n;

  const standardDeviationX = Math.sqrt(sumX2 / n - meanX ** 2);
  const standardDeviationY = Math.sqrt(sumY2 / n - meanY ** 2);

  const r =
    (sumXY - n * meanX * meanY) / (n * standardDeviationX * standardDeviationY);

  const activeX = rowX
    .map((sum, i) => (sum > 0 ? i : -1))
    .filter((i) => i !== -1);
  const activeY = rowY
    .map((sum, j) => (sum > 0 ? j : -1))
    .filter((j) => j !== -1);

  return {
    r,
    n,
    meanX,
    meanY,
    standardDeviationX,
    standardDeviationY,
    rowX,
    rowY,
    activeX,
    activeY,
  };
};
