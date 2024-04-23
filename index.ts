import express from "express";
import ejs from "ejs";

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("port", 3000);

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

app.get("/suddenDeath",(req,res)=>{
    res.render("suddenDeath");
})

app.get("/tenRound",(req,res)=>{
    res.render("tenRound");
})


app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);