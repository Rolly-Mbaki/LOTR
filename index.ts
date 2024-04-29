import express from "express";
import ejs from "ejs";
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt')

const app = express();

const uri:string = "mongodb+srv://rolly:124501@webont.9shb7rd.mongodb.net/";
const client = new MongoClient(uri, { useUnifiedTopology: true });

interface User {
    _id?:string,
    email:string,
    username:string,
    password:string,
    favQuotes?:string[],
    blQuotes?:string[],
    highscores?:number[],
  }
  
let message:string = "";
let error:boolean = true;

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}))

app.set("view engine", "ejs");
app.set("port", 3000);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/home",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async (req,res)=>{
    try {
        await client.connect();

        let userUsername = await client.db('LOTR').collection('Users').findOne({username:req.body.username.toString().toLowerCase()})

        if (userUsername == null) {
            message = "Gebruiker niet gevonden"
            error = true
            res.render("login",{message:message,error:error})
        }
        else{
            res.render("login",{message:message,error:error})
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
})

app.get("/register",(req,res)=>{

    res.render("register")
})

app.post("/register", async (req,res)=>{

    let newUser:User = {
        username:req.body.username.toString().toLowerCase(),
        email:req.body.email.toString().toLowerCase(),
        password:req.body.password
      }
      const saltRounds = 10
      const hashehPassword = await bcrypt.hash(newUser.password, saltRounds)

      newUser.password = hashehPassword
      
      console.log(newUser)
      
       try {
        await client.connect();
        
        
        let userEmail = await client.db('LOTR').collection('Users').findOne({email:req.body.email.toString().toLowerCase()})

        let userUsername = await client.db('LOTR').collection('Users').findOne({username:req.body.username.toString().toLowerCase()})
        
        if (userEmail == null) {

            if (userUsername != null) {
            
                message = "Gebruikersnaam bestaat al"
                error = true
                userUsername = null
                res.render("register",{message:message,error:error})
            }  
            else if (req.body.password.length > 6) {
                await client.db('LOTR').collection('Users').insertOne(newUser);
                message = "Account succevol aangemaakt!"
                error = false
                res.render("home")
            } 
            else if (req.body.password.length <= 7) {
                message = "Wachtwoord bevat minder dan 8 karakaters"
                error = true
                res.render("register",{message:message,error:error})
          }
        } 

        if (userEmail != null) {
          
            message = "Email bestaat al"
            error = true
            userEmail = null
            res.render("register",{message:message,error:error})
        }
        
    } catch (e) {
        console.error(e);
        error = true
        message = "Account maken mislukt, probeer terug opnieuw"
    } finally {
        await client.close();
    } 
});

app.get("/blacklist",(req,res)=>{
    res.render("blacklist");
})

app.get("/fav",(req,res)=>{
    res.render("fav");
})

app.get("/suddenDeath",(req,res)=>{
    res.render("suddenDeath");
})

app.get("/tenRound",(req,res)=>{
    res.render("tenRound");
})


app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);