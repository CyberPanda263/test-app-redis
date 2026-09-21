import { useEffect, useState } from "react";

// Утиліта для красивого форматування дати
const formatDate = (dateString) => {
  const options = { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString('uk-UA', options);
};

export default function App() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/records");
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error("Помилка завантаження:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createRecord = async () => {
    try {
      await fetch("/api/records", {
        method: "POST",
      });
      loadRecords();
    } catch (err) {
      console.error("Помилка створення:", err);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>G.E.N.A. test platform 🚀 333</h1>
        <p style={styles.subtitle}>Тестування з'єднання з базою даних SQL Server</p>

        <div style={styles.buttonGroup}>
          <button 
            onClick={createRecord} 
            style={styles.buttonPrimary}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            + Створити запис
          </button>
          
          <button
            onClick={loadRecords}
            style={styles.buttonSecondary}
            disabled={isLoading}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            {isLoading ? "Оновлення..." : "↻ Оновити список"}
          </button>
        </div>

        <div style={styles.recordsContainer}>
          {isLoading && records.length === 0 ? (
            <p style={styles.emptyState}>Завантаження даних...</p>
          ) : records.length === 0 ? (
            <p style={styles.emptyState}>Записів ще немає. Створи перший!</p>
          ) : (
            <ul style={styles.list}>
              {records.map((record) => (
                <li key={record._id} style={styles.listItem}>
                  <span style={styles.recordName}>{record.name}</span>
                  <span style={styles.recordDate}>{formatDate(record.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Сучасна темна тема (CSS-in-JS)
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a", // Колір Slate-900 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#1e293b", // Колір Slate-800
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    padding: "30px",
    width: "100%",
    maxWidth: "600px",
    color: "#f8fafc",
  },
  header: {
    margin: "0 0 5px 0",
    fontSize: "24px",
    color: "#38bdf8", // Світло-синій акцент
  },
  subtitle: {
    margin: "0 0 20px 0",
    color: "#94a3b8",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  buttonPrimary: {
    backgroundColor: "#0ea5e9",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  buttonSecondary: {
    backgroundColor: "#475569",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  recordsContainer: {
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    padding: "15px",
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #334155",
  },
  emptyState: {
    textAlign: "center",
    color: "#94a3b8",
    margin: "20px 0",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    backgroundColor: "#1e293b",
    padding: "12px",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "4px solid #38bdf8", // Візуальний маркер
  },
  recordName: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  recordDate: {
    fontSize: "12px",
    color: "#94a3b8",
  }
};
