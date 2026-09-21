import express from "express";
import { createClient } from "redis";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());

const client = createClient({ url: process.env.REDIS_URI });
client.on('error', err => console.error('Redis Client Error', err));

const connectWithRetry = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Redis connection failed. Retrying...", err.message);
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

app.get("/api/records", async (req, res) => {
  const data = await client.lRange('test_records', 0, -1);
  const records = data.map(JSON.parse).reverse();
  res.json(records);
});

app.post("/api/records", async (req, res) => {
  const record = { name: `Test ${Date.now()}`, createdAt: new Date() };
  await client.rPush('test_records', JSON.stringify(record));
  res.json(record);
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(3001, () => console.log(`Server running on port 3001`));