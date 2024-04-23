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
      const openButton = document.querySelector("[data-open-modal]")
      const closeButton = document.querySelector("[data-close-modal]")
      const modal = document.querySelector("[data-modal]")
      const quizContainer = document.getElementsByClassName("quiz-container")
      const volumeIcon = document.getElementsByClassName("fa-volume-high")
      const modall = document.getElementsByClassName("modall")
      var audio = new Audio('../assets/The Fellowship of the Ring Soundtrack-07-A Knife in the Dark.mp3');
     
        window.onload = quizContainer[0].style.display="none"
        window.onload = volumeIcon[0].style.display="none"
        
        

      closeButton.addEventListener("click", () => {
        quizContainer[0].style.display="block"
        volumeIcon[0].style.display="block"
        modall[0].style.display="none"
        
        
        audio.play();
        modal.close();
        audio.loop=true;
      })

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
        return audio.paused ? audio.play() : audio.pause();
      };

      
      