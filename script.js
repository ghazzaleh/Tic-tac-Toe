const board = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");
const userScoreDisplay = document.getElementById("user-score");
const computerScoreDisplay = document.getElementById("computer-score");

let userScore = 0; // امتیاز کاربر
let computerScore = 0; // امتیاز کامپیوتر
let boardState = ["", "", "", "", "", "", "", "", ""]; // وضعیت تخته
let currentPlayer = "X"; // نوبت فعلی

// تابع برای ایجاد تخته بازی
function createBoard() {
  board.innerHTML = ""; // پاک کردن تخته
  boardState = ["", "", "", "", "", "", "", "", ""]; // بازنشانی وضعیت تخته
  currentPlayer = "X"; // تعیین نوبت کاربر
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", userMove); // افزودن رویداد کلیک
    board.appendChild(cell); // افزودن خانه به تخته
  }
}

// تابع برای حرکت کاربر
function userMove(event) {
  const index = event.target.dataset.index; // گرفتن ایندکس خانه کلیک شده
  if (boardState[index] === "" && currentPlayer === "X") {
    // اگر خانه خالی باشد
    boardState[index] = "X"; // قرار دادن 'X' در خانه
    event.target.textContent = "X"; // نمایش 'X' در خانه
    if (checkWin("X")) {
      // بررسی برنده شدن کاربر
      alert("You win!"); // پیام برنده شدن
      userScore++; // افزایش امتیاز کاربر
      updateScore(); // به‌روز رسانی امتیاز
      return;
    }
    // بررسی مساوی بودن
    if (boardState.every((cell) => cell !== "")) {
      alert("It's a draw!"); // پیام مساوی شدن
      updateScore(); // به‌روز رسانی امتیاز
      return;
    }
    currentPlayer = "O"; // نوبت به کامپیوتر
    computerMove(); // حرکت کامپیوتر
  }
}

// تابع برای حرکت کامپیوتر با سطح متوسط
function computerMove() {
  const availableMoves = boardState
    .map((val, index) => (val === "" ? index : null))
    .filter((val) => val !== null);

  // ابتدا بررسی حرکت برنده برای کامپیوتر
  for (let move of availableMoves) {
    boardState[move] = "O";
    if (checkWin("O")) {
      // اگر کامپیوتر برنده شود
      document.querySelector(`.cell[data-index='${move}']`).textContent = "O"; // نمایش 'O' در خانه
      computerScore++; // افزایش امتیاز کامپیوتر
      alert("Computer wins!"); // پیام برنده شدن کامپیوتر
      updateScore(); // به‌روز رسانی امتیاز
      return;
    }
    boardState[move] = ""; // بازنشانی خانه
  }

  // بررسی حرکت مسدود کننده برای کاربر
  for (let move of availableMoves) {
    boardState[move] = "X";
    if (checkWin("X")) {
      // اگر کاربر برنده شود
      document.querySelector(`.cell[data-index='${move}']`).textContent = "O"; // نمایش 'O' در خانه
      boardState[move] = "O"; // قرار دادن 'O' در خانه
      currentPlayer = "X"; // نوبت به کاربر
      return;
    }
    boardState[move] = ""; // بازنشانی خانه
  }

  // حرکت تصادفی اگر هیچ یک از حالات بالا وجود نداشته باشد
  const randomMove =
    availableMoves[Math.floor(Math.random() * availableMoves.length)];
  boardState[randomMove] = "O";
  document.querySelector(`.cell[data-index='${randomMove}']`).textContent = "O";

  if (checkWin("O")) {
    // بررسی برنده شدن کامپیوتر
    alert("Computer wins!"); // پیام برنده شدن کامپیوتر
    computerScore++; // افزایش امتیاز کامپیوتر
    updateScore(); // به‌روز رسانی امتیاز
    return;
  }

  // بررسی مساوی بودن
  if (boardState.every((cell) => cell !== "")) {
    alert("It's a draw!"); // پیام مساوی شدن
    updateScore(); // به‌روز رسانی امتیاز
    return;
  }

  currentPlayer = "X"; // نوبت به کاربر
}

// تابع برای بررسی برنده شدن
function checkWin(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // سطرها
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // ستون‌ها
    [0, 4, 8],
    [2, 4, 6], // قطرها
  ];

  return winPatterns.some((pattern) => {
    return pattern.every((index) => boardState[index] === player);
  });
}

// تابع برای به‌روز رسانی امتیاز
function updateScore() {
  userScoreDisplay.textContent = `User Score: ${userScore}`;
  computerScoreDisplay.textContent = `Computer Score: ${computerScore}`;
  createBoard(); // ایجاد مجدد تخته بازی
}

// افزودن رویداد کلیک برای دکمه ریست
resetButton.addEventListener("click", createBoard);
createBoard(); // ایجاد تخته بازی در ابتدا
