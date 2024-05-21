import { Quote,Character,Movie,gameQuote } from "../../types/quizTypes";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.LOTR_API_KEY as string;

export const getApiLength = async () => {
  const response2 = await fetch('https://the-one-api.dev/v2/quote', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const lengthApiJson = await response2.json();
  const lengthOfApi = lengthApiJson.total
  return lengthOfApi;
}



export const getQoute = async (limit:number=10000) => {
    const apiUrl = `https://the-one-api.dev/v2/quote?limit=${limit}`;

    const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
    const responeDoc = await response.json();
    const quotes:Quote[] = responeDoc.docs
    return quotes;
}

export const getChars = async (limit:number=10000) => {
  const apiUrl = `https://the-one-api.dev/v2/character?limit=${limit}`;

  const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
  const responeDoc = await response.json();
  const chars:Character[] = responeDoc.docs
  return chars;
}

export const getMovies = async (limit:number=10000) => {

  const apiUrl = `https://the-one-api.dev/v2/movie?limit=${limit}`;

  const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
  const responeDoc = await response.json();
  const movies = responeDoc.docs
  return movies;
}

export const linkCharsAndMovieToQoute = async() => {
  let limit = await getApiLength();
  let qoutes:Quote[] = await getQoute(limit);
  let chars:Character[] = await getChars(limit);
  let movies:Movie[] = await getMovies(limit);
  for (let i = 0; i < qoutes.length; i++) {
    const char:Character = chars.find(char => char._id === qoutes[i].character)!;
    const movie:Movie = movies.find(movie => movie._id === qoutes[i].movie)!;
    qoutes[i].character = char.name //add char link somehow
    qoutes[i].wikiUrl = char.wikiUrl
    if (qoutes[i].character == "MINOR_CHARACTER") {
      qoutes[i].character = "Minor Character"
    }
    qoutes[i].movie = movie.name
  }
  return qoutes
}


export const getRandomQoutes = (qoutes:Quote[],n:number) => {
  /* NOTE TO SELF THERE IS A MINOR_CHARACTER object AND MAYBE UNIQUE DIALOG IN full array of gameQoutes */
  const shuffled = qoutes.sort(() => 0.5 - Math.random());
  let gameQuotes:gameQuote[] = [{
    quote: "",
    characterAnswers:[
      {name:"",correct:false},
      {name:"",correct:false},
      {name:"",correct:false}
  ],
    movieAnswers:[
    {title:"",correct:false},
    {title:"",correct:false},
    {title:"",correct:false},
]
  }]

  for (let i = 0; i < n; i++) {
  let uniqueAnwser = Math.floor(Math.random() * shuffled.length);

  let char1 = "";
  let char2 = "";
  let movie1 = "";
  let movie2 = "";

  let uniqueMovies = shuffled.filter(function(this: Set<string>,{movie}) {
    return !this.has(movie) && this.add(movie);
  }, new Set)

  let my2 = uniqueMovies.filter((e) => e.movie !== shuffled[uniqueAnwser].movie)

  let uniqueMoviesRandom = Math.floor(Math.random() * my2.length);

  movie1 = my2[uniqueMoviesRandom].movie

  let my4 = uniqueMovies.filter((e) => e.movie !== shuffled[uniqueAnwser].movie && e.movie !== movie1)

  let uniqueMoviesRandom2 = Math.floor(Math.random() * my4.length);

  movie2 = my4[uniqueMoviesRandom2].movie

  let uniqueChars = shuffled.filter(function(this: Set<string>,{character}) {
    return !this.has(character) && this.add(character);
  }, new Set)

  let my = uniqueChars.filter((e) => e.character !== shuffled[uniqueAnwser].character)

  let uniqueCharsRandom = Math.floor(Math.random() * my.length);

  char1 = my[uniqueCharsRandom].character

  let my3 = uniqueChars.filter((e) => e.character !== shuffled[uniqueAnwser].character && e.character !== char1)
  let uniqueCharsRandom2 = Math.floor(Math.random() * my3.length);

  char2 = my3[uniqueCharsRandom2].character

  let tempData:gameQuote = {
    quote: shuffled[uniqueAnwser].dialog,
    characterAnswers:[
      {name:shuffled[uniqueAnwser].character,correct:true},
      {name:char1,correct:false},
      {name:char2,correct:false}
    ],
    movieAnswers:[
      {title:shuffled[uniqueAnwser].movie,correct:true},
      {title:movie1,correct:false},
      {title:movie2,correct:false},
    ]
  }
  tempData.characterAnswers.sort(() => 0.5 - Math.random());
  tempData.movieAnswers.sort(() => 0.5 - Math.random());
  gameQuotes.push(tempData)
  }

  gameQuotes.shift()
  return gameQuotes;
}

