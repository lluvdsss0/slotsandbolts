const parentDiv1 = document.querySelector(".spamFiles");

// Селектор конкретных элементов внутри, по которым кликаем
const clickableElement1 = parentDiv1.querySelector("#krestSpamFolders");

clickableElement1.addEventListener("click", () => {
  parentDiv1.style.visibility = "hidden";

  setTimeout(() => {
    parentDiv1.style.visibility = "visible";
  }, 2000);
});

const parentDiv2 = document.querySelector(".spamPhoto");

// Селектор конкретных элементов внутри, по которым кликаем
const clickableElement2 = parentDiv2.querySelector("#krestSpamPhoto");

clickableElement2.addEventListener("click", () => {
  parentDiv2.style.visibility = "hidden";

  setTimeout(() => {
    parentDiv2.style.visibility = "visible";
  }, 2000);
});

const parentDiv3 = document.querySelector(".spamCode");

// Селектор конкретных элементов внутри, по которым кликаем
const clickableElement3 = parentDiv3.querySelector("#krestSpamCode");

clickableElement3.addEventListener("click", () => {
  parentDiv3.style.visibility = "hidden";

  setTimeout(() => {
    parentDiv3.style.visibility = "visible";
  }, 2000);
});

const spamCodeDiv = document.querySelector(".spamCode");
const dragHandle = spamCodeDiv.querySelector(".spamCodeMenu");
const closeBtn = spamCodeDiv.querySelector("#krestSpamCode");

let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

dragHandle.addEventListener("mousedown", (e) => {
  if (e.target === closeBtn) return; // крестик не мешает перетаскиванию
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  dragHandle.style.cursor = "grabbing";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;

  // Сдвигаем через transform, чтобы поток не ломался
  spamCodeDiv.style.transform = `translate(${currentX}px, ${currentY}px)`;
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    dragHandle.style.cursor = "grab";
  }
});

// Крестик закрывает див
closeBtn.addEventListener("click", () => {
  spamCodeDiv.style.visibility = "hidden";
  setTimeout(() => {
    spamCodeDiv.style.visibility = "visible";
  }, 2000);
});

// window.addEventListener(
//   "click",
//   () => {
//     const music = document.getElementById("backgroundMusic");
//     music.play().catch((err) => {
//       console.log("Ошибка воспроизведения:", err);
//     });
//   },
//   { once: true }
// ); // срабатывает только один раз
