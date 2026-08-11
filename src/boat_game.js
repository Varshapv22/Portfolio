import * as THREE from 'three';
import { getTheme, initThemeToggle } from './theme.js';

/* =============================================
   MOBILE MENU TOGGLE
   ============================================= */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

initThemeToggle();

/* =============================================
   THEME PALETTE
   ============================================= */
const SCENE_THEME = {
  dark:  { bg: 0x0a1128, ambientIntensity: 0.5, dir: 0x00d2ff, dirIntensity: 1.5, blue: 0x3a7bd5, blueIntensity: 2, water: 0x001e36 },
  light: { bg: 0xbfe3f5, ambientIntensity: 1.1, dir: 0xfff4dd, dirIntensity: 2.2, blue: 0x8fd0ff, blueIntensity: 0.8, water: 0x3aa0d8 },
};

// -----------------------------
// GAME STATE & VARIABLES
// -----------------------------
let isPlaying = false;
let score = 0;
let speed = 0.5; // Forward speed (simulated by moving water/obstacles)
let targetSpeed = 0.5;

// Elements
const scoreEl = document.getElementById('scoreVal');
const finalScoreEl = document.getElementById('finalScoreVal');
const startModal = document.getElementById('startModal');
const gameOverModal = document.getElementById('gameOverModal');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// -----------------------------
// THREE.JS SETUP
// -----------------------------
const canvas = document.querySelector('#boat-bg');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(SCENE_THEME[getTheme()].bg, 0.015);
scene.background = new THREE.Color(SCENE_THEME[getTheme()].bg);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// Position camera behind and slightly above the boat
camera.position.set(0, 10, 25);
camera.lookAt(0, 0, -10);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// -----------------------------
// LIGHTING
// -----------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, SCENE_THEME[getTheme()].ambientIntensity);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(SCENE_THEME[getTheme()].dir, SCENE_THEME[getTheme()].dirIntensity);
dirLight.position.set(20, 40, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const blueLight = new THREE.PointLight(SCENE_THEME[getTheme()].blue, SCENE_THEME[getTheme()].blueIntensity, 50);
blueLight.position.set(-10, 10, -10);
scene.add(blueLight);

// -----------------------------
// THE WATER
// -----------------------------
// Create a large plane that we will animate vertices on to look like gentle waves
const waterGeo = new THREE.PlaneGeometry(200, 200, 64, 64);
waterGeo.rotateX(-Math.PI / 2); // Lay flat
const waterMat = new THREE.MeshStandardMaterial({
  color: SCENE_THEME[getTheme()].water,
  roughness: 0.1,
  metalness: 0.8,
  flatShading: true
});

function applySceneTheme(theme) {
  const cfg = SCENE_THEME[theme];
  scene.background.set(cfg.bg);
  scene.fog.color.set(cfg.bg);
  ambientLight.intensity = cfg.ambientIntensity;
  dirLight.color.set(cfg.dir);
  dirLight.intensity = cfg.dirIntensity;
  blueLight.color.set(cfg.blue);
  blueLight.intensity = cfg.blueIntensity;
  waterMat.color.set(cfg.water);
}

window.addEventListener('themechange', (e) => applySceneTheme(e.detail.theme));
const water = new THREE.Mesh(waterGeo, waterMat);
water.receiveShadow = true;
scene.add(water);

// Store original vertices for wave animation
const originalPositions = waterGeo.attributes.position.clone();

// -----------------------------
// THE BOAT
// -----------------------------
const boatGroup = new THREE.Group();

// Hull
const hullGeo = new THREE.BoxGeometry(3, 1.5, 6);
const hullMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
const hull = new THREE.Mesh(hullGeo, hullMat);
hull.position.y = 0.5;
hull.castShadow = true;
boatGroup.add(hull);

// Cabin
const cabinGeo = new THREE.BoxGeometry(2, 1.5, 3);
const cabinMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 });
const cabin = new THREE.Mesh(cabinGeo, cabinMat);
cabin.position.set(0, 2, -0.5);
cabin.castShadow = true;
boatGroup.add(cabin);

// Sail / Mast
const mastGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
const mastMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const mast = new THREE.Mesh(mastGeo, mastMat);
mast.position.set(0, 4, 1.5);
boatGroup.add(mast);

const sailGeo = new THREE.ConeGeometry(3, 6, 3);
const sailMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
const sail = new THREE.Mesh(sailGeo, sailMat);
sail.position.set(0, 4, 1.5);
sail.rotation.y = Math.PI / 2;
boatGroup.add(sail);

scene.add(boatGroup);
boatGroup.position.set(0, 0, 0);

// We define a boat state for movement
const boatState = {
  rotationZ: 0, // tilting when moving side to side
  targetX: 0,
  speedX: 0.5,
  bobTime: 0
};

// -----------------------------
// OBSTACLES (ROCKS)
// -----------------------------
const obstacles = [];
const obstacleGeo = new THREE.DodecahedronGeometry(2, 0); // low poly rocks
const obstacleMat = new THREE.MeshStandardMaterial({
  color: 0x4a5568,
  roughness: 0.8,
  metalness: 0.2,
  flatShading: true
});

function spawnObstacle() {
  if (!isPlaying) return;
  const rock = new THREE.Mesh(obstacleGeo, obstacleMat);
  
  // Random X between -15 and 15
  const randomX = (Math.random() - 0.5) * 30;
  const startZ = -80; // Spaen far away in front
  
  // Random scale and rotation
  const scale = 0.5 + Math.random() * 1.5;
  rock.scale.set(scale, scale, scale);
  rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  
  rock.position.set(randomX, 0, startZ);
  rock.castShadow = true;
  rock.receiveShadow = true;
  
  scene.add(rock);
  obstacles.push(rock);
}

// -----------------------------
// INPUT & CONTROLS
// -----------------------------
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  a: false,
  d: false
};

window.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------------
// GAME LOGIC
// -----------------------------
function startGame() {
  startModal.classList.remove('active');
  gameOverModal.classList.remove('active');
  
  // Reset state
  score = 0;
  speed = 0.5;
  targetSpeed = 0.5;
  
  // Reset boat
  boatGroup.position.set(0, 0, 0);
  boatState.targetX = 0;
  
  // Clear obstacles
  obstacles.forEach(obs => scene.remove(obs));
  obstacles.length = 0;
  
  scoreEl.textContent = score;
  isPlaying = true;
}

function stopGame() {
  isPlaying = false;
  finalScoreEl.textContent = Math.floor(score);
  gameOverModal.classList.add('active');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Collision Detection Box
const boatBox = new THREE.Box3();
const obsBox = new THREE.Box3();

// -----------------------------
// ANIMATION LOOP
// -----------------------------
const clock = new THREE.Clock();
let time = 0;
let lastSpawn = 0;

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  time += delta;
  
  // 1. Animate Water
  const positions = waterGeo.attributes.position;
  const original = originalPositions;
  for (let i = 0; i < positions.count; i++) {
    // get original x and y (since it's rotated, y is z in world space)
    const px = original.getX(i);
    const py = original.getY(i); // original y is the plane's local y (which maps to world -z)
    
    // Create wave math based on a scrolling time factor so it looks like we're moving forward
    const scrollFactor = isPlaying ? time * speed * 10 : time * 2;
    // Simple wave combination
    const zOffset = Math.sin(px * 0.2 + time) * 0.5 + Math.cos(py * 0.1 + scrollFactor) * 0.8;
    
    positions.setZ(i, zOffset); // update height (which is local z, mapped to world y)
  }
  positions.needsUpdate = true;
  waterGeo.computeVertexNormals();

  // 2. Play state logic
  if (isPlaying) {
    // Increase score gracefully
    score += delta * speed * 10;
    scoreEl.textContent = Math.floor(score);
    
    // Increase speed slowly
    targetSpeed += delta * 0.005;
    speed = THREE.MathUtils.lerp(speed, targetSpeed, 0.05);

    // Controls
    let moveDir = 0;
    if (keys.ArrowLeft || keys.a) moveDir = -1;
    if (keys.ArrowRight || keys.d) moveDir = 1;
    
    // Move boat target position
    boatState.targetX += moveDir * delta * 20;
    // Clamp movement 
    boatState.targetX = THREE.MathUtils.clamp(boatState.targetX, -15, 15);
    
    // Smoothly approach target X
    boatGroup.position.x = THREE.MathUtils.lerp(boatGroup.position.x, boatState.targetX, 0.1);
    
    // Boat tilting effect (tilt based on movement)
    const tilt = (boatGroup.position.x - boatState.targetX) * 0.05;
    boatGroup.rotation.z = THREE.MathUtils.lerp(boatGroup.rotation.z, tilt, 0.1);
    
    // Bobbing effect
    boatState.bobTime += delta * 5;
    boatGroup.position.y = Math.sin(boatState.bobTime) * 0.2;
    // slight pitch forward backward
    boatGroup.rotation.x = Math.sin(boatState.bobTime * 0.8) * 0.05;

    // Obstacle spawning
    if (time - lastSpawn > Math.max(0.5, 2 - speed * 1.5)) {
      spawnObstacle();
      lastSpawn = time;
    }
    
    // Update Obstacles & Collision
    boatBox.setFromObject(boatGroup);
    // slightly shrink the collision box for the boat to be fair
    boatBox.expandByScalar(-0.5); 
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      // Move obstacle towards the camera
      obs.position.z += speed * delta * 50;
      
      // Update its bounding box
      obsBox.setFromObject(obs);
      obsBox.expandByScalar(-0.5);
      
      // Check collision
      if (boatBox.intersectsBox(obsBox)) {
        stopGame();
        break; // stop loop
      }
      
      // Remove if passed camera
      if (obs.position.z > 15) {
        scene.remove(obs);
        obstacles.splice(i, 1);
      }
    }
    
    // Camera follow boat softly but stay centered mostly
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, boatGroup.position.x * 0.5, 0.05);

  } else {
    // Idle boat bobbing
    boatState.bobTime += delta * 2;
    boatGroup.position.y = Math.sin(boatState.bobTime) * 0.3;
  }
  
  renderer.render(scene, camera);
}

animate();
