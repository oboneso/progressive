const cards = document.querySelectorAll('.memory-card')

let hasFlippedCard = false;
let lockBoard = false;
let firstCard;
let secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
  } else {

    secondCard = this;
    checkForMatch();
  };
}

function checkForMatch() {
  // Do cards match?
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    disableCards();

  } else {
    unflipCards();
  }
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  const player1Cards = document.getElementById('player1-cards')

  player1Cards.appendChild(firstCard)
  player1Cards.appendChild(secondCard)
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard()
  }, 1000);
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  })
})();
cards.forEach(card => card.addEventListener('click', flipCard))