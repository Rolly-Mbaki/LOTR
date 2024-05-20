var jsonData = [];
      document.addEventListener('DOMContentLoaded', function() {
        var dataElement = document.getElementById('data');
        jsonData = JSON.parse(dataElement.textContent);

      });

      const openButton = document.querySelector("[data-open-modal]")
      const closeButton = document.querySelector("[data-close-modal]")
      const modal = document.querySelector("[data-modal]")
      const highScore = document.getElementById("highscore")
      const quizContainer = document.getElementsByClassName("quiz-container")
      const volumeIcon = document.getElementsByClassName("fa-volume-high")
      const modall = document.getElementsByClassName("modall")
      var audio = new Audio('../assets/The Fellowship of the Ring Soundtrack-07-A Knife in the Dark.mp3');

      
     
        window.onload = quizContainer[0].style.display="none"
        window.onload = volumeIcon[0].style.display="none"
        window.onload = highScore.style.display="none"

        const questionElement = document.getElementById("quote");
        const nextButton = document.getElementById("nextButton");
        const charAnswer = document.getElementById("options");
        const movieAnswer = document.getElementById("options1");
        const qouteNumber = document.getElementById("qouteNumber");

        let currentQuestionIndex = 0;
        let score = 0;
        let counter = 0;

var icon2 = document.getElementById('dislikeBtn');
      var icon = document.getElementById('likeBtn');
      var audioIcon = document.getElementById('audioBtn');
      function like() {
        
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon2.classList.remove('fas');
        icon2.classList.add('far');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }}

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
  }
      
        

      closeButton.addEventListener("click",startQuiz)
        
      function startQuiz() {
        quizContainer[0].style.display="block"
        volumeIcon[0].style.display="block"
        modall[0].style.display="none"
        
        
        audio.play();

        audio.loop=true;
        showQuestion(jsonData[counter]);
        
      }

      function showQuestion(qoutes) {

        nextButton.disabled = true
        questionElement.innerHTML = qoutes.quote;
        qouteNumber.innerHTML = counter+1
        const charHtmlString = qoutes.characterAnswers.map((qoute,index) => {
          return `<div class="form-check option">
          <input onclick="nextButton.disabled = false" class="form-check-input" type="radio" name="answerChar" id="option${index}" value="${qoute.name}">
          <label class="form-check-label" for="option${index}">${qoute.name}</label>
        </div>`
        }).join('');
        charAnswer.innerHTML = charHtmlString;

        const movieHtmlString = qoutes.movieAnswers.map((qoute,index) => {
          return `<div class="form-check option">
          <input onclick="nextButton.disabled = false" class="form-check-input" type="radio" name="answerFilms" id="option${index+3}" value="${qoute.title}">
          <label class="form-check-label" for="option${index+3}">${qoute.title}</label>
        </div>`
        }).join('');
        movieAnswer.innerHTML = movieHtmlString;
      }

      function toggleAudio() {
        if (audioBtn.classList.contains('fa-volume-high')) {
          audioBtn.classList.remove('fa-volume-high');
          audioBtn.classList.add('fa-volume-xmark');
    } else {
      audioBtn.classList.remove('fa-volume-xmark');
      audioBtn.classList.add('fa-volume-high');
    }
      }

      function togglePlay() {
        toggleAudio()
        audio.muted = !audio.muted;
      };

      function increaseCount() {
        let correctCharAwnser = jsonData[counter].characterAnswers.filter((e) => e.correct == true)[0].name;
        let correctMovieAwnser = jsonData[counter].movieAnswers.filter((e) => e.correct == true)[0].title;
        
        for (let radio of document.getElementsByName("answerChar")) {
          if (radio.checked && correctCharAwnser !== radio.value) {
            showHighScore()
          } else if (radio.checked) {
          }
          
        }
        for (let radio of document.getElementsByName("answerFilms")) {
          if (radio.checked && correctMovieAwnser !== radio.value) {
            showHighScore()
          } else if (radio.checked) {
          }
          /* ERROR WORKS IF ONE IS RIGHT NEEDS FIX */
        }
        if (counter >= jsonData.length -1) {
          counter = jsonData.length - 1;
          showHighScore()
      } else {
          score++
          counter++
      }
        showQuestion(jsonData[counter])
     }

     function showHighScore() {
      audio.muted = !audio.muted;
      highScore.style.display="flex"
      quizContainer[0].style.display="none"
      volumeIcon[0].style.display="none"
      
      /* document.getElementsByClassName("container-fluid")[0].style.display="none" */
      document.getElementById("currentScore").innerHTML = "Current score: "+score
     }

      
      