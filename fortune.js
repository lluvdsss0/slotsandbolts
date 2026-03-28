const app = document.getElementById("app");

// В начале файла создаём массив дивов
const targetDivs = [
  document.getElementById("priceFortune1"),
  document.getElementById("priceFortune2"),
  document.getElementById("priceFortune3"),
  document.getElementById("priceFortune4")
];

function checkAllTargetsFilled() {
  return targetDivs.every((div) => div.children.length > 0);
}

// ⚡ здесь добавляем обработчик клика
window.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("fortuneButton");

  button.addEventListener("click", () => {
    if (checkAllTargetsFilled()) {
      alert(
        "Т@к д@р#ат$! Пр*х@д* к #@м и з@бе^и св@й в&игр&ш! #ы т$т! 3.1415nm9we26535y:2.718281q8284"
      );
      resetGame(); // 🔥 сброс после закрытия alert
    } else {
      spin();
    }
  });
});

let stats = {
  МОЩНОСТЬ: 0,
  УНИКАЛЬНОСТЬ: 0,
  АУРА: 0,
  СОВРЕМЕННОСТЬ: 0,
  АБСУРД: 0,
  УДАЧА: 0
};

renderStats();

// ⚡ функция рандомизации

function renderStats() {
  const statsDiv = document.getElementById("statsDisplay");
  if (statsDiv) {
    statsDiv.innerHTML = Object.entries(stats)
      .map(([k, v]) => `${k}: ${v}`)
      .join("<br>");
  }
}
function randomizeStats() {
  for (let key in stats) {
    stats[key] = Math.floor(Math.random() * 101); // 0-100
  }

  const statsDiv = document.getElementById("statsDisplay");
  if (statsDiv) {
    statsDiv.innerHTML = Object.entries(stats)
      .map(([k, v]) => `${k}: ${v}`)
      .join("<br>");
  }
}
function resetGame() {
  // очищаем все targetDivs
  targetDivs.forEach((div) => {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  });

  // сбрасываем индекс для следующего элемента
  nextTargetIndex = 0;

  // сбрасываем spinning и stats
  spinning = false;
  randomizeStats();

  // возвращаем текст кнопки
  const button = document.getElementById("fortuneButton");
  if (button) {
    button.textContent = "КРУТИТЬ";
    button.disabled = false; // если отключали крутить
  }
}

app.innerHTML = `
  <div class="reels">
    <div class="reel"><div class="strip" id="r0"></div></div>
    <div class="reel"><div class="strip" id="r1"></div></div>
    <div class="reel"><div class="strip" id="r2"></div></div>
  </div>
`;

const strips = [
  document.getElementById("r0"),
  document.getElementById("r1"),
  document.getElementById("r2")
];

const SHAPES = [
  { name: "krest", svg: `<img src="svg/krestFortune.svg">` },
  { name: "provoda", svg: `<img src="svg/provoda.svg">` },
  { name: "wheel", svg: `<img src="svg/wheel.svg">` },
  { name: "glass", svg: `<img src="svg/glass.svg">` }
];

function fillStrip(strip, count = 40) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "item";
    const rand = Math.floor(Math.random() * SHAPES.length);
    el.innerHTML = SHAPES[rand].svg;
    strip.appendChild(el);
  }
}
strips.forEach((strip) => fillStrip(strip));

let offsets = [0, 0, 0];
let spinning = false;
const directions = [1, -1, 1];

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getCenterItems(strip) {
  const reelRect = strip.parentElement.getBoundingClientRect();
  const reelCenterY = reelRect.top + reelRect.height / 2;

  const threshold = 100;
  const items = Array.from(strip.children);
  return items
    .filter((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      return Math.abs(itemCenter - reelCenterY) < threshold;
    })
    .slice(0, 3);
}

// Подмена центра на один символ, без увеличения
function setCenterRow(strip, shapeIdx) {
  const centerItems = getCenterItems(strip);
  centerItems.forEach((item) => {
    item.innerHTML = SHAPES[shapeIdx].svg;
    item.style.transform = "scale(1)";
  });
  return centerItems; // возвращаем, чтобы сохранить ссылки
}

function spin() {
  if (spinning) return;
  spinning = true;

  const resultIdx = Math.floor(Math.random() * SHAPES.length);
  const durations = [2000, 2500, 3000];
  const initialOffsets = [...offsets];

  let finishedCount = 0;
  let centerItemsRefs = []; // сохраняем ссылки на центральные элементы

  strips.forEach((strip, i) => {
    const items = strip.children;
    const firstItemHeight = items[0].offsetHeight;
    const start = performance.now();

    for (let item of items) {
      const rand = Math.floor(Math.random() * SHAPES.length);
      item.innerHTML = SHAPES[rand].svg;
      item.style.transform = "scale(1)";
    }

    function animateReel(time) {
      const t = time - start;
      if (t < durations[i]) {
        const progress = t / durations[i];
        const ease = easeInOutCubic(progress);
        const totalMove = firstItemHeight * items.length;
        offsets[i] = initialOffsets[i] + totalMove * ease * directions[i];

        while (offsets[i] > firstItemHeight) {
          strip.appendChild(items[0]);
          offsets[i] -= firstItemHeight;
        }
        while (offsets[i] < -firstItemHeight) {
          strip.insertBefore(items[items.length - 1], items[0]);
          offsets[i] += firstItemHeight;
        }

        strip.style.transform = `translateY(${offsets[i]}px)`;
        requestAnimationFrame(animateReel);
      } else {
        offsets[i] = 0;
        strip.style.transform = `translateY(0px)`;

        const centerItems = setCenterRow(strip, resultIdx);
        centerItemsRefs[i] = centerItems[0]; // сохраняем первый (главный) элемент

        finishedCount++;

        if (finishedCount === strips.length) {
          const rectangle = document.getElementById("winRectangle");
          rectangle.style.transition = "background-color 0.2s ease-out";
          rectangle.style.backgroundColor = "rgba(240, 240, 240, 0.9)";

          setTimeout(() => {
            rectangle.style.backgroundColor = "rgba(255, 215, 0, 0)";
          }, 250);

          // все барабаны остановились — увеличиваем и потом уменьшаем
          increaseThenShrinkCenter(centerItemsRefs, resultIdx);
        }
      }
    }

    requestAnimationFrame(animateReel);
  });
}

// Увеличение центральных элементов и плавное уменьшение
function increaseThenShrinkCenter(centerItems, shapeIdx) {
  // плавное увеличение
  centerItems.forEach((item) => {
    if (item) {
      item.style.transition = "transform 0.5s ease-in-out";
      item.style.transform = "scale(1.2)";
      item.style.zIndex = "10";
    }
  });

  // после увеличения удерживаем 0.5 сек, затем уменьшаем обратно
  setTimeout(() => {
    centerItems.forEach((item) => {
      if (item) {
        item.style.transform = "scale(1)";
      }
    });

    // запускаем merge после уменьшения
    setTimeout(() => mergeAnimation(centerItems, shapeIdx), 600);
  }, 600);
}

let nextTargetIndex = 0;

async function mergeAnimation(centerItems, idx) {
  if (!centerItems[0]) return;

  const clone = centerItems[0].cloneNode(true);
  document.body.appendChild(clone);

  const rect = centerItems[0].getBoundingClientRect();

  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.transition = "all 0.5s ease-in-out";
  clone.style.zIndex = "1000";

  const targetDiv = targetDivs[nextTargetIndex];
  nextTargetIndex = (nextTargetIndex + 1) % targetDivs.length;

  const targetRect = targetDiv.getBoundingClientRect();

  const offsetY = (targetRect.height - rect.height) / 2 - 20;
  const offsetX = (targetRect.width - rect.width) / 2 + 15;

  requestAnimationFrame(() => {
    clone.style.left = `${targetRect.left + offsetX}px`;
    clone.style.top = `${targetRect.top + offsetY}px`;
    clone.style.transform = "scale(0.8)";
  });

  await sleep(500);

  // вставляем в targetDiv
  clone.style.transition = "transform 0.3s ease-in-out";
  clone.style.position = "static";
  clone.style.left = "";
  clone.style.top = "";
  clone.style.zIndex = "";
  clone.style.transform = "scale(1)";
  targetDiv.appendChild(clone);
  clone.style.display = "block"; // блочный элемент
  clone.style.marginTop = "1vw"; // регулирует вертикальное смещение вниз
  clone.style.marginLeft = "1.2vw"; // чтобы центрировать по горизонтали
  clone.style.marginRight = "auto";

  // плавное увеличение
  requestAnimationFrame(() => {
    clone.style.transform = "scale(1.2)";
  });

  setTimeout(() => {
    clone.style.transform = "scale(1)";
    spinning = false; // ✅ разрешаем следующий спин

    if (checkAllTargetsFilled()) {
      const button = document.getElementById("fortuneButton");
      if (button) {
        button.textContent = "ЗАБРАТЬ ВЫИГРЫШ";
      }
    }
  }, 300);

  randomizeStats();
}
centerItems.forEach((item) => {
  if (item) item.style.zIndex = "";
});
spinning = false;

// ✅ Проверяем, заполнены ли все targetDivs
if (checkAllTargetsFilled()) {
  const button = document.getElementById("fortuneButton");
  if (button) {
    button.textContent = "ЗАБРАТЬ ВЫИГРЫШ";
    // можно отключить дальнейшее вращение, если нужно
    button.disabled = false; // или true, если запрещаем крутить дальше
  }
}

// сброс zIndex
centerItems.forEach((item) => {
  if (item) item.style.zIndex = "";
});

clone.remove();
spinning = false;

// сбрасываем zIndex
centerItems.forEach((item) => {
  if (item) item.style.zIndex = "";
});
document.getElementById("fortuneButton").addEventListener("click", function () {
  const rectangle = document.getElementById("winRectangle");

  // Убираем transition для opacity, работаем с фоном
  rectangle.style.transition = "background-color 0.3s ease";
  rectangle.style.backgroundColor = "rgba(240, 240, 240, 0.9)"; // яркий фон

  setTimeout(() => {
    rectangle.style.backgroundColor = "rgba(255, 215, 0, 0)"; // полностью прозрачный фон
  }, 300);

  setTimeout(() => {
    rectangle.style.transition = "";
  }, 600);
});
if (finishedCount === strips.length) {
  // ВСЕ БАРАБАНЫ ОСТАНОВИЛИСЬ - МИГАЕМ!
  const rectangle = document.getElementById("winRectangle");
  rectangle.style.transition = "background-color 0.2s ease";
  rectangle.style.backgroundColor = "rgba(255, 215, 0, 0.9)";

  setTimeout(() => {
    rectangle.style.backgroundColor = "rgba(255, 215, 0, 0)";
  }, 200);

  // Потом увеличиваем элементы
  increaseThenShrinkCenter(centerItemsRefs, resultIdx);
}

// статус!!!!!!
