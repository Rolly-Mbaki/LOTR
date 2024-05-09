import express from "express";
import ejs from "ejs";
import dotenv from "dotenv"
import session from "./session";
const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt')

dotenv.config()

import { getMovies, getQoute, getApiLength, getChars,getQuizQuestions,linkCharsAndMovieToQoute } from "./public/js/quizGame";
import { addQuotesToDB } from "./public/js/QuotesDb";
import { Quote, gameQuote, Movie,Character, Quiz} from "./types/quizTypes";
import quizRouter from "./routes/quiz";
import { log } from "console";

const app = express();

const uri:string = process.env.MONGO_URI as string;
const client = new MongoClient(uri, { useUnifiedTopology: true });

export interface User {
    _id?:string,
    email:string,
    username:string,
    password:string,
    favQuotes?:string[],
    blQuotes?:string[],
    highscores?:number[],
  }

interface FavQuote {
    _id?:string,
    quote:string,
    character:string,
    charwiki:string
}

let favQuotes:FavQuote[] = [
    {
        quote:"Het staat in het boek van principes",
        character:"Furkan",
        charwiki:"wwww.youtube.com"
    },
    {
        quote:"Wie doet HET?",
        character:"Yunus",
        charwiki:"wwww.google.com"
    },
]
  
let message:string = "";
let error:boolean = true;
let user:User = {
    username: "",
    email:"",
    password:""
};

const shuffleArray = (array:Quiz[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const fillVariables = async () =>{
    try {
        quotes = await linkCharsAndMovieToQoute()
        randomQuotes = await getQuizQuestions(quotes.length)
    } catch (e) {
        console.log('error: ',e)
    }
}
let quotes: Quote[] = [{id:"",_id:"",dialog:"",movie:"",character:""}];
let randomQuotes:Quiz[] = []
fillVariables()
console.log(randomQuotes)

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
// linkCharsAndMovieToQoute().then(data => (quotes = data))
// getQuizQuestions(quotes.length).then(data => (randomQuotes = data))
//linkCharsAndMovieToQoute().then(console.log)
// addQuotesToDB(quotes)
//getQuizQuestions(5).then(console.log)
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
                console.log(req.session.id)
                req.session.user = userObject
                console.log(req.session.user)
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
    } finally {
        await client.close();
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
                req.session.isAuth = true
                console.log(req.session.id)
                req.session.user = newUser
                console.log(req.session.user)
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
        
    } catch (e) {
        console.error(e);
        error = true
        message = "Account maken mislukt, probeer terug opnieuw"
    } finally {
        await client.close();
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



app.get("/blacklist",isAuth, (req,res)=>{
    res.render("blacklist",{user:req.session.user});
})

app.get("/fav",isAuth, (req,res)=>{
    console.log(favQuotes)
    res.render("fav",{user:req.session.user, favQuotes});
})

app.get("/tenRound",isAuth,(req,res)=>{
    let randomQuotes = getQuizQuestions(10)
    res.render("tenRound",{qoutes:randomQuotes,user:req.session.user});
})

app.get("/suddenDeath",isAuth, (req,res)=>{
    // let randomQuotes = await getQuizQuestions(quotes.length)
    // console.log(randomQuotes)
    // randomQuotes.sort(() => 0.5 - Math.random())
    randomQuotes = shuffleArray([...randomQuotes])
    res.render("suddenDeath",{user:req.session.user,quotes:randomQuotes});
})


app.post("/logout", (req,res) =>{
    req.session.destroy(e => {
        if(e) throw e
        res.redirect('/login')
    })
})



app.listen(app.get("port"), async () => {
    
    // quotes = await linkCharsAndMovieToQoute()
    console.log("[server] http://localhost:" + app.get("port"))
});