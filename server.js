// server.js
const express = require('express');
const fetch = require('node-fetch'); // <- Node fetch pour CommonJS
const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURATION =====
const CLIENT_ID = "avsk85m2zeocgs8r693nv42nk2pjs5";
const CLIENT_SECRET = "brg0euo6i3lfdj0b9fvc62kdhev0xw";
const CHANNEL = "hestiacraft";

// ===== VARIABLES TOKEN =====
let ACCESS_TOKEN = "";
let TOKEN_EXPIRY = 0;

// ===== SERVIR LE FRONT-END =====
app.use(express.static('public')); // Mets ton HTML, CSS, JS dans /public

// ===== FONCTION POUR OBTENIR UN TOKEN =====
async function getToken() {
    const now = Date.now();
    if (ACCESS_TOKEN && TOKEN_EXPIRY > now) return ACCESS_TOKEN;

    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    });

    const data = await res.json();
    ACCESS_TOKEN = data.access_token;
    TOKEN_EXPIRY = now + (data.expires_in - 60) * 1000; // expire 1 min avant
    return ACCESS_TOKEN;
}

// ===== ENDPOINT /api/live =====
app.get('/api/live', async (req, res) => {
    try {
        const token = await getToken();

        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${CHANNEL}`, {
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        console.log("Réponse Twitch API :", JSON.stringify(data, null, 2));

        res.json({ live: data.data && data.data.length > 0 });
    } catch (err) {
        console.error("Erreur /api/live :", err);
        res.json({ live: false });
    }
});

// ===== LANCER LE SERVEUR =====
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));