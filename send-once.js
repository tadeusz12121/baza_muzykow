require("dotenv").config();

const { Resend } = require("resend");
const { MongoClient, ObjectId } = require("mongodb");

const resend = new Resend(process.env.RESEND_API_KEY);
const client = new MongoClient(process.env.MONGO_URL);

async function sendOnce() {
    try {
        await client.connect();

        const db = client.db("baza_muzykow");
        const users = db.collection("users");

        // UZUPEŁNIJ TE DWA ADRESY
        const sender = await users.findOne({
            _id: new ObjectId("6af362fb0e056ff72f2e6718")
        });

        const recipient = await users.findOne({
            _id: new ObjectId("6ad7bc1b16db5cfa2c89cd70")
        });
        

        if (!sender || !recipient) {
            throw new Error("Nie znaleziono któregoś użytkownika.");
        }

        const senderPictureUrl = sender.profilePicture
            ? `https://www.jamly.pl${sender.profilePicture}`
            : "https://www.jamly.pl/default-avatar.png";

        const { data, error } = await resend.emails.send({
            from: "Jamly <powiadomienia@notifications.jamly.pl>",
            to: recipient.email,
            subject: `${sender.name} wysłał Ci wiadomość na Jamly`,

            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <style>
        body {
            background-color:#15151b;
        }
        h2 {
            margin-top: 20px;;
            color: white;
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;


        }
        p {
            text-align: center;
            color: white;
            font-family: Arial, Helvetica, sans-serif;
            margin-bottom: 30px;
        }
        .a2 {
            text-decoration: none;
            color:#fbfbfb;
            font-family: Arial, Helvetica, sans-serif;
            margin: 10px;
            padding: 10px;
            border-radius: 10px;
            background-color: rgb(35, 35, 34);
            border: 1px solid rgb(255, 255, 253);
           

        }
        .main {
             text-align: center;
             display: block;
           
            

        }


.navbar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0f0f1a;
   
    color: #f5d054;
    min-height: 70px;
    padding: 10px;
    
}


.nav-links{
    gap:70px;
    margin: 10px;
    padding: 20px;
    display: flex;
    
   
}
.navbar a {
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
    color:#f0e6d8;
    
}

.hamburger {
    display: none;
    background: none;
    border:none;
    color: rgb(207, 145, 88);
    font-size: 28px;
    cursor:pointer;
    padding: 0;
    margin: 0;

    line-height: 1;

}
@media (max-width: 768px) {
    .navbar {
        justify-content: space-between;
        padding: 0 20px;
        
    }



    .hamburger {
        display: block;
       
    }
    .nav-links {
        display:none;
        flex-direction: column;
        position:absolute;
        top:70px;
        left: 0;
        width: 100%;
        background-color: #15151b;
        padding: 20px;
        gap: 15px;
        z-index: 10;
    }

    .nav-links.open {
        display:flex;
    }
}

.hamburger:hover {
    background-color: transparent;
    color: rgb(218, 217, 214);
}
    </style>
    <header>
    <nav class="navbar">

        <div class="logo">JAMLY</div>

        <button class="hamburger" onclick="document.querySelector('.nav-links').classList.toggle('open')">
             ☰
        </button>

        <div class="nav-links">
            <a href="/index.html">Main page</a>
            <a href="/musicians.html">Musicians</a>
            <a href="/group-chat.html">Czat społeczności</a>
            <a href="/contact.html">Contact</a>
            <a href="/logowanie.html">Sign in</a>
             
</div>

    </nav>
 </header>
    <h2>Masz nową wiadomość!</h2>
    <div style="text-align:center; margin: 25px 0;">
    <img
        src="${senderPictureUrl}"
        alt="Zdjęcie profilowe"
        width="90"
        height="90"
        style="
            width:90px;
            height:90px;
            border-radius:50%;
            object-fit:cover;
            display:block;
            margin:0 auto 15px;
        "
    >

    <p>
        <strong>${sender.name} ${sender.surname || ""}</strong>
        wysłał/a Ci wiadomość.
    </p>
</div>
<div class="main">
    <a class="a2" href="https://www.jamly.pl/chat.html?userId=${sender._id}">
        Otwórz rozmowę
    </a>
    </div>
<hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;">

<p style="font-size: 12px; color: #888; text-align: center;">
    Ta wiadomość została wygenerowana automatycznie.
    Prosimy na nią nie odpowiadać.
</p>

<p style="font-size: 12px; color: #888; text-align: center;">
    © 2026 Jamly
</p>
    
</body>
</html>`
        });

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        console.log("Wysłano:", data);

    } catch (err) {
        console.error("Błąd:", err);
    } finally {
        await client.close();
    }
}

sendOnce();