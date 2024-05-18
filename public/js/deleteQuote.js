const favQuotesData = document.getElementById("data").textContent;

const favQuotes = JSON.parse(favQuotesData);
console.log(favQuotes)

async function deleteQuote(index) {
    let quote = favQuotes[index]

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