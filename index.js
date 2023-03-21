const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// middle wire
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://eMartUser:02NozJWSBpKArExS@cluster0.rdx4d.mongodb.net/?retryWrites=true&w=majority";

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdx4d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// const verifyJwtToken = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   console.log(authorization);
//   if (!authorization) {
//     return res.status(401).send({ message: "UnAuthorized User" });
//   }
//   const token = authorization.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
//     if (error)
//       return res.status(403).send({ message: "Forbidden User Access" });
//     req.decoded = decoded;
//     next();
//   });
// };

async function run() {
  try {
    await client.connect();
    const postCollection = client.db(`eMart`).collection("posts");
    const productCollection = client.db(`eMart`).collection("products");
    const userCollection = client.db(`eMart`).collection("users");
    const commentCollection = client.db(`eMart`).collection("comments");

    app.get("/", async (req, res) => {
      res.send("Welcome To E-Mart Server");
    });
    app.get("/posts", async (req, res) => {
      const query = {};
      const result = await postCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await postCollection.findOne(query);
      res.send(result);
    });
    app.post("/comment", async (req, res) => {
      const comment = req.body;
      console.log(comment);
      const result = await commentCollection.insertOne(comment);
      console.log(result);
      res.send(result);
    });
    app.get("/comment", async (req, res) => {
      const query = {};
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`listining port ${port}`);
});
