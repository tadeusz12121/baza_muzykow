const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs")


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

const uploadDir = path.join(__dirname, "uploads/profile");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });

}
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); 
    }
})
const upload =multer({ storage });




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
    const users = db.collection("users");

    console.log(req.body);

     const data = {
        ...req.body,

        skills: req.body.skills
            ? Array.isArray(req.body.skills)
                ? req.body.skills
                : [req.body.skills]
            :[],
        genres: req.body.genres
            ? Array.isArray(req.body.genres)
                ? req.body.genres
                : [req.body.genres]

            :[]




     };





    console.log("USER ID:", req.session.userId);
    console.log("PREFERENCJE:", req.body);
    await users.updateOne(
        { _id: new mongo.ObjectId(req.session.userId) },
        { $set: data }
    );
    res.redirect("/musicians.html");
    
})

app.post("/register-account", upload.single("profilePicture"), async (req, res) => {
    console.log(req.body);
    await client.connect();
    const db = client.db("baza_muzykow");
    const users = db.collection("users");

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hash,
        profilePicture: req.file
            ? `/uploads/profile/${req.file.filename}`
            : null
    };

    const result = await users.insertOne(user);
    req.session.userId = result.insertedId;
    res.redirect("/rejestracja.html");
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
    res.redirect("/musicians.html");


    
   
    console.log(user);

 
})



app.get("/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            error: "Nie jesteś zalogowany"
        });
    }

    await client.connect();

    const db = client.db("baza_muzykow");
    const users = db.collection("users");

    const user = await users.findOne({
        _id: new mongo.ObjectId(req.session.userId)
    });

    if (!user) {
        return res.status(404).json({
            error: "Nie znaleziono uzytkownika"

        });
    }

    res.json({
        name: user.name,
        surname: user.surname
    })

})



app.get("/musicians", async (req, res) => {
    await client.connect();

    const db = client.db("baza_muzykow");
    const musicians = db.collection("users");
    const filter = {};
    if (req.query.instrument) {
        filter.instrument = req.query.instrument;
    }
    if (req.query.level) {
        filter.level = req.query.level;
}
    if (req.query.city) {
        filter.city = {
            $regex: req.query.city,
            $options: "i"
        
        };
    }

    const wynik = await musicians.find(filter).toArray();
    console.log("WYNIK:", wynik);
    res.json(wynik);
});


app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/register.html");
    });
});

app.use("/uploads", express.static("uploads"));
//processDB();
app.use(express.static("."));

app.listen(3000);