const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri =
  `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.nhg2oh1.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const bookingsCollection = client
      .db("mars")
      .collection("userBookingInfo");
    const usersCollection = client.db("mars").collection("userInfo");

    app.post("/seatBooking", async (req, res) => {
      const userInfo = req.body;
      const result = await bookingsCollection.insertOne(userInfo);
      res.send(result);
    });

    app.get("/userBookings", async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.send(result);
    });

    app.post("/userRegister", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/userRegister/:email", async (req, res) => {
      const userEmail = req.params.id;
      const query = { email: userEmail };
      console.log(query);
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.get("/userConfirmation", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { userEmail: req.query?.email };
      }
      const result = await bookingsCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/userLogin/:email", async (req, res) => {
      const userEmail = req.params.id;
      console.log(userEmail);
      const query = { email: userEmail };
      const result = await usersCollection.findOne(query);
      if (result) {
        res.send(result);
      } else {
        res.json({ msg: "Can not find the user" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("nasaSpaceApp is running");
});

app.listen(port, () => {
  console.log("Space Tour is run on port", port);
});
