const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/chess_app"; 

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("chess_app"); 
    const collection = database.collection("users"); 

    await collection.dropIndex("email_1"); 
    // await collection.createIndex({ username: 1 }, { unique: true }); 

  } finally {
    await client.close();
  }
}

run().catch(console.dir);