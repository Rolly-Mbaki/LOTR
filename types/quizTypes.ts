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
    characterAnswers:[
        {name:string,correct:boolean},
        {name:string,correct:boolean},
        {name:string,correct:boolean}
    ]
    movieAnswers:[
        {title:string,correct:boolean},
        {title:string,correct:boolean},
        {title:string,correct:boolean},
    ]
}
