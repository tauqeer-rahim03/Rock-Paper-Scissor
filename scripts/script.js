const choices = document.querySelectorAll(".choice");
const resultDiv = document.getElementById("result");
const userScoreSpan = document.getElementById("user-score");
const computerScoreSpan = document.getElementById("computer-score");
const userMoveDiv = document.getElementById("user-move");
const computerMoveDiv = document.getElementById("computer-move");
const roundDisplay = document.getElementById("round");
const startButton = document.getElementById("start-button");
const roundsInput = document.getElementById("rounds-input");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");
const finalOverlay = document.getElementById("final-message");
const finalText = finalOverlay.querySelector(".message");
const playAgainBtn = document.getElementById("play-again");
const resetBtn = document.getElementById("reset-btn");
const startSound = document.getElementById("start-sound");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const endSound = document.getElementById("end-sound");

const icons = {
    rock: "fa-hand-rock",
    paper: "fa-hand-paper",
    scissors: "fa-hand-scissors",
};
const messages = {
    win: [
        "🎉 Victory! You outplayed the AI!",
        "🏆 Champion! You've mastered Rock-Paper-Scissors!",
        "🔥 Well done! You crushed the competition!",
    ],
    lose: [
        "💻 The AI triumphs! Better luck next time.",
        "🤖 Defeated by machine logic!",
        "👾 AI wins this round. Challenge it again?",
    ],
    draw: [
        "⚖️ It's a draw! So evenly matched!",
        "🤝 A perfect tie! Try again to break it.",
        "😮 Dead even! That was close.",
    ],
};

let userScore = 0,
    computerScore = 0,
    round = 1,
    maxRounds = 5;

const getComputerChoice = () =>
    Object.keys(icons)[Math.floor(Math.random() * 3)];
const getResult = (user, comp) =>
    user === comp
        ? "draw"
        : (user === "rock" && comp === "scissors") ||
          (user === "paper" && comp === "rock") ||
          (user === "scissors" && comp === "paper")
        ? "win"
        : "lose";

const updateMoveDisplay = (element, label, move) => {
    element.innerHTML = `<i class="fas ${icons[move] || "fa-question"}"></i>`;
};

const updateScores = (result) => {
    userScoreSpan.classList.remove("highlight");
    computerScoreSpan.classList.remove("highlight");
    if (result === "win") {
        userScore++;
        userScoreSpan.classList.add("highlight");
    } else if (result === "lose") {
        computerScore++;
        computerScoreSpan.classList.add("highlight");
    }
    userScoreSpan.textContent = `You: ${userScore}`;
    computerScoreSpan.textContent = `AI: ${computerScore}`;
};

const displayResult = (result, user, comp) => {
    resultDiv.textContent =
        result === "draw"
            ? "It's a draw!"
            : result === "win"
            ? `You win! ${user} beats ${comp}`
            : `You lose! ${comp} beats ${user}`;
    updateMoveDisplay(userMoveDiv, "You", user);
    updateMoveDisplay(computerMoveDiv, "AI", comp);
};

const disableChoices = () => {
    choices.forEach((c) => c.classList.add("disabled"));
};

const enableChoices = () => {
    choices.forEach((c) => c.classList.remove("disabled"));
};

const playGame = (userChoice) => {
    resultDiv.textContent = "";
    updateMoveDisplay(userMoveDiv, "You", userChoice);
    updateMoveDisplay(computerMoveDiv, "AI", null);
    disableChoices();

    setTimeout(() => {
        const computerChoice = getComputerChoice();
        const result = getResult(userChoice, computerChoice);
        if (round < maxRounds) {
            if (result === "win") winSound.play();
            else if (result === "lose") loseSound.play();
        }

        if (result === "win") winSound.play();
        else if (result === "lose") loseSound.play();

        if (round === maxRounds) {
            finalOverlay.style.display = "flex";
            endSound.play();

            let finalResult;
            if (userScore > computerScore) finalResult = "win";
            else if (userScore < computerScore) finalResult = "lose";
            else finalResult = "draw";

            finalText.textContent =
                messages[finalResult][
                    Math.floor(Math.random() * messages[finalResult].length)
                ];
        } else {
            round++;
            roundDisplay.textContent = `Round: ${round}`;
            enableChoices();
        }

        updateScores(result);
        displayResult(result, userChoice, computerChoice);
    }, 1000);

    if (round === maxRounds - 1) {
        setTimeout(() => {
            document.getElementById("final-round-message").style.visibility =
                "visible";
        }, 1000);
    }

    if (round > maxRounds) return;
};

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        if (!choice.classList.contains("disabled")) {
            playGame(choice.dataset.choice);
        }
    });
});

startButton.addEventListener("click", () => {
    maxRounds = parseInt(roundsInput.value);
    if (isNaN(maxRounds) || maxRounds < 1) maxRounds = 5;
    userScore = 0;
    computerScore = 0;
    round = 1;
    userScoreSpan.textContent = "You: 0";
    computerScoreSpan.textContent = "AI: 0";
    roundDisplay.textContent = "Round: 1";
    resultDiv.textContent = "";
    updateMoveDisplay(userMoveDiv, "You", null);
    updateMoveDisplay(computerMoveDiv, "AI", null);
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    enableChoices();
    finalOverlay.style.display = "none";
    startSound.play();
    document.getElementById("final-round-message").style.visibility = "hidden";
});

playAgainBtn.addEventListener("click", () => location.reload());

resetBtn.addEventListener("click", () => {
    userScore = 0;
    computerScore = 0;
    round = 1;
    userScoreSpan.textContent = "You: 0";
    if (userScoreSpan.classList.contains("highlight")) {
        userScoreSpan.classList.remove("highlight");
    }
    if (computerScoreSpan.classList.contains("highlight")) {
        computerScoreSpan.classList.remove("highlight");
    }
    computerScoreSpan.textContent = "AI: 0";
    roundDisplay.textContent = "Round: 1";
    resultDiv.textContent = "";
    updateMoveDisplay(userMoveDiv, "You", null);
    updateMoveDisplay(computerMoveDiv, "AI", null);
    enableChoices();
    finalOverlay.style.display = "none";
    document.getElementById("final-round-message").style.visibility = "hidden";
});
