import { Quote,Character,Movie,gameQuote } from "../../types/quizTypes";

const apiKey = 'YfOQe6Lm8jLfWV1C9EWq';

export const getQoute = async () => {
    
    const response2 = await fetch('https://the-one-api.dev/v2/quote', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const getLengthOfApi = await response2.json();
    
    const apiUrl = `https://the-one-api.dev/v2/quote?limit=${getLengthOfApi.total}`;

    const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
    const responeDoc = await response.json();
    const quotes:Quote[] = responeDoc.docs
    return quotes;
}

export const getChars = async () => {
    
  
  const response2 = await fetch('https://the-one-api.dev/v2/character', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const getLengthOfApi = await response2.json();
  
  const apiUrl = `https://the-one-api.dev/v2/character?limit=${getLengthOfApi.total}`;

  const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
  const responeDoc = await response.json();
  const chars:Character[] = responeDoc.docs
  return chars;
}

export const getMovies = async () => {
    
  
  const response2 = await fetch('https://the-one-api.dev/v2/movie', {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  const getLengthOfApi = await response2.json();
  
  const apiUrl = `https://the-one-api.dev/v2/movie?limit=${getLengthOfApi.total}`;

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
  let qoutes:Quote[] = await getQoute();
  let chars:Character[] = await getChars();
  let movies:Movie[] = await getMovies();

  for (let i = 0; i < qoutes.length; i++) {
    const char:Character = chars.find(char => char._id === qoutes[i].character)!;
    const movie:Movie = movies.find(movie => movie._id === qoutes[i].movie)!;
    qoutes[i].character = char.name
    qoutes[i].movie = movie.name
  }
  return qoutes
}

export const qouteForGame = () => {

}

export const getRandomQoutes = (qoutes:Quote[],n:number) => {
  /* NOTE TO SELF THERE IS A MINOR_CHARACTER object */
  const shuffled = qoutes.sort(() => 0.5 - Math.random());
  
   const gameQuotes:gameQuote[] = [{
     quote: shuffled[0].dialog,
     characterAnswer: shuffled[0].character,
     characterWrong1: "",
     characterWrong2: "",
     movieAnswer: shuffled[0].movie,
     movieWrong1: "",
     movieWrong2: ""
   }]
  
  /* for (let i = 0; i < shuffled.length; i++) {
    gameQuotes[i].quote = shuffled[i].dialog
    gameQuotes[i].characterAnswer = shuffled[i].character
    gameQuotes[i].movieAnswer = shuffled[i].movie

    let filteredQoutes = shuffled.filter((shuffled) => {
      return shuffled.movie !== gameQuotes[i].movieAnswer && shuffled.character !== gameQuotes[i].characterAnswer
    })

    gameQuotes[i].characterWrong1 = filteredQoutes[0].character
    gameQuotes[i].movieWrong1 = filteredQoutes[0].movie

    let filteredQoutes2 = filteredQoutes.filter((shuffled) => {
      return shuffled.movie !== gameQuotes[i].movieAnswer && shuffled.movie !== filteredQoutes[0].movie 
      && shuffled.character !== filteredQoutes[0].character && shuffled.character !== gameQuotes[i].characterAnswer
    })

    gameQuotes[i].characterWrong2 = filteredQoutes2[0].character
    gameQuotes[i].movieWrong2 = filteredQoutes2[0].movie

    

  } */
  
  /* for (let i = 0; i < 10; i++) {
    if (shuffled[i].character !== undefined) {
      
      let filteredQoutes = shuffled.filter((shuffled) => {
        return shuffled.movie !== gameQuotes[i].movieAnswer || shuffled.character !== gameQuotes[i].characterAnswer
      })
      let randomQuoteNumber:number = Math.floor(Math.random() * filteredQoutes.length+1) 

      let char1 = filteredQoutes[randomQuoteNumber].character
      let movie1 = filteredQoutes[randomQuoteNumber].movie

      let filteredQoutes2 = filteredQoutes.filter((shuffled) => {
        return shuffled.movie !== gameQuotes[i].movieAnswer || shuffled.movie !== movie1
        && shuffled.character !== char1 || shuffled.character !== gameQuotes[i].characterAnswer
      })
      let tempData:gameQuote = {
        quote: shuffled[i].dialog,
        characterAnswer: shuffled[i].character,
        characterWrong1: char1,
        characterWrong2: filteredQoutes2[0].character,
        movieAnswer: shuffled[i].movie,
        movieWrong1: movie1,
        movieWrong2: filteredQoutes2[0].movie
      }
      gameQuotes.push(tempData)
    }
    
    
  }
  console.log(gameQuotes) */

  /* gameQuotes[0].quote = shuffled[0].dialog
    gameQuotes[0].characterAnswer = shuffled[0].character
    gameQuotes[0].movieAnswer = shuffled[0].movie

    let filteredQoutes = shuffled.filter((shuffled) => {
      return shuffled.movie !== gameQuotes[0].movieAnswer && shuffled.character !== gameQuotes[0].characterAnswer
    })

    let randomQuoteNumber:number = Math.floor(Math.random() * filteredQoutes.length+1)

    gameQuotes[0].characterWrong1 = filteredQoutes[randomQuoteNumber].character
    gameQuotes[0].movieWrong1 = filteredQoutes[randomQuoteNumber].movie

    let filteredQoutes2 = filteredQoutes.filter((shuffled) => {
      return shuffled.movie !== gameQuotes[0].movieAnswer && shuffled.movie !== gameQuotes[0].movieWrong1
      && shuffled.character !== gameQuotes[0].characterWrong1 && shuffled.character !== gameQuotes[0].characterAnswer
    })

    gameQuotes[0].characterWrong2 = filteredQoutes2[0].character
    gameQuotes[0].movieWrong2 = filteredQoutes2[0].movie

    
 */



/*WIP!!!!!!!!!!!*/

function areObjectsEqual(obj1: Quote, obj2: gameQuote): boolean {
  return obj1.character === obj2.characterAnswer || obj1.movie === obj2.movieAnswer;
}


const filteredQoutesMovies: Quote[] = shuffled.filter(parent => {

  const correspondingChild = gameQuotes.find(gameQuotes => gameQuotes.movieAnswer === parent.movie);


  return !correspondingChild || !areObjectsEqual(parent, correspondingChild);
});



const filteredQoutesChars: Quote[] = filteredQoutesMovies.filter(parent => {

  const correspondingChild = gameQuotes.find(gameQuotes => gameQuotes.characterAnswer=== parent.character);


  return !correspondingChild || !areObjectsEqual(parent, correspondingChild);
});


/*WIP!!!!!!!!!!!*/

let randomQuoteNumber:number = Math.floor(Math.random() * filteredQoutesChars.length+1)

for (let i = 0; i < 20; i++) {
  console.log(filteredQoutesMovies[i].movie)
}
console.log("h")
console.log(gameQuotes[0].movieAnswer);
console.log("h")
  
  return shuffled.slice(0, n);
}
