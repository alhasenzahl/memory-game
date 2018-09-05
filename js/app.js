//Selecting the deck element from the DOM
const cardDeck = document.querySelector('.deck');

//Selecting the restart icon and the move counter elements from the DOM
const restart = document.querySelector('.restart');
const moveCounter = document.querySelector('.moves');

//Selected elements and created variables for the star functions
const starsList = document.querySelector('.stars');
const stars = starsList.children;
const secondStar = stars[1];
const thirdStar = stars[2];

let starCounter = 3;

//Creating empty arrays that will store cards throughout the game
let openCards = [];
let matchedCards = [];
let clickedCards = [];

//Array with the icon classnames stored in it to shuffle the cards with
let cards = ['fa-anchor', 'fa-anchor',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bolt', 'fa-bolt',
            'fa-bomb', 'fa-bomb',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-diamond', 'fa-diamond',
            'fa-bicycle', 'fa-bicycle'
];

//Selecting elements from the DOM for the game winning modal message that appears at the end of the game
const modal = document.querySelector('.modal-background');
const messageTitle = document.querySelector('.modal-main_title');
const messageCopy = document.querySelector('.modal-main_paragraph');
const quitButton = document.querySelector('.quit-game')
const playAgainButton = document.querySelector('.play-again');

//Selected elements for the timer
let time = 0;
let timerId;
let firstClick = false;

//Function that shuffles the cards on the page - from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Function that generates the HTML for the cards to be loaded into the DOM
function makeCards(card) {
    return `<li class="card"><i class="fa ${card}"></i></li>`;
}

//Function that shuffles the cards and places the HTML inside the DOM
function generateCards() {
    let cardHTML = shuffle(cards).map(function(card) {
        return makeCards(card);
    });

    cardDeck.innerHTML = cardHTML.join('');
}

generateCards();

//Have to call the cards element here, because they don't exist until after the generateCards function is called
const allCards = document.querySelectorAll('.card');

//Function that counts the number of clicks it takes to match the cards
function clickCounter() {
    moveCounter.innerText = clickedCards.length;

    return clickedCards.length;
}

//Function that removes stars after a certain number of moves during the game
function starCount() {

    if (clickedCards.length === 21) {
        starCounter -= 1;
        thirdStar.remove();
    } else if (clickedCards.length === 41) {
        starCounter -= 1;
        secondStar.remove();
    } 
}

//Function that resets the stars to 3 after the game is won or is reset
function resetStars() {
    if (clickedCards.length >= 21 && clickedCards.length < 41) {
        starsList.appendChild(thirdStar);
        starCounter = 3;
    } else if (clickedCards.length >= 41) {
        starsList.appendChild(secondStar);
        starsList.appendChild(thirdStar);
        starCounter = 3;
    } else {
        starCounter = 3;
    }
}

//Function that checks to see if the two flipped cards match each other
function matchCards() {
    if (openCards.length === 2) {
        setTimeout(function() {

            let openOne = openCards[0].children[0].className;
            let openTwo = openCards[1].children[0].className;

            openCards.forEach(function(card) {

                if (openOne === openTwo) {
                    card.classList.remove('open');
                    card.classList.add('match');
                    matchedCards.push(card);

                    wonGame();
                } else {
                    card.classList.remove('open', 'show');
                }
            });

            openCards = [];
        }, 1000);
    }
}

//Function that reloads the page after each game
function refreshPage() {
    window.location.href = window.location.href;
}

//Function that initiates the play again button on the modal
const playAgain = function() {
    matchedCards.forEach(function(card) {
        card.classList.remove('match', 'show');
    });
    
    resetStars();
    moveCounter.innerText = 0;
    clickedCards = [];
    matchedCards = [];
    refreshPage();
}

//Function that quits the game and hides the modal
const quitGame = function() {
    hideModal();
}

//Function that runs when all of the cards are matched successfully to signify winning the game
function wonGame() {
    if (matchedCards.length === 16) {
        stopTimer();
        setTimeout(function() {
            showModal();

            playAgainButton.addEventListener('click', playAgain);
            quitButton.addEventListener('click', quitGame);
        }, 2500);
    }
}

//Function that restarts the current game when the restart icon is clicked
const restartGame = function() {
    openCards.forEach(function(card) {
        card.classList.remove('open', 'show');
    });

    matchedCards.forEach(function(card) {
        card.classList.remove('match', 'show');
    });

    resetStars();
    clickedCards = [];
    matchedCards = [];
    openCards = [];
    moveCounter.innerText = 0;
    time = 0;
    refreshPage();
}

restart.addEventListener('click', restartGame);

//Function to make modal appear on screen
function showModal() {
    modal.style.display = 'block';
    const totalTime = document.getElementById('stop-watch').innerHTML; 

    if (starCounter === 3) {
        messageTitle.innerText = `Sweet! You rocked it!`;
        messageCopy.innerText = `You finished the game in ${totalTime} with ${starCounter} stars and matched all the cards in ${clickedCards.length} clicks!`;
    } else if (starCounter === 2) {
        messageTitle.innerText = `Hey, you did it!  Nice job!`;
        messageCopy.innerText = `You finished the game in ${totalTime} with ${starCounter} stars and matched all the cards in ${clickedCards.length} clicks!`;
    } else {
        messageTitle.innerText = `You get an A for Effort!`;
        messageCopy.innerText = `You finished the game in ${totalTime} with ${starCounter} star and matched all the cards in ${clickedCards.length} clicks!`;
    }
}

//Function to make the modal disappear from view
function hideModal() {
    modal.style.display = 'none';
}

//Function that creates the timer for the game
function gameTimer() {
    timerId = setInterval(function() {
        time += 1;
        displayTimer();
    }, 1000);
}

//Function that connects/displays the timer to the DOM
function displayTimer() {
    const timer = document.getElementById('stop-watch');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        timer.innerHTML = `${minutes}:0${seconds}`;
    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

//Function that stops the clock when the game is over
function stopTimer() {
    clearInterval(timerId);
}

//Function to initiate the timer on the first click
function initTimer() {
    if (!firstClick) {
        gameTimer();
    }

    firstClick = true;
}

//Function that flips the cards over when they are clicked
function flipCards() {
    allCards.forEach(function(card) {
        card.addEventListener('click', function(e) { 

            if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
                initTimer();
                openCards.push(card);

                if (openCards.length <= 2) {
                    card.classList.add('open', 'show');
                    clickedCards.push(card);
                    matchCards();
                    clickCounter();
                    starCount();
                }
            }
        });
    });
}

flipCards();

