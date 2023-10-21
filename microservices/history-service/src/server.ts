import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pgQuery } from "./db";
import { PgHistoryItem } from "./types";
import { convertFromPgToJs } from "./utilities/convertFromPgToJs";

dotenv.config();

if (
  process.env.PGHOST == undefined ||
  process.env.PGDATABASE == undefined ||
  process.env.PGPORT == undefined ||
  process.env.PGUSER == undefined ||
  process.env.PGPASSWORD == undefined
) {
  throw new Error("dotenv is not configured!");
}

const PORT = process.env.PORT !== undefined ? Number(process.env.PORT) : 7999;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/history/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const query = "SELECT * FROM history WHERE history.username = $1";
    const result = await pgQuery(query, [username]);

    const pgHistoryItems = result.rows as PgHistoryItem[];

    if (pgHistoryItems.length === 0) {
      res.sendStatus(204);
      return;
    }

    // convert from question_id to questionId
    const jsHistoryItems = pgHistoryItems.map((each) =>
      convertFromPgToJs(each)
    );

    res.json(jsHistoryItems);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/api/history", async (req, res) => {
  const { username, questionId, text } = req.body;

  if (
    username === undefined ||
    questionId === undefined ||
    text === undefined
  ) {
    res.sendStatus(400);
    return;
  }

  try {
    const query =
      "INSERT INTO history(username, timestamp, question_id, text) VALUES ($1, $2, $3, $4)";

    const _ = await pgQuery(query, [username, new Date(), questionId, text]);

    res.sendStatus(200);
  } catch (error: any) {
    console.error(error);

    if (error.code === "23505") {
      // duplicated entry
      res.sendStatus(422);
    } else {
      res.sendStatus(500);
    }
  }
});

app.get("/", (req, res) => {
  res.send("History is alive!");
});

app.listen(PORT, "::", () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
