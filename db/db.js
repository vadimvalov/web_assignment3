const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://vlobizon:552552Vadim@clusteraitu.ltr3eey.mongodb.net/";
const client = new MongoClient(url);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

module.exports = { client, connectToDatabase };
