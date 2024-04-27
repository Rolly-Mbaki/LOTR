import { Quote } from "../../types/quizTypes";

export const getQoute = async () => {
    /* const headers = { 'Authorization': `Bearer ${apiKey}` 'YfOQe6Lm8jLfWV1C9EWq' };
    const response = await fetch("https://the-one-api.dev/v2/quote", {headers});
    data = await response.json()
    console.log(data) */
    const apiKey = 'YfOQe6Lm8jLfWV1C9EWq';
    const apiUrl = 'https://the-one-api.dev/v2/quote?limit=10000';
    const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })
    const responeDoc = await response.json()
    const quotes:Quote[] = responeDoc.docs
    return quotes;
}

export const getRandomQoutes = (qoutes:Quote[],n:number) => {
  const shuffled = qoutes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
