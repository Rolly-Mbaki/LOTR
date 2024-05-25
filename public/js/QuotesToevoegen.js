var jsonData = [];
        document.addEventListener('DOMContentLoaded', function() {
        var dataElement = document.getElementById('data');
        jsonData = JSON.parse(dataElement.textContent);

      });
      
      var icon2 = document.getElementById('dislikeBtn');
      var icon = document.getElementById('likeBtn');
      var audioIcon = document.getElementById('audioBtn');

      const openButton = document.querySelector("[data-open-modal]")
      const closeButton = document.querySelector("[data-close-modal]")
      const modal = document.querySelector("[data-modal]")
      
      const quizContainer = document.getElementsByClassName("quiz-container")
      const highScore = document.getElementById("highscore")
      const volumeIcon = document.getElementsByClassName("fa-volume-high")
      const modall = document.getElementsByClassName("modall")
      var audio = new Audio('../assets/Lord of the Rings_Sound of The Shire.mp3');
     
      window.onload = quizContainer[0].style.display="none"
      window.onload = volumeIcon[0].style.display="none"
      window.onload = highScore.style.display="none"

      const questionElement = document.getElementById("quote");
      const nextButton = document.getElementById("nextButton");
      const charAnswer = document.getElementById("options");
      const movieAnswer = document.getElementById("options1");
      const qouteNumber = document.getElementById("qouteNumber");

      const modal2 = document.querySelector("#modal2");
      const openModals = document.querySelectorAll('.open-button');
      const closeModal = document.querySelector('.close-button');

      let currentQuestionIndex = 0;
      let score = 0;
      let counter = 0;
      let charOptionClicked = false;
      let movieOptionClicked = false;

      
      const allMovieAnswers = document.getElementsByName("answerFilms");
      

      



      function like() {
        toevoegenFav()
        thumbsUp()
    }

    function thumbsUp() {
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon2.classList.remove('fas');
        icon2.classList.add('far');
      } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
      }
    }

    async function toevoegenFav() {
      // console.log(jsonData[counter])

      let favQuote = {quote:"", char:""}

      jsonData[counter].characterAnswers.forEach(element => {
        if (element.correct) {
          let quote = jsonData[counter].quote
          let char = jsonData[counter].characterAnswers[jsonData[counter].characterAnswers.indexOf(element)].name
          favQuote = {quote:quote, char: char}
        }
      });
      console.log(JSON.stringify(favQuote))
      try {
        const response = await fetch("/like", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(favQuote)
        })
        console.log(response.body)
        const result = await response.json();
        if (response.ok) {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Data inserted into mdb")
        } else {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Failed to insert data in mdb")
        }
      } catch (error) {
        console.log("Error: ", error)
      }
    }

    async function toevoegenBl(input) {
      // console.log(jsonData[counter])

      let blQuote = {quote:"", char:"", reason:""}

      jsonData[counter].characterAnswers.forEach(element => {
        if (element.correct) {
          let quote = jsonData[counter].quote
          let char = jsonData[counter].characterAnswers[jsonData[counter].characterAnswers.indexOf(element)].name
          let reason = input.value
          blQuote = {quote:quote, char: char, reason:reason}
        }
      });
      console.log(JSON.stringify(blQuote))
      try {
        const response = await fetch("/dislike", {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(blQuote)
        })
        const result = await response.json();
        console.log(response.body)
        if (response.ok) {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Data inserted into mdb")
        } else {
          retOp.innerHTML = `<b>${result.message}</b>`
          console.log("Failed to insert data in mdb")
        }
      } catch (error) {
        console.log("Error: ", error)
      }
    }

  function dislike() {
    
    if (icon2.classList.contains('far')) {
        icon2.classList.remove('far');
        icon2.classList.add('fas');
        icon.classList.remove('fas');
        icon.classList.add('far');
    } else {
        icon2.classList.remove('fas');
        icon2.classList.add('far');
    }
    openModals.forEach((openModal) => {
      modal2.showModal();    
})

closeModal.addEventListener('click', () =>{
  modal2.close();
})
};

  const form=document.getElementById("dislike");
const retOp = document.getElementById("retOp");

function submitFormReturn(event){
  modal2.close()
  const input = document.getElementById("myReason")
  console.log(input.value)
  toevoegenBl(input)
}
  
      
        

      closeButton.addEventListener("click",startQuiz);

      function IsMovieOptionClicked() {
        movieOptionClicked = true;
        enableButton()
      }
      function IsCharOptionClicked() {
        charOptionClicked = true;
        enableButton()
      }

      function enableButton() {
        if (charOptionClicked && movieOptionClicked) {
          nextButton.style.visibility="visible"
        }
      }