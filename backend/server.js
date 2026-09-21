import express from "express";
import pkg from 'sequelize';
const { Sequelize } = pkg;
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import initTestRecord from "./models/TestRecord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DB_URI = process.env.DB_URI;
const sequelize = new Sequelize(DB_URI, { logging: false });
const TestRecord = initTestRecord(sequelize);

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Автоматично створить таблиці
    console.log("Connected to SQL Database successfully");
  } catch (err) {
    console.error("DB connection failed. Retrying in 5s...", err.message);
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

app.get("/api/records", async (req, res) => {
  const records = await TestRecord.findAll({ order: [['createdAt', 'DESC']] });
  res.json(records);
});

app.post("/api/records", async (req, res) => {
  const record = await TestRecord.create({ name: `Test ${Date.now()}` });
  res.json(record);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));