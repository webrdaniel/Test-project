import express from "express";
import { selectEstates } from "./db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/estates/list", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const estates = await selectEstates(page, limit);
    res.status(200).send(estates);
  } catch (error) {
    res.status(500).send("Error");
    console.error(error);
  }
});

app.listen(3000, () => console.log(`Server is running.`));
