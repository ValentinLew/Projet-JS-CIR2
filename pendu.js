const words = ["abandon", "abeille", "abricot", "absence", "accident", "adresse", "amour", "animal", "aventure", "banane", "bateau",
    "bijou", "blouson", "boisson", "bouteille", "boulangerie", "cascade", "cerise", "champignon", "chanson", "chaussure",
    "chocolat", "cigarette", "citrouille", "clavier", "coccinelle", "coffre", "colline", "confiture", "contrebasse",
    "couteau", "couvercle", "coquillage", "croissant", "danse", "dauphin", "dentiste", "domino", "drapeau", "éclair",
    "économie", "écriture", "électricité", "éléphant", "entonnoir", "éolienne", "éponge", "escargot", "escalier",
    "fantôme", "fanfare", "fenêtre", "feuille", "flamme", "fléchette", "fourchette", "framboise", "frisson", "fromage",
    "gaufrette", "giraffe", "glace", "gomme", "goudron", "guitare", "harmonica", "hérisson", "horloge", "impression",
    "infirmière", "jambon", "jardin", "jonquille", "journal", "lampe", "libellule", "limonade", "lit", "loutre", "magicien",
    "manège", "marmotte", "médaille", "montgolfière", "moustache", "moutarde", "musicien", "navire", "nébuleuse", "néon",
    "nuage", "océan", "orange", "orchestre", "ours", "parapluie", "pelle", "piano", "piscine", "pomme", "pont", "portefeuille",
    "prison", "puzzle", "quiche", "radar", "rameau", "renard", "requin", "robot", "salade", "savon", "sculpture", "sirop",
    "souffleur", "souris", "tambour", "tambourin", "tempête", "toboggan", "tournevis", "trompette", "tunnel", "ukulele",
    "valise", "vampire", "vélo", "ventilateur", "vitrine", "volcan", "wagon", "xylophone", "zèbre", "zodiac"];


const word = words[Math.floor(Math.random() * words.length)];
let guessed = Array(word.length).fill("_");
let lives = 10;  // Correspond maintenant aux 10 étapes du pendu
let usedLetters = new Set();

const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const livesDisplay = document.getElementById("lives");
const message = document.getElementById("message");
const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");

// Affichage initial
wordDisplay.textContent = guessed.join(" ").toUpperCase();
livesDisplay.textContent = `Vies : ${lives}`;

// Création du clavier virtuel
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
alphabet.split("").forEach(letter => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.classList.add("key");
    button.addEventListener("click", () => checkLetter(letter, button));
    keyboard.appendChild(button);
});

// Fonction pour dessiner le pendu en 10 étapes
function drawHangman(step) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";

    switch (step) {
        case 1: ctx.moveTo(20, 240); ctx.lineTo(180, 240); break; // Base
        case 2: ctx.moveTo(50, 240); ctx.lineTo(50, 20); break; // Poteau
        case 3: ctx.moveTo(50, 20); ctx.lineTo(130, 20); break; // Traverse
        case 4: ctx.moveTo(130, 20); ctx.lineTo(130, 50); break; // Corde
        case 5: ctx.arc(130, 70, 20, 0, Math.PI * 2); break; // Tête
        case 6: ctx.moveTo(130, 90); ctx.lineTo(130, 150); break; // Corps
        case 7: ctx.moveTo(130, 100); ctx.lineTo(100, 130); break; // Bras gauche
        case 8: ctx.moveTo(130, 100); ctx.lineTo(160, 130); break; // Bras droit
        case 9: ctx.moveTo(130, 150); ctx.lineTo(110, 200); break; // Jambe gauche
        case 10: ctx.moveTo(130, 150); ctx.lineTo(150, 200); break; // Jambe droite
    }
    ctx.stroke();
}

// Vérifie la lettre choisie
function checkLetter(letter, button = null) {
    if (lives <= 0) return; // Empêche d'interagir après la défaite

    const upperLetter = letter.toUpperCase();

    // Vérifie si la lettre a déjà été utilisée
    if (usedLetters.has(upperLetter)) return;
    usedLetters.add(upperLetter);

    if (button) button.disabled = true;
    else {
        const buttons = document.querySelectorAll("#keyboard button");
        const buttonToDisable = [...buttons].find(btn => btn.textContent === upperLetter);
        if (buttonToDisable) buttonToDisable.disabled = true;
    }

    if (word.toUpperCase().includes(upperLetter)) {
        word.split("").forEach((char, index) => {
            if (char.toUpperCase() === upperLetter) guessed[index] = char.toUpperCase();
        });
    } else {
        if (lives > 0) {
            drawHangman(10 - lives + 1); // On dessine la partie suivante
            lives--;
        }
    }

    wordDisplay.textContent = guessed.join(" ");
    livesDisplay.textContent = `Vies : ${lives}`;

    // Conditions de fin
    if (!guessed.includes("_")) {
        message.textContent = "🎉 Bravo, tu as gagné !";
        disableKeyboard();
    }
    if (lives === 0) {
        message.textContent = `😢 Perdu ! Le mot était "${word.toUpperCase()}"`;
        disableKeyboard();
    }
}

// Désactive tous les boutons et bloque les entrées clavier
function disableKeyboard() {
    document.querySelectorAll("#keyboard button").forEach(button => button.disabled = true);
    document.removeEventListener("keydown", keydownHandler); // Désactive le clavier physique
}

// Fonction pour gérer les touches physiques
function keydownHandler(event) {
    const letter = event.key.toUpperCase();
    if (alphabet.includes(letter)) {
        checkLetter(letter);
    }
}

// Ajoute l'écouteur d'événements pour le clavier physique
document.addEventListener("keydown", keydownHandler);
