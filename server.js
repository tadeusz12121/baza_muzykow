const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,

}))
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function processDB() {
    

    try {
        await client.connect();

        const dbList = await client.db().admin().listDatabases();
        const db = client.db("baza_muzykow");
        const musicians = db.collection("musicians");
        console.log("Databases:");


        

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

app.post("/register", async (req, res) => {
    await client.connect();
    const db = client.db("baza_muzykow");
    const musicians = db.collection("musicians");

    
    console.log(req.body);

    await musicians.insertOne(req.body);
    res.send("zarejestrowano");

})

app.post("/register-account", async (req, res) => {
    console.log(req.body);
    await client.connect();
    const db = client.db("baza_muzykow");
    const users = db.collection("users");

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = {
        username: req.body.username,
        email: req.body.email,
        password: hash
    };
    await users.insertOne(user);

    res.send("konto odebrane");
})

app.post("/login", async (req, res ) => {
    await client.connect();

    const db = client.db("baza_muzykow");
    const users = db.collection("users");

    const user = await users.findOne({

        email: req.body.email
    });
    if (!user) {
        return res.send("nieprawidlowy email lub haslo");
    }


    const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!passwordMatch) {
        return res.send("nieprawidlowy email lub haslo");
    }   

    req.session.userId = user._id;

    res.send("zalogowano");
   
    console.log(user);

 
})
app.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.send("nie jestes zalogowany ");
    }
    res.send("jestes zalogowany");
})
app.get("/musicians", async (req, res) => {
    await client.connect();

    const db = client.db("baza_muzykow");
    const musicians = db.collection("musicians");

    const wynik = await musicians.find({}).toArray();

    res.json(wynik);
});
//processDB();
app.use(express.static("."));

app.listen(3000);