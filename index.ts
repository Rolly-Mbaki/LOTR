import express from "express";
import ejs from "ejs";

import { getQoute,getRandomQoutes } from "./public/js/quizGame";
import { Quote } from "./types/quizTypes";
import quizRouter from "./routes/quiz";

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("port", 3000);
let quotes: Quote[] = [{id:"d",_id:"",dialog:"d",character:"d",movie:"d"}];
app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/home",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/blacklist",(req,res)=>{
    res.render("blacklist");
})

app.get("/fav",(req,res)=>{
    res.render("fav");
})

app.get("/tenRound",(req,res)=>{
    let randomQuotes = getRandomQoutes(quotes,10)
    console.log(randomQuotes[1])
    res.render("tenRound");
})

app.get("/suddenDeath",(req,res)=>{
    let randomQuotes = getRandomQoutes(quotes,quotes.length)
    console.log(randomQuotes[1])
    res.render("suddenDeath");
})

/* app.get("/test",(req,res)=>{
    res.json(quotes);
}) */


app.use("/", quizRouter(quotes))


app.listen(app.get("port"), async () => {
    quotes = await getQoute();
    
    console.log(quotes[10])
    
    console.log("[server] http://localhost:" + app.get("port"))
});