// import { polishWords } from "./words-polish.js";
// import { englishWords } from "./words-english.js";
// import { polishProverbs } from "./proverbs-Polish.js";

// BUTTONS
const buttonstart = document.getElementById("buttonstart");
const buttonrDrawPolishWord = document.getElementById("buttonrDrawPolishWord");
const buttonrDrawPolishProverb = document.getElementById(
  "buttonrDrawPolishProverb"
);
const buttonrDrawEnglishWord = document.getElementById(
  "buttonrDrawEnglishWord"
);
const buttonrestart = document.querySelectorAll("#buttonrestart");

// LANDING
const landingStart = document.getElementById("landingStart");
const landingTypeWord = document.getElementById("landingTypeWord");
const landingGameOver = document.getElementById("landingGameOver");

// ELEMENTS
const input = document.getElementById("userword");
const hiddenWord = document.getElementById("hiddenword");

// MAIN GAME SCREEN COMPONENTS
const game = document.getElementById("game");
const hangman = document.getElementById("hangman");
const keyboard = document.getElementById("keyboard");

// STATS
const goodGuessesBox = document.getElementById("goodGuessesBox");
const badGuessesBox = document.getElementById("badGuessesBox");
const allGuessesBox = document.getElementById("allGuessesBox");

// END GAME SCREEN
const endGameText = document.getElementById("endGameText");
const endGameWord = document.getElementById("endGameWord");
const statsTextBox = document.getElementById("statsTextBox");

// VARIABLES
let goodGuesses = 0;
let badGuesses = 0;
let allGuesses = 0;
let word = [];
let hidden = [];
let keys = [];
var alphabet = [
  "A",
  "Ą",
  "B",
  "C",
  "Ć",
  "D",
  "E",
  "Ę",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "Ł",
  "M",
  "N",
  "Ń",
  "O",
  "Ó",
  "P",
  "Q",
  "R",
  "S",
  "Ś",
  "T",
  "U",
  "W",
  "V",
  "X",
  "Y",
  "Z",
  "Ż",
  "Ź",
];

// WELCOME PAGE

landingStart.addEventListener("transitionend", (event) => {
  if (event.target == landingStart) landingStart.style.display = "none";
}),
  { once: true };

buttonstart.addEventListener("click", () => {
  landingStart.classList.add("hide");
});

// INPUT WORD AND WAIT FOR ENTER

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    word = input.value;
    start();
  }
});

// DRAW WORD

buttonrDrawPolishWord.addEventListener("click", () => {
  word = polishWords[randomWord(polishWords.length)];
  start();
});

buttonrDrawPolishProverb.addEventListener("click", () => {
  word = polishProverbs[randomWord(polishProverbs.length)];
  start();
});

buttonrDrawEnglishWord.addEventListener("click", () => {
  word = englishWords[randomWord(englishWords.length)];
  start();
});

// RANDOM FUNCTION

function randomWord(numberOfWordsInFile) {
  return Math.floor(Math.random() * numberOfWordsInFile);
}

// MAIN GAME FUNCTION

function start() {
  hideLanding();
  hideWord();
  generateKeyboard();
  addListenersForKeys();
  updateHiddenWord();
}

// HIDE LANDING

function hideLanding() {
  landingTypeWord.addEventListener("transitionend", (event) => {
    if (event.target == landingTypeWord) landingTypeWord.style.display = "none";
  }),
    { once: true };

  landingTypeWord.classList.add("hide");
}

// HIDE WORD

function hideWord() {
  word = word.toUpperCase().split("");
  for (i = 0; i < word.length; i++) {
    if (word[i] == " ") hidden.push(" ");
    else hidden.push(`&#8209;`);
  }
}

// GENERATE KEYBOARD

function generateKeyboard() {
  keyboard.replaceChildren(); //Removing keyboard, if already exist
  game.removeAttribute("style");
  for (i = 0; i < alphabet.length; i++) {
    let keyButton = document.createElement("button");
    keyButton.classList.add("key");
    keyButton.setAttribute("id", i);
    keyButton.textContent = alphabet[i];
    keyboard.appendChild(keyButton);
  }
}

// ADD LISTENER FOR ALL KEYBOARD KEYS

function addListenersForKeys() {
  keys = document.querySelectorAll(".key");
  keys.forEach((key) => key.addEventListener("click", checkCompatibility));
}

// CHECK IF THE LITERAL IS IN THE WORD?

function checkCompatibility(event) {
  let guessed = false;

  word.forEach((string, index) => {
    if (string == event.target.textContent) {
      event.target.classList.add("found");
      hidden[index] = string;
      guessed = true;
    }
  });

  if (guessed) {
    goodGuesses++;
  }

  if (!guessed) {
    badGuesses++;
    drawHangman();
  }

  disableClickedButton(event);
  updateHiddenWord();
  updateAttempts();
  checkIfYouWonOrLost();

  // for (i = 0; i < word.length; i++) {
  //   if (word[i] == event.target.textContent) {
  //     event.target.classList.add("found");
  //     hidden[i] = word[i];
  //     guessed = true;
  //   }
  // }

  // if (!guessed) {
  //   badGuesses++;
  //   drawHangman();
  // }
}

// DISABLE CLICKED KEYBOARD KEY AND REMOVE LISTENER FOR IT

function disableClickedButton(event) {
  event.target.classList.add("disabled");
  event.target.removeEventListener("click", checkCompatibility);
}

// UPDATE HIDDEN WORD

function updateHiddenWord() {
  hiddenWord.innerHTML = hidden.join("");
}

// UPDATE ALL GUESSES

function updateAttempts() {
  allGuesses++;
  goodGuessesBox.textContent = goodGuesses;
  badGuessesBox.textContent = badGuesses;
  allGuessesBox.textContent = allGuesses;
}

// DRAW HANGMAN

function drawHangman() {
  let hangmanPart = hangman.querySelector(`.part[part="${badGuesses}"]`);
  hangmanPart.style.stroke = "black";
}

// CHECK, IF YOU WON OR LOST?

function checkIfYouWonOrLost() {
  if (hidden.join("") == word.join("") || badGuesses >= 11) {
    landingGameOver.removeAttribute("style");
    endGameWord.textContent = `${word.join("")}`;
    statsTextBox.innerHTML = `
    <p> In total you hit ${allGuesses} times: </p>
    <p> Right: ${goodGuesses} (${Math.round(
      (goodGuesses / allGuesses) * 100
    )}%) times, </p>
    <p> Wrong: ${badGuesses} (${Math.round(
      (badGuesses / allGuesses) * 100
    )}%) times </p>`;
  }

  if (hidden.join("") == word.join(""))
    return (endGameText.innerHTML =
      "<h3>CONGRATULATIONS, You won!</h2><p>The word you were looking for was:</p>");

  if (badGuesses >= 11)
    return (endGameText.innerHTML =
      "<h3>SORRY, You Lost!</h3><p>The word you were looking for was:</p>");
}

// RESTART

buttonrestart.forEach((button) =>
  button.addEventListener("click", () => {
    window.location = window.location;
  })
);

// |
// |
// |
// INNE - NIEPOTRZEBNE
// |
// |
// |

// String.prototype.podmienZnak = function (miejsce, znak) {
//   if (miejsce > this.length - 1) return;
//   return this.substr(0, miejsce) + znak + this.substr(miejsce + 1);
// };

// napis = "word word";

// console.log(napis.podmienZnak(0, "p"));

// DODAĆ DZWIĘK DO GRY
