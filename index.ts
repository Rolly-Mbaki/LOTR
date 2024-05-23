import express from "express";
import ejs from "ejs";
import dotenv from "dotenv"
import session from "./session";
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt')

dotenv.config()

import { getMovies, getQoute, getApiLength, getChars,getRandomQoutes,linkCharsAndMovieToQoute } from "./public/js/quizGame";
import { addQuotesToDB } from "./public/js/QuotesDb";
import { Quote, gameQuote, FavQuote, BlQuote } from "./types/quizTypes";
import quizRouter from "./routes/quiz";
import { log } from "console";

const app = express();

const uri:string = process.env.MONGO_URI as string;
const client = new MongoClient(uri);

export interface User {
    _id?:string,
    email:string,
    username:string,
    password:string,
    favQuotes:FavQuote[],
    blQuotes:BlQuote[],
    highscores:number[],
  }
  
let message:string = "";
let error:boolean = true;
let user:User = {
    username: "",
    email:"",
    password:"",
    favQuotes:[],
    blQuotes: [],
    highscores:[]
};

// const connectQuotesToMoviesAndCharacters = async () => {
//     try {
//         let limit = await getApiLength();
//         let quotes:Quote[] = await getQoute(limit);
//         let chars:Character[] = await getChars(limit);
//         let movies:Movie[] = await getMovies(limit);

//         const quotesWithMovieAndCharacter = quotes.map(quote => ({
//             ...quotes,
//             movie: movies.find(movie => movie._id === quote.movie),
//             character: chars.find(character => character._id === quote.character)
//         }));
//         // console.log(quotesWithMovieAndCharacter)
//         return quotesWithMovieAndCharacter
//     } catch (error) {
//         console.log('error', error)
//     }
// }

//middleware
app.use(session)
app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))

const isAuth = (req:any, res:any, next:any) =>{
    if(req.session.isAuth){
        next()
    } else {
        res.redirect("/login")
    }
}

app.set("view engine", "ejs");
app.set("port", 3000);

// app.get("/",(req,res)=>{
//     req.session.regenerate(e => {
//         console.log(req.session)
//         console.log(req.session.id)
//         console.log(req.session.user)
//         res.render("index");
//     })
// })
let quotes: Quote[] = [{id:"d",_id:"",dialog:"d",character:"d",movie:"d",wikiUrl:"d"}];
linkCharsAndMovieToQoute().then(data => (quotes = data))
// addQuotesToDB(quotes)
app.get("/",(req,res)=>{
    console.log(quotes.length)
    res.render("index");
})

app.get("/home", isAuth, (req,res)=>{
    // console.log(user)
    // linkCharsAndMovieToQoute().then(console.log)
    res.render("home",{user:req.session.user});
})

app.get("/login",(req,res)=>{
    // user = {
    //     username: "",
    //     email:"",
    //     password:""
    // };
    if (req.session.isAuth) {
        res.redirect("/home")
    }
    else res.render("login")
})

app.post("/login", async (req,res)=>{
    // let userObject:User = req.session.user ? req.session.user : undefined;
    try {
        await client.connect();

        let userObject:User = await client.db('LOTR').collection('Users').findOne({username:req.body.username.toString().toLowerCase()})

        if (userObject == null) {
            message = "Gebruiker niet gevonden"
            error = true
            res.render("login",{message:message,error:error})
        }
        if (userObject!=null) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, userObject.password)
            if (isPasswordMatch){
                //hier moet ik session beginnen maken
                //req.session.isLoggedIn = true
                req.session.isAuth = true
                // console.log(req.session.id)
                req.session.user = userObject
                // console.log(req.session.user)
                // user = userObject;
                res.redirect("home")
            }
            else{
                message= "Fout wachtwoord"
                error= true
                res.render("login",{message:message,error:error})
            }
        }

    } catch (e) {
        console.error(e);
    }
})

app.get("/register",(req,res)=>{
    // user = {
    //     username: "",
    //     email:"",
    //     password:""
    // };
    if (req.session.isAuth) {
        res.redirect("/home")
    }
    else res.render("register")
})

app.post("/register", async (req,res)=>{

    let newUser:User = {
        username:req.body.username.toString().toLowerCase(),
        email:req.body.email.toString().toLowerCase(),
        password:req.body.password,
        favQuotes:[],
        blQuotes: [],
        highscores:[]
      }
      const saltRounds = 10
      const hashehPassword = await bcrypt.hash(newUser.password, saltRounds)

      newUser.password = hashehPassword
      
      console.log(newUser)
      
       
        
        
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
                req.session.isAuth = true
                // console.log(req.session.id)
                req.session.user = newUser
                // console.log(req.session.user)
                message = "Account succevol aangemaakt!"
                error = false

                //hier moet ik session beginnen maken
                //req.session.isLoggedIn = true
                res.redirect("home")
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
        

});

/////// om session te beeindigen
// req.session.destroy(() => {
//     res.redirect('/')
// });
//////

// app.post("/register", async (req,res)=>{

//     let newUser:User = {
//         username:req.body.username,
//         email:req.body.email.toString().toLowerCase(),
//         password:req.body.password
//       }
//       const saltRounds = 10
//       const hashehPassword = await bcrypt.hash(newUser.password, saltRounds)

//       newUser.password = hashehPassword
      
//       console.log(newUser)
      
//        try {
//         await client.connect();
        
        
//         let userEmail:User = await client.db('LOTR').collection('Users').findOne({email:req.body.email.toString().toLowerCase()})

//         let userUsername: User = await client.db('LOTR').collection('Users').findOne({username:req.body.username})
        
//         console.log(userUsername)

//         if (userEmail == null) {


//             if (userUsername.username.toLowerCase() == newUser.username.toLowerCase()) {
            
//                 message = "Gebruikersnaam bestaat al"
//                 error = true
//                 res.render("register",{message:message,error:error})
//             }  
//             else if (req.body.password.length > 6) {
//                 await client.db('LOTR').collection('Users').insertOne(newUser);
//                 message = "Account succevol aangemaakt!"
//                 error = false
//                 res.redirect("home")
//             } 
//             else if (req.body.password.length <= 7) {
//                 message = "Wachtwoord bevat minder dan 8 karakaters"
//                 error = true
//                 res.render("register",{message:message,error:error})
//           }
//         } 

//         if (userEmail != null) {
          
//             message = "Email bestaat al"
//             error = true
//             res.render("register",{message:message,error:error})
//         }
        
//     } catch (e) {
//         console.error(e);
//         error = true
//         message = "Account maken mislukt, probeer terug opnieuw"
//     } finally {
//         await client.close();
//     } 
// });



app.get("/blacklist",isAuth, async (req,res)=>{


        let userObject:User = await client.db('LOTR').collection('Users').findOne({username:req.session.user?.username})
        if (userObject) {
            let blQuotes:BlQuote[] = userObject.blQuotes
            // console.log(favQuotes)
            res.render("blacklist",{user:req.session.user, blQuotes})
        }

})

app.get("/fav",isAuth, async (req,res)=>{

    let userObject:User = await client.db('LOTR').collection('Users').findOne({username:req.session.user?.username})
    if (userObject) {
        let favQuotes:FavQuote[] = userObject.favQuotes
        const paginatedQuotes = favQuotes.slice(0,6)
        // console.log(favQuotes)
        res.render("fav",{user:req.session.user, favQuotes,paginatedQuotes})
    }

})

app.get("/fav/:character",isAuth, async (req,res)=>{

    const character = decodeURIComponent(req.params.character)
    const allQuotes:Quote[] = quotes.filter(quote => quote.character.toLowerCase() == character.toLowerCase()) 
    
    res.render("quotesPerChar",{user:req.session.user, allQuotes})
})

app.get("/tenRound",isAuth,(req,res)=>{
    console.log(req.session.user)
    let randomQuotes = getRandomQoutes(quotes,10)
    res.render("tenRound",{qoutes:randomQuotes,user:req.session.user, added:false});
})

app.get("/suddenDeath",isAuth, (req,res)=>{
    let randomQuotes:gameQuote[] = getRandomQoutes(quotes,quotes.length)
    res.render("suddenDeath",{user:req.session.user,qoutes:randomQuotes});
})


app.post("/logout", async(req,res) =>{
    req.session.destroy(e => {
        if(e) throw e
        res.redirect('/login')
    })
    await client.close();
})

app.post("/like", async (req,res) =>{
    console.log(req.body)

    let charWiki = quotes.find(char => char.character == req.body.char)?.wikiUrl
    let totalQuotes = quotes.filter(quote => quote.character === req.body.char).length

    let favQuote:FavQuote = {quote:"", character:"", charWiki:"",totalCharQuotes:0}
    if (charWiki) {
        favQuote = {quote: req.body.quote, character:req.body.char, charWiki:charWiki, totalCharQuotes:totalQuotes}
        console.log(favQuote) 
    }
    


        const filter = {username: req.session.user?.username}

        const taken = await client.db('LOTR').collection('Users').findOne({
            username: req.session.user?.username,
            blQuotes: { $elemMatch: { quote: favQuote.quote } }
        });

        let update

        if (taken) {
            update = {
                $pull: { blQuotes: { quote: favQuote.quote } },
                $addToSet: { favQuotes: favQuote }
            };
        } else {
            update = { $addToSet: { favQuotes: favQuote } };
        }

        const add = await client.db('LOTR').collection('Users').updateOne(filter, update)

        if (add.modifiedCount === 0) {
            console.log("Quote already exists in the array");
            return res.status(409).send({message:"Quote zit al tussen je favorieten"});
        }
        console.log("Quote added to favQuotes array");

        res.status(200).send({ message: "Quote toegevoegd aan je favorieten"});


})

app.post("/dislike", async (req,res) =>{
    console.log(req.body)

    let blQuote:BlQuote = {quote:req.body.quote, character:req.body.char, reason:req.body.reason}
    


        const filter = {username: req.session.user?.username}
        // const add = {$addToSet: {blQuotes: blQuote}}
        // const remove = {$pull: {favQuotes: {quote: blQuote.quote}}}

        const taken = await client.db('LOTR').collection('Users').findOne({
            username: req.session.user?.username,
            favQuotes: { $elemMatch: { quote: blQuote.quote } }
        });

        let update

        if (taken) {
            update = {
                $pull: { favQuotes: { quote: blQuote.quote } },
                $addToSet: { blQuotes: blQuote }
            };
            console.log("Quote moved from favQuotes to blQuotes");
        }
        else {
            update = { $addToSet: {blQuotes: blQuote} }
        }

        const add = await client.db('LOTR').collection('Users').updateOne(filter, update);

        if (add.modifiedCount === 0) {
            console.log("Quote already exists in the array");
            return res.status(409).send({message:"Quote zit al tussen jouw geblacklisten"});
        }
        console.log("Quote added to blacklist array");

        res.status(200).send({ message: "Quote toegevoegd aan je geblacklisten"});


})

app.post("/deleteFavQuote", async (req,res) =>{
    console.log(req.body)


        const filter = {username: req.session.user?.username}
        const update = {$pull: {favQuotes: {quote: req.body.quote}}}
        const remove = await client.db('LOTR').collection('Users').updateOne(filter, update)

        if (remove.modifiedCount === 0) {
            console.log("Quote not found in the array")
            return res.status(404).send("Quote not found in the array")
        }
        console.log("Quote removed from favQuotes array");

        res.status(200).send("Data deleted from MDB");


})

app.post("/deleteBlQuote", async (req,res) =>{
    console.log(req.body)


        const filter = {username: req.session.user?.username}
        const update = {$pull: {blQuotes: {quote: req.body.quote}}}
        const remove = await client.db('LOTR').collection('Users').updateOne(filter, update)

        if (remove.modifiedCount === 0) {
            console.log("Quote not found in the array")
            return res.status(404).send("Quote not found in the array")
        }
        console.log("Quote removed from favQuotes array");

        res.status(200).send("Data deleted from MDB");

})

app.post("/updateBlQuote", async (req,res) =>{
    console.log(req.body)


        const filter = { 
            username: req.session.user?.username,
            "blQuotes.quote": req.body.quote 
        };

        const update = { 
            $set: { "blQuotes.$.reason": req.body.reason } 
        };

        const result = await client.db('LOTR').collection('Users').updateOne(filter, update);

        if (result.modifiedCount === 0) {
            console.log("Quote not found in the array")
            return res.status(404).send("Quote not found in the array")
        }
        console.log("Reason changed");

        res.status(200).send("Reason updated");


})

app.listen(app.get("port"), async () => {
    
    quotes = await linkCharsAndMovieToQoute()
    console.log("[server] http://localhost:" + app.get("port"))
});