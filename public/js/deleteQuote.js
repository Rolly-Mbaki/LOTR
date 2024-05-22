const quotesData = document.getElementById("data").textContent;

const quotes = JSON.parse(quotesData);
let currentQuote = {quote:"", character:"", reason:""}
// console.log(favQuotes)

async function deleteFavQuote(index) {
    let quote = quotes[index]

    try {
        const response = await fetch("/deleteFavQuote", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(quote)
        })
        console.log(response.body)
        if (response.ok) {
          console.log("Data deleted from mdb")
        } else {
          
          console.log("Failed to delete data from mdb")
        }
        window.location.reload()
      } catch (error) {
        console.log("Error: ", error)
      }
}

async function deleteBlQuote(index) {
  let quote = quotes[index]
  console.log(quote)
  try {
      const response = await fetch("/deleteBlQuote", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(quote)
      })
      console.log(response.body)
      if (response.ok) {
        console.log("Data deleted from mdb")
      } else {
        
        console.log("Failed to delete data from mdb")
      }
      window.location.reload()
    } catch (error) {
      console.log("Error: ", error)
    }
}

const input = document.getElementById("myReason")
function submitFormReturn(event){
  event.preventDefault()
  // console.log(input.value)
  updateBlQuote()
}

function getCurrentQuote(index) {
  let quote = quotes[index]
  currentQuote = quote
  console.log(quote)
}

async function updateBlQuote() {
  let quote = currentQuote

  let updatedQuote = {quote:quote.quote, character:quote.character, reason:input.value}

  console.log(quote)
  console.log(updatedQuote)
  try {
    const response = await fetch("/updateBlQuote", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updatedQuote)
    })
    console.log(response.body)
    if (response.ok) {
      console.log("Data deleted from mdb")
      window.location.reload()
    } else {
      console.log("Failed to delete data from mdb")
    }
  } catch (error) {
    console.log("Error: ", error)
  }
}
