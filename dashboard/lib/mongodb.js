import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

let db;

export async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db("morpli");
  }

  return db;
}
