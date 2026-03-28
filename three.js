// импорт библиотеки из инета и подкл проги, которая умеет загружать и читать файл из блендера
import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";
import { EXRLoader } from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/EXRLoader.js";

const scene = new THREE.Scene();

// Окружение
const loaderEnvironment = new EXRLoader();
loaderEnvironment.load(
  "studio_kominka_04_4k.exr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    console.log("✅ Окружение загружено!");
  },
  undefined,
  function (error) {
    console.error("Ошибка загрузки окружения:", error);
  }
);

// Камера
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 3, 8);
camera.lookAt(0, 1, 0);

// Рендерер
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x000000, 0); // Прозрачный фон

// ВАЖНО: получаем canvas ПОСЛЕ создания renderer
const canvas = renderer.domElement;

// Настройка контейнера
const container = document.querySelector(".coffeeMachine");

if (container) {
  console.log("✅ Контейнер .coffeeMachine найден");

  // Настраиваем контейнер
  container.style.position = "relative";
  container.style.width = "50vw";
  container.style.height = "50vw";
  container.style.overflow = "hidden";
  container.style.margin = "0";
  container.style.padding = "0";

  // Настраиваем canvas
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  // Очищаем контейнер и добавляем canvas
  container.innerHTML = "";
  container.appendChild(canvas);

  // Обновляем размер рендерера под размер контейнера
  const updateSize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  updateSize();
  window.addEventListener("resize", updateSize);
} else {
  // Если контейнер не найден, добавляем в body
  console.warn("⚠️ Контейнер .coffeeMachine не найден, добавляем в body");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "1000";
  document.body.appendChild(canvas);

  // Обновляем размер при изменении окна
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Управление
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = -0.1;
controls.maxAzimuthAngle = Math.PI / 2;

// Освещение
// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);

// const mainLight = new THREE.DirectionalLight(0xfff5e6, 0.5);
// mainLight.position.set(3, 5, 5);
// mainLight.castShadow = true;
// mainLight.shadow.radius = 3;
// scene.add(mainLight);

// const fillLight = new THREE.DirectionalLight(0xe6f0ff, 1.25);
// fillLight.position.set(-3, 3, 5);
// scene.add(fillLight);

// const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
// topLight.position.set(0, 8, 2);
// scene.add(topLight);

// const bottomLight = new THREE.DirectionalLight(0xffffff, 0.8);
// bottomLight.position.set(0, -2, 3);
// scene.add(bottomLight);

// Загрузка модели
const loader = new GLTFLoader();
const modelPath = "./coffeeMachine.glb";

console.log("Начинаем загрузку модели:", modelPath);

loader.load(
  modelPath,
  function (gltf) {
    console.log("✅ Модель успешно загружена!");
    const model = gltf.scene;
    model.rotation.y = Math.PI * 1.4;
    model.position.set(0, -2.5, 0);
    model.scale.set(0.65, 0.65, 0.65);

    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(model);

    model.traverse(function (node) {
      if (node.isMesh && node.material) {
        const matName = node.material.name.toLowerCase();

        if (matName.includes("glass") || matName.includes("стекло")) {
          console.log("Найден стеклянный материал:", node.material.name);
          node.material.transparent = true;
          node.material.opacity = 0.3;
          node.material.roughness = 0.1;
          node.material.metalness = 0.0;
          node.material.ior = 1.5;
          node.material.transmission = 0.95;
          node.material.thickness = 0.5;
          node.material.envMapIntensity = 1.5;
        }
      }
    });
    console.log("Модель загружена и добавлена в сцену!", model);
  },
  function (progress) {
    const percent = ((progress.loaded / progress.total) * 100).toFixed(1);
    console.log(`⏳ Загрузка: ${percent}%`);
  },
  function (error) {
    console.error("❌ Ошибка загрузки модели:", error);
    console.log("\n📌 ПРОВЕРЬТЕ:");
    console.log(
      "1. Файл coffeeMachine.glb находится в той же папке, что и HTML файл"
    );
    console.log("2. Имя файла написано правильно (регистр важен)");
    console.log("3. Файл не поврежден");
    alert("Ошибка загрузки модели. Проверьте консоль (F12) для деталей");
  }
);

// Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
