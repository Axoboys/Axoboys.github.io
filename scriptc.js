// --- IMPORT FIRESTORE ---
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- VARIABLES ---
let user = null;
let score = 0;
let prestigeCount = 0;
let buildings = [
  {name:"Petite maison", cost:10, cps:1, owned:0},
  {name:"Ferme à axolotls", cost:50, cps:5, owned:0},
  {name:"Aquarium géant", cost:200, cps:20, owned:0}
];
let prestigeBaseCost = 1000;

// --- DOM ---
const authDiv = document.getElementById("auth");
const gameDiv = document.getElementById("game");
const scoreSpan = document.getElementById("score");
const cpsSpan = document.getElementById("cps");
const prestigeSpan = document.getElementById("prestigeCount");
const prestigeCostSpan = document.getElementById("prestigeCost");
const shopDiv = document.getElementById("shop");
const leaderboardDiv = document.getElementById("leaderboard");

// --- TWITCH LOGIN ---
window.loginWithTwitch = function() {
  const clientId = "xc30os22iswrk4f8swoj0ne6hcxpls"; // <-- ton Client ID Twitch
  const redirectUri = encodeURIComponent("https://axoinformation.netlify.app/clicker");
  const scope = "user:read:email";
  window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
}

// --- Récupérer token ---
function getTwitchToken() {
  const hash = window.location.hash;
  if(hash.includes("access_token")){
    const params = new URLSearchParams(hash.replace("#","?"));
    return params.get("access_token");
  }
  return null;
}

// --- Récupérer infos utilisateur ---
async function fetchTwitchUser(token){
  const clientId = "xc30os22iswrk4f8swoj0ne6hcxpls"; 
  const res = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Client-Id": clientId
    }
  });
  const data = await res.json();
  return data.data[0];
}

// --- START GAME ---
async function startGameTwitch() {
  const token = getTwitchToken();
  if(!token) return;

  const userData = await fetchTwitchUser(token);
  user = userData;

  authDiv.style.display="none";
  gameDiv.style.display="block";

  // Charger ou créer joueur
  const docRef = doc(db,"players",user.id);
  const docSnap = await getDoc(docRef);
  if(!docSnap.exists()){
    await setDoc(docRef,{
      username: user.display_name,
      score:0,
      prestige:0,
      buildings: buildings,
      lastConnection: Date.now()
    });
  } else {
    const data = docSnap.data();
    score = data.score || 0;
    prestigeCount = data.prestige || 0;
    buildings = data.buildings || buildings;

    // Gain hors-ligne
    const offlineTime = (Date.now() - data.lastConnection)/1000;
    const cpsTotal = buildings.reduce((a,b)=>a+b.cps*b.owned,0)*(1+prestigeCount*0.5);
    score += cpsTotal*offlineTime;
  }

  updateUI();
  updateLeaderboard();
  setInterval(autoCPS,1000);
  setInterval(updateLeaderboard,5000);
}

// --- CLICKER ---
window.clicker = function(){
  score += 1*(1+prestigeCount*0.5);
  save();
  updateUI();
}

// --- ACHETER BATIMENT ---
window.buyBuilding = function(i){
  const b = buildings[i];
  if(score >= b.cost){
    score -= b.cost;
    b.owned++;
    b.cost = Math.floor(b.cost*1.5);
    save();
    updateUI();
  }
}

// --- PRESTIGE ---
window.prestige = function(){
  if(score >= prestigeBaseCost){
    prestigeCount++;
    score = 0;
    buildings.forEach(b=>b.owned=0);
    buildings.forEach(b=>b.cost=Math.floor(b.cost/1.2));
    prestigeBaseCost = Math.floor(prestigeBaseCost*2);
    save();
    updateUI();
    alert("Prestige activé ! 🚀");
  } else alert(`Il te faut au moins ${prestigeBaseCost} AxoCoins pour Prestige !`);
}

// --- CPS AUTOMATIQUE ---
function autoCPS(){
  const cpsTotal = buildings.reduce((a,b)=>a+b.cps*b.owned,0)*(1+prestigeCount*0.5);
  score += cpsTotal;
  save();
  updateUI();
}

// --- SAUVEGARDE ---
async function save(){
  if(!user) return;
  const docRef = doc(db,"players",user.id);
  await setDoc(docRef,{
    score: Math.floor(score),
    prestige: prestigeCount,
    buildings: buildings,
    lastConnection: Date.now(),
    username: user.display_name
  });
}

// --- MISE À JOUR UI ---
function updateUI(){
  scoreSpan.textContent = Math.floor(score);
  const cpsTotal = buildings.reduce((a,b)=>a+b.cps*b.owned,0)*(1+prestigeCount*0.5);
  cpsSpan.textContent = cpsTotal;
  prestigeSpan.textContent = prestigeCount;
  prestigeCostSpan.textContent = prestigeBaseCost;

  // Boutique
  shopDiv.innerHTML="";
  buildings.forEach((b,i)=>{
    const btn = document.createElement("button");
    btn.textContent = `${b.name} (${b.owned}) - Coût : ${b.cost} AxoCoins - +${b.cps} cps`;
    btn.disabled = score < b.cost;
    btn.onclick = ()=>buyBuilding(i);
    shopDiv.appendChild(btn);
  });
}

// --- LEADERBOARD ---
async function updateLeaderboard(){
  const q = query(collection(db,"players"), orderBy("score","desc"), limit(5));
  const querySnap = await getDocs(q);
  leaderboardDiv.innerHTML="";
  querySnap.forEach(doc=>{
    const data = doc.data();
    const p = document.createElement("p");
    p.textContent = `${data.username} : ${Math.floor(data.score)} AxoCoins - Prestiges : ${data.prestige}`;
    leaderboardDiv.appendChild(p);
  });
}

// --- INIT ---
window.addEventListener("load", startGameTwitch);