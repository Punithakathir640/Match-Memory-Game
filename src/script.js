document.addEventListener('DOMContentLoaded', () => {
  const messageElement = document.getElementById('message');
  const gameContainer = document.getElementById('game-container');
  const resetButton = document.getElementById('reset-button');

  let deck = [];
  let flippedCards = [];
  let moves = 0;
  let gameLocked = false;

  //const emojis = ['🥝', '🎓', '🌋', '🍷', ' 🏊🏻', '🦺', '🧗', '🐄'];
  const emojis = ['🥝', '🎓', '🌋', '🍷', ' 🏊🏻', '🦺', '🧗', '🐄', '🐱', '🍕', '🍩', '🌈', '⚽', '🎮', '🎵'];

  // Load sound effects
  const flipSound = new Audio('flip1.mp3.mp3');
  flipSound.volume = 1.0;
  const errorSound = new Audio('error.mp3');
  flipSound.volume = 1.0;
  const successSound = new Audio('success1.mp3.wav');
  flipSound.volume = 1.0;

  function createDeck() {
      deck = [...emojis, ...emojis];
      shuffleArray(deck);
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

  function createBoard() {
      gameContainer.innerHTML = '';
      deck.forEach((emoji, index) => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.dataset.cardIndex = index;

          const cardInner = document.createElement('div');
          cardInner.classList.add('card-inner');

          const cardFront = document.createElement('div');
          cardFront.classList.add('card-front');

          const cardBack = document.createElement('div');
          cardBack.classList.add('card-back');
          cardBack.textContent = emoji;

          cardInner.appendChild(cardFront);
          cardInner.appendChild(cardBack);
          card.appendChild(cardInner);
          card.addEventListener('click', flipCard);
          gameContainer.appendChild(card);
      });
  }

  function updateMessage(msg) {
      messageElement.textContent = msg;
  }

  function flipCard() {
      if (gameLocked || this.classList.contains('flipped') || flippedCards.length >= 2) return;

      flipSound.play();  // Play flip sound when a card is flipped

      this.classList.add('flipped');
      flippedCards.push(this);

      if (flippedCards.length === 2) {
          moves++;
          gameLocked = true;
          const [card1, card2] = flippedCards;
          const emoji1 = deck[card1.dataset.cardIndex];
          const emoji2 = deck[card2.dataset.cardIndex];

          if (emoji1 === emoji2) {
              successSound.play();  // Play success sound for a match
              card1.classList.add('matched');
              card2.classList.add('matched');
              flippedCards = [];
              gameLocked = false;
              updateMessage('Hooray🥳Match found!');
              checkForWin();
          } else {
              errorSound.play();  // Play error sound for no match
              updateMessage('No match!oops');
              setTimeout(() => {
                  card1.classList.remove('flipped');
                  card2.classList.remove('flipped');
                  flippedCards = [];
                  gameLocked = false;
                  updateMessage('');
              }, 1000);
          }
      }
  }

  function checkForWin() {
      const matchedCount = document.querySelectorAll('.card.matched').length;
      if (matchedCount === deck.length) {
          updateMessage('You Win!');
          gameOverAnimation();
      }
  }

  function resetGame() {
      gameLocked = true;
      flippedCards = [];
      moves = 0;
      createDeck();
      createBoard();
      updateMessage('Good luck!');
  }

  function gameOverAnimation() {
      gsap.to(gameContainer, {
          duration: 2,
          rotation: 360,
          scale: 1.2,
          onComplete: () => {
              gsap.to(gameContainer, { rotation: 0, scale: 1 });
          }
      });
  }

  // Initial setup
  createDeck();
  createBoard();

  // Typing animation
  const welcomeMessage = "Welcome to Memory Match Card Game Animation!";
  let i = 0;
  const intervalId = setInterval(() => {
      messageElement.textContent += welcomeMessage[i];
      i++;
      if (i === welcomeMessage.length) {
          clearInterval(intervalId);
          setTimeout(() => {
              messageElement.textContent = '';
          }, 2000);
      }
  }, 100);

  resetButton.addEventListener('click', resetGame);
});