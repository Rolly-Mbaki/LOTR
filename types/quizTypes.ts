export interface Quote {
    _id:string;
    dialog:string;
    movie:string;
    character:string;
    id:string
}

export interface Character {
    _id:     string;
    name:    string;
    wikiUrl: string;
}

export interface Movie {
    _id:                        string;
    name:                       string;
}

export interface gameQuote {
    quote:string;
    characterAnswer:string;
    characterWrong1:string;
    characterWrong2:string;
    movieAnswer:string;
    movieWrong1:string;
    movieWrong2:string;
}
