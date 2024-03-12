function dropdownMenu() {
    var x = document.getElementById("topnav");
    if (x.style.display === "flex") {
      x.style.display = "none";
    } else {
      x.style.display = "flex";
    }
  }