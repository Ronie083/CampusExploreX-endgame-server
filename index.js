const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dlzg3av.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const universitiesColl = client.db("campusExploreDb").collection("universities");
        const reviewsColl = client.db("campusExploreDb").collection("reviews");
        const appliedColl = client.db("campusExploreDb").collection("appliedIn");

        app.get('/universities', async (req, res) => {
            const result = await universitiesColl.find().toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsColl.find().toArray();
            res.send(result);
        })

        app.get('/universities/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { "id": id };
            const options = {
                projection: { id: 0 },
            };
            const result = await universitiesColl.findOne(query, options);
            res.send(result);
        });


        app.post('/applied', async (req, res) => {
            const studentData = req.body;
            const result = await appliedColl.insertOne(studentData);
            res.send(result)
        })

        app.get('/applied', async (req, res) => {
            const result = await appliedColl.find().toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server of Campus Explore X is here')
})

app.listen(port, () => {
    console.log(`The port number for Campus Explore X is ${port}`);
})