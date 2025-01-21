import styles from "./novedades.module.css";
import { updates } from "./data";
import { formatDate } from "@/utils/utils";

export default function Novedades() {
  // Sort updates by date in descending order
  const sortedUpdates = updates.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const colorForType = (type) => {
    switch (type) {
      case "feature":
        return "rgb(47, 216, 61)";
      case "improvement":
        return "rgb(71, 23, 243)";
      case "fix":
        return "rgb(253, 91, 91)";
      default:
        return " #6A90FF";
    }
  };

  const iconForType = (type) => {
    switch (type) {
      case "feature":
        return "🚀";
      case "improvement":
        return "🛠️";
      case "fix":
        return "🔧";
      default:
        return "📰";
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Novedades y Actualizaciones</h1>
      </header>

      <main className="container">
        <ul className={styles.updateList}>
          {sortedUpdates.map((update) => (
            <li key={update.id} className={styles.updateItem}>
              <p>{iconForType(update.type)}</p>
              <p
                style={{
                  backgroundColor: colorForType(update.type),
                  borderRadius: "0.7rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.3rem 0.5rem",
                  color: "white",
                  width: "fit-content",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                {update.type}
              </p>
              <p className={styles.updateDate}>{formatDate(update.date)}</p>
              <p>{update.content}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
