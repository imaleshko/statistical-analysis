import styles from "./App.module.css";
import { useMemo, useState } from "react";
import type { InputMode } from "@/interfaces/interfaces.ts";
import { ALPHABET, MODES, PLACEHOLDERS } from "@/app/constants.ts";
import {
  calculateBase,
  calculateCategorical,
  calculateCorrelation,
} from "@/utils/calculate.ts";
import {
  parseCustomExpression,
  parseLetterPairs,
  parseNumbers,
  parseSentenceLengths,
  parseWordLengths,
} from "@/utils/parsers.ts";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const App = () => {
  const [inputData, setInputData] = useState("");
  const [order, setOrder] = useState("2");
  const [searchExpression, setSearchExpression] = useState("");

  const [mode, setMode] = useState<InputMode>("numbers");

  const handleModeChange = (newMode: InputMode) => {
    setMode(newMode);
    setInputData("");
    setSearchExpression("");
  };

  const result = useMemo(() => {
    switch (mode) {
      case "numbers": {
        const numbers = parseNumbers(inputData);
        const parsedOrder = Number(order);
        const safeOrder =
          Number.isFinite(parsedOrder) && parsedOrder >= 1
            ? Math.floor(parsedOrder)
            : 2;
        return numbers.length === 0 ? null : calculateBase(numbers, safeOrder);
      }
      case "words": {
        const numbers = parseWordLengths(inputData);
        const parsedOrder = Number(order);
        const safeOrder =
          Number.isFinite(parsedOrder) && parsedOrder >= 1
            ? Math.floor(parsedOrder)
            : 2;
        return numbers.length === 0 ? null : calculateBase(numbers, safeOrder);
      }
      case "sentences": {
        const numbers = parseSentenceLengths(inputData);
        const parsedOrder = Number(order);
        const safeOrder =
          Number.isFinite(parsedOrder) && parsedOrder >= 1
            ? Math.floor(parsedOrder)
            : 2;
        return numbers.length === 0 ? null : calculateBase(numbers, safeOrder);
      }
      case "custom": {
        const expressions = parseCustomExpression(inputData, searchExpression);
        return expressions.length === 0
          ? null
          : calculateCategorical(expressions);
      }
      case "correlation": {
        if (inputData.trim() === "") return null;
        const matrix = parseLetterPairs(inputData);
        const correlation = calculateCorrelation(matrix);
        if (correlation === null) return null;
        return { ...correlation, matrix };
      }
    }
  }, [mode, inputData, order, searchExpression]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Статистичний аналіз даних</h1>

      <section className={styles.section}>
        <div className={styles.modeSwitcher}>
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.modeButton} ${mode === id ? styles.active : ""}`}
              onClick={() => handleModeChange(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {(mode === "numbers" || mode === "words" || mode === "sentences") && (
          <div className={styles.optionalSearchBlock}>
            <label htmlFor="order-input" className={styles.inputTitle}>
              Порядок початкового моменту
            </label>
            <input
              id="order-input"
              type="number"
              className={styles.optionalInput}
              min="1"
              placeholder="Цифра"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>
        )}

        {mode === "custom" && (
          <div className={styles.optionalSearchBlock}>
            <label
              htmlFor="search-expression-input"
              className={styles.inputTitle}
            >
              Введіть символи для пошуку
            </label>
            <input
              id="search-expression-input"
              type="text"
              className={styles.optionalInput}
              placeholder="Букви або буквосполучення"
              value={searchExpression}
              onChange={(e) => setSearchExpression(e.target.value)}
            />
          </div>
        )}

        <label htmlFor="data-input" className={styles.inputTitle}>
          Введіть дані:
        </label>
        <textarea
          id="data-input"
          className={styles.input}
          placeholder={PLACEHOLDERS[mode]}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
      </section>

      {result && (
        <section className={styles.section}>
          {mode !== "correlation" && "variationalSeries" in result && (
            <>
              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>Варіаційний ряд</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        {result.variationalSeries.map((value, index) => (
                          <td key={index} className={styles.td}>
                            {value}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>Частоти</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Xi</th>
                        {result.distribution.map((row) => (
                          <th key={row.value} className={styles.th}>
                            {row.value}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.th}>ni</td>
                        {result.distribution.map((row) => (
                          <td key={row.value} className={styles.td}>
                            {row.frequency}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className={styles.th}>wi</td>
                        {result.distribution.map((row) => (
                          <td key={row.value} className={styles.td}>
                            {row.relativeFrequency.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>Накопичувальні частоти</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Xi</th>
                        {result.distribution.map((row) => (
                          <th key={row.value} className={styles.th}>
                            {row.value}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.th}>ni нак</td>
                        {result.distribution.map((row) => (
                          <td key={row.value} className={styles.td}>
                            {row.cumulativeFrequency}
                          </td>
                        ))}
                        <td className={styles.td}>{result.total}</td>
                      </tr>
                      <tr>
                        <td className={styles.th}>wi нак</td>
                        {result.distribution.map((row) => (
                          <td key={row.value} className={styles.td}>
                            {row.relativeCumulativeFrequency.toFixed(2)}
                          </td>
                        ))}
                        <td className={styles.td}>1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.graphicGroup}>
                <h2 className={styles.groupTitle}>Полігон частот</h2>
                <div className={styles.graphicContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={result.distribution.map((row) => ({
                        x: row.value,
                        ni: row.frequency,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="1 0" />
                      <XAxis
                        dataKey="x"
                        type={mode === "custom" ? "category" : "number"}
                        domain={
                          mode === "custom" ? undefined : ["dataMin", "dataMax"]
                        }
                      />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="linear"
                        dataKey="ni"
                        stroke="var(--graphic-color)"
                        strokeWidth={2}
                        dot={{
                          r: 4,
                          fill: "var(--graphic-color)",
                          stroke: "var(--graphic-color)",
                        }}
                        name="Частота (ni)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {mode !== "custom" && "edf" in result && (
                <div className={styles.graphicGroup}>
                  <h2 className={styles.groupTitle}>
                    Емпірична функція розподілу F*(x)
                  </h2>

                  <div className={styles.edf}>
                    <span>F*(x) = </span>
                    <span className={styles.brace}>{"{"}</span>
                    <ul className={styles.list}>
                      {result.edf.map((item) => (
                        <li key={item.range}>
                          {item.value}, при {item.range}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.graphicContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={result.distribution.map((row) => ({
                          x: row.value,
                          f: row.relativeCumulativeFrequency,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="x"
                          type="number"
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis domain={[0, 1]} />
                        <Tooltip
                          formatter={(value) =>
                            typeof value === "number"
                              ? value.toFixed(3)
                              : String(value)
                          }
                        />

                        {result.distribution.map((row) => (
                          <ReferenceLine
                            key={`column-${row.value}`}
                            segment={[
                              {
                                x: row.value,
                                y: row.relativeCumulativeFrequency,
                              },
                              { x: row.value, y: 0 },
                            ]}
                            stroke="#999"
                            strokeDasharray="3 3"
                          />
                        ))}

                        {result.distribution.map((row, i) => {
                          const next = result.distribution[i + 1];
                          if (!next) return null;
                          return (
                            <ReferenceLine
                              key={`line-${row.value}`}
                              segment={[
                                {
                                  x: row.value,
                                  y: next.relativeCumulativeFrequency,
                                },
                                {
                                  x: next.value,
                                  y: next.relativeCumulativeFrequency,
                                },
                              ]}
                              stroke="var(--graphic-color)"
                              strokeWidth={2}
                            />
                          );
                        })}

                        <Line
                          dataKey="f"
                          stroke="transparent"
                          dot={{
                            r: 4,
                            fill: "var(--graphic-color)",
                            stroke: "var(--graphic-color)",
                          }}
                          isAnimationActive={false}
                          name="F*(x)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {mode !== "custom" && "mode" in result && (
                <div className={styles.tableGroup}>
                  <h2 className={styles.groupTitle}>Числові характеристики</h2>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <tbody>
                        <tr>
                          <th className={styles.th}>Мода (Mo)</th>
                          <td className={styles.td}>
                            {result.mode.join(", ")}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.th}>Медіана (Me)</th>
                          <td className={styles.td}>{result.median}</td>
                        </tr>
                        <tr>
                          <th className={styles.th}>Середнє (x̄)</th>
                          <td className={styles.td}>
                            {result.mean.toFixed(3)}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.th}>Дисперсія (D)</th>
                          <td className={styles.td}>
                            {result.variance.toFixed(3)}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.th}>СКВ (σ)</th>
                          <td className={styles.td}>
                            {result.standardDeviation.toFixed(3)}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.th}>
                            Початковий момент {`${result.momentOrder}`} порядку
                          </th>
                          <td className={styles.td}>
                            {result.rawMoment.toFixed(3)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {mode === "correlation" && "r" in result && (
            <>
              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>Матриця частот</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>X \ Y</th>
                        {result.activeY.map((j) => (
                          <th key={`head-${j}`} className={styles.th}>
                            {ALPHABET[j]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.activeX.map((i) => (
                        <tr key={`row-${i}`}>
                          <th className={styles.th}>{ALPHABET[i]}</th>
                          {result.activeY.map((j) => (
                            <td key={`cell-${i}-${j}`} className={styles.td}>
                              {result.matrix[i][j] === 0
                                ? ""
                                : result.matrix[i][j]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>Частоти по X</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>X</th>
                        {result.activeX.map((i) => (
                          <th key={`headX-${i}`} className={styles.th}>
                            {ALPHABET[i]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className={styles.th}>n</th>
                        {result.activeX.map((i) => (
                          <td key={`bodyX-${i}`} className={styles.td}>
                            {result.rowX[i]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>Частоти по Y</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Y</th>
                        {result.activeY.map((j) => (
                          <th key={`headY-${j}`} className={styles.th}>
                            {ALPHABET[j]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className={styles.th}>n</th>
                        {result.activeY.map((j) => (
                          <td key={`bodyY-${j}`} className={styles.td}>
                            {result.rowY[j]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.tableGroup}>
                <h2 className={styles.groupTitle}>
                  Результати кореляційного аналізу
                </h2>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <th className={styles.th}>Обсяг вибірки (n)</th>
                        <td className={styles.td}>{result.n}</td>
                      </tr>
                      <tr>
                        <th className={styles.th}>Середнє X (x̄)</th>
                        <td className={styles.td}>{result.meanX.toFixed(3)}</td>
                      </tr>
                      <tr>
                        <th className={styles.th}>Середнє Y (ȳ)</th>
                        <td className={styles.td}>{result.meanY.toFixed(3)}</td>
                      </tr>
                      <tr>
                        <th className={styles.th}>СКВ X (σx)</th>
                        <td className={styles.td}>
                          {result.standardDeviationX.toFixed(3)}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.th}>СКВ Y (σy)</th>
                        <td className={styles.td}>
                          {result.standardDeviationY.toFixed(3)}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.th}>Коефіцієнт кореляції (r)</th>
                        <td className={styles.td}>
                          <strong>{result.r.toFixed(4)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};
