const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector("span#score-points"),
  },
  cardSprites: {
    avatar: document.querySelector("img#card-image"),
    name: document.querySelector("p#card-name"),
    type: document.querySelector("p#card-type"),
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  fieldCards: {
    player: document.querySelector("img#player-field-card"),
    computer: document.querySelector("img#computer-field-card"),
  },
  button: document.querySelector("button#next-duel"),
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    typeof: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    typeof: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    typeof: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function removeAllCardsImages() {
  state.playerSides.computerBox
    .querySelectorAll("img")
    .forEach((img) => img.remove());
  state.playerSides.player1Box
    .querySelectorAll("img")
    .forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResult = "draw";
  let playerCard = cardData[playerCardId];
  if (playerCard.WinOf.includes(computerCardId)) {
    state.score.playerScore++;
    duelResult = "win";
    await playAudio(duelResult);
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    state.score.computerScore++;
    duelResult = "lose";
    await playAudio(duelResult);
  }

  return duelResult;
}

async function resetDuel() {
  state.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  main();
}

async function drawCardsField(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsField(cardId, computerCardId);

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function showHiddenCardFieldsImages(value) {
  if (value) {
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.style.display = "block";
  } else if (!value) {
    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";
  }
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.textContent = "";
  state.cardSprites.type.textContent = "";
}

async function drawButton(text) {
  state.button.textContent = text.toUpperCase();
  state.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.textContent = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawSelectCard(id) {
  state.cardSprites.avatar.src = cardData[id].img;
  state.cardSprites.name.textContent = cardData[id].name;
  state.cardSprites.type.textContent = "Attribute: " + cardData[id].typeof;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const radomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(radomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function playAudio(status, type = "wav") {
  const audio = new Audio(`./src/assets/audios/${status}.${type}`);
  audio.play();
}

function main() {
  const bgm = document.getElementById("bgm");
  bgm.play();
  showHiddenCardFieldsImages(false);
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);
}

main();
