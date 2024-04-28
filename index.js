const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_KEY}@cluster0.v2tnkbl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("touristDB");
    const spotCollection = database.collection("touristSpot");

    app.get("/", (req, res) => {
      res.send("server is running");
    });
    app.get("/touristSpot",async (req, res) => {
        const cursor = spotCollection.find()
        const result = await cursor.toArray()
        res.send(result);
      });

      app.get("/touristSpot/:id",async (req, res) => {
        const id = req.params.id;
        const query ={_id:new ObjectId(id)}
        const cursor = spotCollection.findOne(query)
        const result = await cursor
        res.send(result);
      });

      app.get("/touristSpotList/:email",async (req, res) => {
        const email = req.params.email;
        const query ={"email":email}
        const cursor = spotCollection.find(query)
        const result = await cursor.toArray()
        res.send(result);
      });

      app.get("/touristSpotSort",async(req,res)=>{
        const cursor = spotCollection.find().sort({"cost":1})
        const result = await cursor.toArray()
        res.send(result)
      })

     app.post("/touristSpot",async(req,res)=>{
        const spot = req.body;
        const result = await spotCollection.insertOne(spot)
        console.log(spot);
        res.send(result)
     }) 


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You  connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
