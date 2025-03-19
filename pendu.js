// hangman.js

const words = ["chat", "pomme", "ordinateur", "javascript", "montagne"];
const word = words[Math.floor(Math.random() * words.length)];
let guessed = Array(word.length).fill("_");
let lives = 6;

const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const livesDisplay = document.getElementById("lives");
const message = document.getElementById("message");
const hangmanDrawing = document.getElementById("hangman-drawing");

// Affiche le mot caché en majuscules
wordDisplay.textContent = guessed.join(" ").toUpperCase();

// Crée le clavier virtuel avec des lettres majuscules
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
alphabet.split("").forEach(letter => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.addEventListener("click", () => checkLetter(letter, button));
    button.classList.add("key");
    keyboard.appendChild(button);
});

// Vérifie la lettre choisie
function checkLetter(letter, button) {
    button.disabled = true; // Désactive le bouton après clic

    if (word.toUpperCase().includes(letter)) {
        word.split("").forEach((char, index) => {
            if (char.toUpperCase() === letter) guessed[index] = char.toUpperCase();
        });
    } else {
        lives--;
        hangmanDrawing.style.backgroundImage = `url('hangman${6 - lives}.png')`;
    }

    // Met à jour l'affichage
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

// Désactive tous les boutons du clavier
function disableKeyboard() {
    document.querySelectorAll("#keyboard button").forEach(button => button.disabled = true);
}