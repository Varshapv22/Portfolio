import './style.css';
import './game.css';
import * as THREE from 'three';
import { getTheme, initThemeToggle } from './theme.js';

/* =============================================
   MOBILE MENU TOGGLE (from main.js)
   ============================================= */
const menuToggle  = document.getElementById('menuToggle');
const mobileMenu  = document.getElementById('mobileMenu');

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

initThemeToggle();

/* =============================================
   THEME PALETTE
   ============================================= */
const SCENE_THEME = {
  dark:  { bg: 0x050510, ambient: 0x1a1a40, ambientIntensity: 2, star: 0xffffff, starOpacity: 0.4 },
  light: { bg: 0xeef1f8, ambient: 0xffffff, ambientIntensity: 1.6, star: 0x27314f, starOpacity: 0.25 },
};


/* =============================================
   GAME LOGIC & THREE.JS SETUP
   ============================================= */

// Element references
const scoreEl = document.getElementById('scoreVal');
const timeEl = document.getElementById('timeVal');
const finalScoreEl = document.getElementById('finalScoreVal');
const startModal = document.getElementById('startModal');
const gameOverModal = document.getElementById('gameOverModal');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Game State
let score = 0;
let timeLeft = 60;
let isPlaying = false;
let gameTimer = null;
let spawnTimer = null;

// Three.js Setup
const canvas = document.querySelector('#game-bg');
const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_THEME[getTheme()].bg);
scene.fog = new THREE.FogExp2(SCENE_THEME[getTheme()].bg, 0.015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting matching the agency theme
const ambient = new THREE.AmbientLight(SCENE_THEME[getTheme()].ambient, SCENE_THEME[getTheme()].ambientIntensity);
scene.add(ambient);
const light1 = new THREE.PointLight(0x00d4ff, 80, 120);
light1.position.set(20, 20, 20);
scene.add(light1);
const light2 = new THREE.PointLight(0x7b2fff, 80, 120);
light2.position.set(-20, -20, 20);
scene.add(light2);

// Background Stars (To give a spacey tech vibe)
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(3000 * 3);
for (let i = 0; i < 3000 * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 400;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ size: 0.2, color: SCENE_THEME[getTheme()].star, transparent: true, opacity: SCENE_THEME[getTheme()].starOpacity });
scene.add(new THREE.Points(starGeo, starMat));

function applySceneTheme(theme) {
  const cfg = SCENE_THEME[theme];
  scene.background.set(cfg.bg);
  scene.fog.color.set(cfg.bg);
  ambient.color.set(cfg.ambient);
  ambient.intensity = cfg.ambientIntensity;
  starMat.color.set(cfg.star);
  starMat.opacity = cfg.starOpacity;
}

window.addEventListener('themechange', (e) => applySceneTheme(e.detail.theme));


// Game Entities
let targetMeshes = [];
const geoTypes = [
  new THREE.IcosahedronGeometry(2.5, 0),
  new THREE.OctahedronGeometry(2.5),
  new THREE.TetrahedronGeometry(2.5),
  new THREE.DodecahedronGeometry(2.0),
];

const mats = [
  new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.2, metalness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x7b2fff, roughness: 0.2, metalness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.2, metalness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.2, metalness: 0.8 }),
];

// Raycasting for Clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function spawnTarget() {
    if (!isPlaying) return;

    const geo = geoTypes[Math.floor(Math.random() * geoTypes.length)];
    const mat = mats[Math.floor(Math.random() * mats.length)];
    const mesh = new THREE.Mesh(geo, mat);

    // Spawn at bottom, random X
    const spawnX = (Math.random() - 0.5) * 35;
    mesh.position.set(spawnX, -22, (Math.random() - 0.5) * 5);
    
    // Add custom properties for animation
    mesh.userData = {
        speed: Math.random() * 8 + 4,
        rotX: Math.random() * 1.5,
        rotY: Math.random() * 1.5,
    };

    scene.add(mesh);
    targetMeshes.push(mesh);
}

function createScorePopup(x, y) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = '+10';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

function onMouseClick(event) {
    if (!isPlaying) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(targetMeshes);

    if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        
        // Remove from scene and array
        scene.remove(hitMesh);
        hitMesh.geometry.dispose();
        targetMeshes = targetMeshes.filter(m => m !== hitMesh);

        // Update score
        score += 10;
        scoreEl.textContent = score;

        // Visual feedback (Score popup at mouse coordinates)
        createScorePopup(event.clientX, event.clientY);
    }
}

window.addEventListener('click', onMouseClick);
window.addEventListener('touchstart', (e) => {
    if(e.touches.length > 0) {
        onMouseClick(e.touches[0]);
    }
});

// Game Loop Functions
function startGame() {
    score = 0;
    timeLeft = 60;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    isPlaying = true;
    document.body.classList.add('game-playing');
    
    startModal.classList.remove('active');
    gameOverModal.classList.remove('active');

    // Clear existing meshes
    targetMeshes.forEach(mesh => {
        scene.remove(mesh);
        mesh.geometry.dispose();
    });
    targetMeshes = [];

    // Timers
    gameTimer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    spawnTimer = setInterval(spawnTarget, 800);
}

function endGame() {
    isPlaying = false;
    document.body.classList.remove('game-playing');
    clearInterval(gameTimer);
    clearInterval(spawnTimer);
    
    finalScoreEl.textContent = score;
    gameOverModal.classList.add('active');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);


// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (isPlaying) {
        for (let i = targetMeshes.length - 1; i >= 0; i--) {
            const tempMesh = targetMeshes[i];
            
            tempMesh.position.y += tempMesh.userData.speed * delta;
            tempMesh.rotation.x += tempMesh.userData.rotX * delta;
            tempMesh.rotation.y += tempMesh.userData.rotY * delta;

            // Remove if floats too high
            if (tempMesh.position.y > 35) {
                scene.remove(tempMesh);
                tempMesh.geometry.dispose();
                targetMeshes.splice(i, 1);
            }
        }
    }

    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
