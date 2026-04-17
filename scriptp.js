const searchBox = document.getElementById("searchBox");
const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");

let secretActivated = false;
let acidActivated = false;


// Ouvrir / fermer la barre
searchIcon.addEventListener("click", () => {

  searchBox.classList.toggle("active");
  searchInput.focus();

  if (!searchBox.classList.contains("active")) {
    searchInput.value = "";
    filterBots("");
  }

});


// Recherche dynamique + Easter Eggs
searchInput.addEventListener("keyup", () => {

  const value = searchInput.value;
  const valueLower = value.toLowerCase();

  filterBots(value);

  // Secret bot
  if (value === "qpjttpotufwf" && !secretActivated) {
    secretActivated = true;
    activateSecretBot();
  }

  // Easter egg ACIDIC
  if (valueLower === "acidic" && !acidActivated) {
    acidActivated = true;
    activateAcidic();
  }

});


function filterBots(value) {

  const searchValue = value.toLowerCase();

  cards.forEach(card => {

    const text = card.innerText.toLowerCase();

    if (text.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });

}



function activateSecretBot() {

  const grid = document.querySelector(".grid");

  const secretCard = document.createElement("div");
  secretCard.classList.add("card", "secret-card");

  secretCard.innerHTML = `
    <img src="img/BUG.jpg" alt="Secret Bot">
    <a href="bug.html">S̷̓̅̑̐̐...Secret Bot</a>
  `;

  grid.appendChild(secretCard);

}



// EASTER EGG ACIDIC
function activateAcidic() {

  // vague acide sur toute la page
  document.body.classList.add("acid-wave");

  setTimeout(() => {
    document.body.classList.remove("acid-wave");
  }, 2000);


  // explosion nucléaire
  const nuke = document.createElement("div");
  nuke.classList.add("nuke");

  document.body.appendChild(nuke);

  setTimeout(() => {
    nuke.remove();
  }, 1200);



  // afficher tous les bots
  cards.forEach(card => {
    card.style.display = "block";
  });


  // trouver AciBot
  const acibot = document.getElementById("acibot");

  if (acibot) {

    acibot.classList.add("acibot-highlight");

    acibot.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

}