const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const container = document.querySelector(".draw");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);

  // запускаем таймер только один раз
  if (!errorTimeout) {
    errorTimeout = setTimeout(() => {
      show404();
    }, 5000);
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = "#e9e9e9";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseleave", () => {
  drawing = false;
});

let errorTimeout = null;

function show404() {
  window.location.href = "/404.html";
}
