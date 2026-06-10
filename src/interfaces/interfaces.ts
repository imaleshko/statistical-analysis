export type InputMode =
  | "numbers"
  | "words"
  | "sentences"
  | "custom"
  | "correlation";

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

export interface Correlation {
  r: number;
  n: number;
  meanX: number;
  meanY: number;
  standardDeviationX: number;
  standardDeviationY: number;
  rowX: number[];
  rowY: number[];
  activeX: number[];
  activeY: number[];
}
