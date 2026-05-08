import styles from "./App.module.css";
import { useMemo, useState } from "react";
import { calculate } from "@/utils/calculate.ts";
import { parseNumbers, parseSentenceLengths, parseWordLengths } from "@/utils/parsers.ts";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type InputMode = "numbers" | "words" | "sentences";

export const App = () => {
  const [inputData, setInputData] = useState("");
  const [mode, setMode] = useState<InputMode>("numbers");

  const result = useMemo(() => {
    let numbers: number[] = [];

    if (mode === "numbers") numbers = parseNumbers(inputData);
    if (mode === "words") numbers = parseWordLengths(inputData);
    if (mode === "sentences") numbers = parseSentenceLengths(inputData);

    if (numbers.length === 0) return null;
    return calculate(numbers);
  }, [inputData, mode]);

  const placeholders: Record<InputMode, string> = {
    numbers: "Числа через пробіл, кому або крапку з комою",
    words: "Текст",
    sentences: "Текст",
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Статистичний аналіз даних</h1>

      <section className={styles.section}>
        <div className={styles.modeSwitcher}>
          <button
            className={
              mode === "numbers" ? styles.activeModeButton : styles.modeButton
            }
            onClick={() => setMode("numbers")}
          >
            Числа
          </button>
          <button
            className={
              mode === "words" ? styles.activeModeButton : styles.modeButton
            }
            onClick={() => setMode("words")}
          >
            Довжина слів
          </button>
          <button
            className={
              mode === "sentences" ? styles.activeModeButton : styles.modeButton
            }
            onClick={() => setMode("sentences")}
          >
            Довжина речень
          </button>
        </div>

        <label htmlFor="data-input" className={styles.inputTitle}>
          Введіть дані:
        </label>
        <textarea
          id="data-input"
          className={styles.input}
          placeholder={placeholders[mode]}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
      </section>

      {result && (
        <section className={styles.section}>
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
                    type="number"
                    domain={["dataMin", "dataMax"]}
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

          <div className={styles.graphicGroup}>
            <h2 className={styles.groupTitle}>
              Емпірична функція розподілу F*(x)
            </h2>

            <div className={styles.edf}>
              <span>F*(x) = </span>
              <span className={styles.brace}>{"{"}</span>
              <ul className={styles.list}>
                {result.edf.map((item, index) => (
                  <li key={index}>
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
                      key={row.value}
                      segment={[
                        { x: row.value, y: row.relativeCumulativeFrequency },
                        { x: row.value, y: 0 },
                      ]}
                      stroke="#999"
                      strokeDasharray="3 3"
                    />
                  ))}

                  <Line
                    type="stepAfter"
                    dataKey="f"
                    stroke="var(--graphic-color)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--graphic-color)",
                      stroke: "var(--graphic-color)",
                    }}
                    name="F*(x)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.tableGroup}>
            <h2 className={styles.groupTitle}>Загальні дані</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th className={styles.th}>Мода (Mo)</th>
                    <td className={styles.td}>{result.mode.join(", ")}</td>
                  </tr>
                  <tr>
                    <th className={styles.th}>Медіана (Me)</th>
                    <td className={styles.td}>{result.median}</td>
                  </tr>
                  <tr>
                    <th className={styles.th}>Середнє (x̄)</th>
                    <td className={styles.td}>{result.mean.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <th className={styles.th}>Дисперсія (D)</th>
                    <td className={styles.td}>{result.variance.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <th className={styles.th}>СКВ (σ)</th>
                    <td className={styles.td}>
                      {result.standardDeviation.toFixed(3)}
                    </td>
                  </tr>
                  <tr>
                    <th className={styles.th}>Початковий момент 2 порядку</th>
                    <td className={styles.td}>
                      {result.secondRawMoment.toFixed(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
