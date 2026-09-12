require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs")
const MongoStore = require("connect-mongo").default;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }


});

app.use(sessionMiddleware);


const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const url = process.env.MONGO_URL;
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

    await users.updateOne(
        { _id: new mongo.ObjectId(req.session.userId) },
        { $set: data }
    );
    res.redirect("/musicians.html");
    
})

app.post("/register-account", upload.single("profilePicture"), async (req, res) => {
    
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


app.post("/edit-profile", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("Nie jesteś zalogowany");
    }
    await client.connect();

   

    const db = client.db("baza_muzykow");
    const users = db.collection("users");

    await users.updateOne(
        { _id: new mongo.ObjectId(req.session.userId)},
        { 
        
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                city: req.body.city,
                instrument: req.body.instrument,
                level: req.body.level,
                lookingFor: req.body.lookingFor
            }
        }

    );

    res.redirect("/musicians.html")


});




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
        surname: user.surname,
        city: user.city,
        instrument: user.instrument,
        level: user.level,
        lookingFor: user.lookingFor,
        secinstrument: user.secinstrument

    })

})

app.get("/notifications", async(req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            error: "Nie jesteś zalogowany"
        });
    }

    await client.connect();

    const db = client.db("baza_muzykow");
    const notifications = db.collection("notifications");

    const wynik = await notifications.find({
        userId: new mongo.ObjectId(req.session.userId),
        read: false
    }).toArray();
    res.json(wynik);
    
});
app.post("/notifications/read", async (req, res) => {
    if(!req.session.userId) {
        return res.status(401).json({
            error: "nie jestes zalogowany"
        });
    }

    await client.connect();

    const db = client.db("baza_muzykow");
    const notifications = db.collection("notifications");

    await notifications.deleteOne({
        _id: new mongo.ObjectId(req.body. notificationId),
        userId: new mongo.ObjectId(req.session.userId)

    });

    res.json({ success: true });
})


app.get("/musicians", async (req, res) => {
    await client.connect();

    const db = client.db("baza_muzykow");
    const musicians = db.collection("users");
    const filter = {};
    
    if (req.query.instrument) {
    filter.$or = [
        { instrument: req.query.instrument },
        { secinstrument: req.query.instrument }
    ];
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
    console.log("QUERY:", req.query);
    console.log("FILTER:", filter);

    const wynik = await musicians.find(filter).toArray();


    console.log("WYNIK:", wynik);
    res.json(wynik);
});


app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/register.html");
    });
});

app.get("/messages/:userId", async (req, res) =>{

    if (!req.session.userId) {
        return res.status(401).json({
            error: "Nie jesteś zalogowany"
        });
    }
    await client.connect();
    const db = client.db("baza_muzykow");
    const messages = db.collection("messages");

    const myId = new mongo.ObjectId(req.session.userId);
    const otherId = new mongo.ObjectId(req.params.userId);

    const history = await messages.find({
        $or: [
            {
                senderId: myId,
                receiverId: otherId

            },
            {
                senderId: otherId,
                receiverId: myId
            }
        ]
    }).sort({ createdAt: 1 }).toArray();


    res.json(history.map(message => ({
        ...message,
        senderId: message.senderId.toString(),
        receiverId: message.receiverId.toString()
    })))


    
});


function reqiureLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/logowanie.html");
    }

    next();
}

app.use((req, res, next) => {
    if (req.path === "/musicians.html" && !req.session.userId) {
        return res.redirect("/logowanie.html");

    }

    next();
});

app.post("/contact", async (req,res) => {
    try {
        await client.connect();

        const db = client.db("baza_muzykow");
        const contact = db.collection("contact");

        await contact.insertOne({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            createdAt: new Date()

        });
        res.json({
            message:"wiadomosc zostala wyslana!"

        });

    
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message:"nie udało się wysłać wiadomośći."
        });
        
    }
});


app.use(express.static("."));




app.use("/uploads", express.static("uploads"));
//processDB();
app.use(express.static("."));

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const { log } = require("console");
const io = new Server(server);
io.engine.use(sessionMiddleware);


io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    console.log("uzytkownik połączony:", userId);


    if (!userId) {
        socket.disconnect();
        return;
    }

    socket.on("private message", async ({ receiverId, message}) => {

        await client.connect();

        const db = client.db("baza_muzykow");
        const messages = db.collection("messages");

        await messages.insertOne({


            senderId: new mongo.ObjectId(userId),
            receiverId: new mongo.ObjectId(receiverId),
            message: message,
            createdAt: new Date()

        });

        const notifications = db.collection("notifications");

        await notifications.insertOne ({
            userId: new mongo.ObjectId(receiverId),
            senderId: new mongo.ObjectId(userId),
            type: "message",
            read: false,
            createdAt: new Date()

        });



        io.to(`user:${receiverId}`).emit("private message", {
            senderId: userId.toString(),
            message: message
    });

        io.to(`user:${userId}`).emit("private message", {
            senderId: userId.toString(),
            message: message
    });


      
    });


    socket.join(`user:${userId}`);


    socket.on("disconnect", () => {
        console.log("uzytkownik rozlaczony:", userId);

    });

});

server.listen(process.env.PORT || 3000);