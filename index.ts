import express from "express";
import ejs from "ejs";

import { getQoute,getRandomQoutes,linkCharsAndMovieToQoute } from "./public/js/quizGame";
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
    res.render("tenRound",{qoutes:randomQuotes});
})

app.get("/suddenDeath",(req,res)=>{
    let randomQuotes = getRandomQoutes(quotes,quotes.length)
    res.render("suddenDeath",{qoutes:randomQuotes});
})

app.listen(app.get("port"), async () => {
    
    quotes = await linkCharsAndMovieToQoute()
    console.log("[server] http://localhost:" + app.get("port"))
});