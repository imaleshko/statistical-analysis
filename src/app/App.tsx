import styles from "./App.module.css";
import { useState } from "react";

export const App = () => {
  const [data, setData] = useState("");

  return (
    <div className={styles.wrapper}>
      <section className={styles.inputSection}>
        <h2 className={styles.title}>Введіть дані:</h2>
        <textarea
          className={styles.input}
          placeholder={"Введіть текст"}
          onChange={(e) => setData(e.target.value)}
        ></textarea>
      </section>
    </div>
  );
};
