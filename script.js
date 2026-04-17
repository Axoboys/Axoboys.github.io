const status = document.getElementById("status");
const player = new Twitch.Player("twitch-player", {
    width: 850,
    height: 480,
    channel: "hestiacraft",
    parent: ["axoboysinformation.netlify.app"]
});

// Fonction pour mettre à jour le statut
function updateStatus(isLive) {
    if (isLive) {
        status.className = "status live";
        status.innerText = "🔴 HestiaCraft est en live !";
    } else {
        status.className = "status offline";
        status.innerText = "⚫ HestiaCraft est hors ligne";
    }
}

// Vérifie l'état du stream via l'API Node
async function checkLive() {
    try {
        const res = await fetch('/api/live');
        const data = await res.json();
        updateStatus(data.live);
    } catch (err) {
        console.error(err);
        status.innerText = "Impossible de vérifier le live";
        status.className = "status offline";
    }
}

// Vérifie dès le chargement et toutes les 30 secondes
checkLive();
setInterval(checkLive, 30000);