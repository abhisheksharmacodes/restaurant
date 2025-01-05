const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

let cachedClient = null;

async function connect() {
    if (cachedClient) return cachedClient;
    try {
        cachedClient = await MongoClient.connect('mongodb+srv://geekysharma31:m3j15I4IMEkrfQaA@cluster0.2yhke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
        return cachedClient;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

connect()

app.get('/', (req, res) => {
    res.send('working')
})

app.get("/timeslots", async (req, res) => {
    try {
        const client = await connect(); // Assuming connect() establishes a MongoDB connection
        const db = client.db("restaurant");
        const collection = db.collection("timeslots");
        const results = await collection.find({}).toArray();
        res.send(results[0].timeslots);
    } catch (e) {
        res.send(e)
    }
})

app.put('/timeslots/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body

    console.log(data)

    try {
        const client = await connect();
        const db = client.db("restaurant");
        const collection = db.collection("timeslots");
        const updateResult = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { timeslots: data } })
        if (updateResult.modifiedCount === 1) {
            res.send(true)
        } else {
            res.send(false)
        }
    } catch (err) {
        console.error(err)
        res.status(500)
    }

})

app.listen(port, () => {
    console.log('Listening at port ' + port)
})