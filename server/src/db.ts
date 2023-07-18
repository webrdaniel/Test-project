import pg from "pg";
import { env } from "process";
import { fetchEstates } from "./fetchData.js";
import { IEstate } from "./types.js";

const dbClient = new pg.Client({
  user: "postgres",
  host: "db",
  database: "postgres",
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT ? parseInt(env.POSTGRES_PORT) : 5432,
});

const createEstatesTableIfNotExists = async () => {
  const existsTableQuery = `SELECT EXISTS (SELECT FROM information_schema.tables
                        WHERE table_schema = 'public' AND table_name = 'estates');`;
  const existsTable = await dbClient.query(existsTableQuery);

  if (existsTable.rows[0].exists) {
    console.log("Using existing estates table");
    return;
  }

  console.log("Creating estates table");
  const createTableQuery = `CREATE TABLE estates
                            (id serial PRIMARY KEY, title VARCHAR (255), image VARCHAR (255));`;
  await dbClient.query(createTableQuery);

  console.log("Seeding estates table");
  await seedTable();
};

const insertEstate = async (estate: IEstate) => {
  const query = `INSERT INTO estates(title, image) VALUES($1, $2)`;
  const values = [estate.title, estate.image];
  return dbClient.query(query, values);
};

export const selectEstates = async (page: number, limit: number) => {
  const selectQuery = "SELECT * FROM estates LIMIT $1 OFFSET $2";
  const selectValues = [limit, (page - 1) * limit];

  const result = await dbClient.query(selectQuery, selectValues);

  const countQuery = "SELECT COUNT(*) FROM estates";
  const countResult = await dbClient.query(countQuery);

  return {
    rows: result.rows,
    pagesCount: Math.ceil(countResult.rows[0].count / limit),
  };
};

const seedTable = async () => {
  const estates = await fetchEstates();
  await Promise.all(estates.map((estate) => insertEstate(estate)));
};

dbClient.connect();
createEstatesTableIfNotExists();
