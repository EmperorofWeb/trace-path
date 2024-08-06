import styles from "./logs.module.css";

export default function Logs({ logsList }: { logsList: string[] }) {
  return (
    <aside className={styles.logs}>
      <h2>Logs</h2>
      <div className="logs">
        {logsList.map((log, index) => (
          <p key={index}>
            {index + 1}. {log}
          </p>
        ))}
      </div>
    </aside>
  );
}
