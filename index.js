const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const uri = process.env.MONGO_URI


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async function(req, res){
  const {username} = req.body
  client.connect(async err => {
    if (err) throw err;
    await client.db("users").collection("users.collection").insertOne({
      'username': username
    }).then(async x =>{
     await client.db('users').collection('users.collection').findOne({'username': username}).then(async x =>{
      await res.send(x)
     })
    })
    
    client.close()
  });
})
app.get("/api/users", async function(req, res) {
  await client.db('users').collection('users.collection').find().toArray().then(x =>{
    res.send(x)
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
