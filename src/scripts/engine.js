const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        timerId: null,
        countDownTimerId: null,
        gameVelocity: 1000,
        hitPosition: null,
        result: 0,
        currentTime: 60,
        lives: 5,
    },
};

document.getElementById("start-button").addEventListener("click", function () {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    initialize();
});

function resetGame() {
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 5;

    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.lives;

    clearInterval(state.values.timerId);
    clearInterval(state.values.countDownTimerId);

    state.values.countDownTimerId = setInterval(countDown, 1000);
    moveEnemy();
}

function playSound() {
    let audio = new Audio("./src/audios/hit.m4a");
    audio.volume = 0.1;
    audio.play();
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0 || state.values.lives <= 0) {
        clearInterval(state.values.countDownTimerId);
        clearInterval(state.values.timerId);

        alert("Game Over! Your Result is: " + state.values.result);
        resetGame();
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

let canLoseLife = true;

function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound();
                canLoseLife = true;
            } else if (canLoseLife && state.values.hitPosition !== null) {
                    state.values.lives--;
                    state.view.lives.textContent = state.values.lives;
                    canLoseLife = false;

                    setTimeout(() => {
                        canLoseLife = true;
                    }, 500);
            }
        });
    });
}

function initialize() {
    resetGame();
    moveEnemy();
    addListenerHitbox();
}

initialize();
