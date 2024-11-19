import styles from "./novedades.module.css";
import { updates } from "./data";
import { formatDate } from "@/utils/utils";

export default function Novedades() {
  // Sort updates by date in descending order
  const sortedUpdates = updates.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Novedades y Actualizaciones</h1>
      </header>

      <main className="container">
        <ul className={styles.updateList}>
          {sortedUpdates.map((update) => (
            <li key={update.id} className={styles.updateItem}>
              <p className={styles.updateDate}>{formatDate(update.date)}</p>
              <p>{update.content}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
