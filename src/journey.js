import './journey.css';
import * as THREE from 'three';

/* =============================================
   LIFE JOURNEY DATA
   — Edit these milestones with your real details
   ============================================= */
const MILESTONES = [
  {
    t: 0,
    title: 'Born',
    date: '22 Dec 2000',
    location: 'Kannur, Kerala',
    icon: '🌟',
    color: 0xffd700,
    highlight: '#ffd700',
    desc: 'The voyage begins. Born on 22nd December 2000 in Kannur, Kerala — a coastal town that would spark a lifelong curiosity for how things connect, communicate, and come to life through technology.',
    tags: ['Day 1', 'Kannur', 'Kerala'],
  },
  {
    t: 0.125,
    title: '10th Board',
    date: '2015 – 2016',
    location: 'Kerala State Board',
    icon: '📚',
    color: 0x22c55e,
    highlight: '#22c55e',
    desc: 'Completed 10th grade from Kerala State Board. These foundational years built discipline, a love for learning, and the habit of asking "how does this actually work?" — a question that would define the path ahead.',
    tags: ['Education', 'Kerala State Board', 'Foundation'],
  },
  {
    t: 0.25,
    title: '12th Board',
    date: '2017 – 2018',
    location: 'Kerala State Board',
    icon: '🎒',
    color: 0x00d4ff,
    highlight: '#00d4ff',
    desc: 'Cleared 12th grade and set sights firmly on Computer Science. The decision to pursue technology felt natural — the digital world was calling, and the compass was already pointing toward code.',
    tags: ['Higher Secondary', 'Kerala State Board', 'CS Path'],
  },
  {
    t: 0.375,
    title: 'BSc Computer Science',
    date: '2018 – 2021',
    location: 'Kannur University',
    icon: '🎓',
    color: 0x7b2fff,
    highlight: '#7b2fff',
    desc: 'Pursued BSc Computer Science at Kannur University — diving deep into programming, databases, algorithms, and the core fundamentals that would power a career in software development.',
    tags: ['Degree', 'Kannur University', 'Computer Science', 'Programming'],
  },
  {
    t: 0.5,
    title: 'Web Dev Passion',
    date: '2021 – 2022',
    location: 'Personal Projects & Expertz Lab',
    icon: '💻',
    color: 0xff6b6b,
    highlight: '#ff6b6b',
    desc: 'A passion truly ignited — started building websites from scratch, constantly experimenting with the latest web technologies, and chasing every opportunity to level up. Also completed Python Data Science with AI Expert certification at Expertz Lab.',
    tags: ['Hobby', 'Web Development', 'Python', 'AI', 'Self-Learning'],
  },
  {
    t: 0.625,
    title: 'PHP Certification',
    date: '2023',
    location: 'Gtec',
    icon: '🏆',
    color: 0xffcc44,
    highlight: '#ffcc44',
    desc: 'Earned PHP certification from Gtec — a milestone that validated backend development skills and formally opened the door to professional Laravel development and real-world web engineering.',
    tags: ['PHP', 'Certification', 'Gtec', 'Backend'],
  },
  {
    t: 0.75,
    title: 'BTRAC',
    date: 'Jul 2023 – Jan 2025',
    location: 'Business Technology Research & Analytics Centre',
    icon: '💼',
    color: 0x00d4ff,
    highlight: '#00d4ff',
    desc: 'First professional role as Software Developer — building Laravel applications, optimizing MySQL databases, developing WooCommerce e-commerce sites, and deploying on Hostinger. Real-world skills sharpened on real-world challenges.',
    tags: ['Laravel', 'PHP', 'MySQL', 'WordPress', 'First Job'],
  },
  {
    t: 0.875,
    title: 'Infinite Open Source',
    date: 'Feb 2025 – Present',
    location: 'Infinite Open Source Solutions',
    icon: '🚀',
    color: 0x7b2fff,
    highlight: '#7b2fff',
    desc: 'Software Engineer at Infinite Open Source Solutions — integrating payment gateways, building RESTful APIs across Laravel and WooCommerce, and architecting scalable backend systems with clean OOP and MVC principles.',
    tags: ['Laravel', 'API', 'Payment Gateway', 'WooCommerce', 'Growth'],
  },
  {
    t: 1.0,
    title: 'The Horizon',
    date: '2026 & Beyond',
    location: 'The Future',
    icon: '✨',
    color: 0xffd700,
    highlight: '#ffd700',
    desc: 'The journey continues — building, learning, and creating impactful software. Every project is a new port, every challenge a new wave to sail through. The best code is yet to be written.',
    tags: ['Future', 'Growth', 'Innovation', 'Infinite'],
  },
];

/* =============================================
   SCROLL DRIVER HEIGHT
   ============================================= */
const SCROLL_HEIGHT = window.innerHeight * (MILESTONES.length + 1);
document.getElementById('scrollDriver').style.height = `${SCROLL_HEIGHT}px`;

/* =============================================
   THREE.JS SETUP
   ============================================= */
const canvas = document.querySelector('#bg');
const scene  = new THREE.Scene();
scene.fog    = new THREE.FogExp2(0x010820, 0.008);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1200);
camera.position.set(0, 14, 28);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
renderer.toneMapping       = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

/* =============================================
   JOURNEY PATH CURVE
   ============================================= */
const PATH_POINTS = [
  new THREE.Vector3(-120, 0,   0),   // Born
  new THREE.Vector3( -80, 0, -30),   // Childhood
  new THREE.Vector3( -40, 0,  25),   // School
  new THREE.Vector3(   0, 0, -20),   // University
  new THREE.Vector3(  40, 0,  30),   // First Job
  new THREE.Vector3(  80, 0, -25),   // Career
  new THREE.Vector3( 120, 0,   0),   // Destination
];

const curve = new THREE.CatmullRomCurve3(PATH_POINTS, false, 'catmullrom', 0.5);

/* =============================================
   LIGHTING
   ============================================= */
// Moonlight (cool directional)
const moon = new THREE.DirectionalLight(0x8899dd, 2.0);
moon.position.set(-60, 80, -40);
moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048);
moon.shadow.camera.near   = 0.5;
moon.shadow.camera.far    = 400;
moon.shadow.camera.left   = -150;
moon.shadow.camera.right  = 150;
moon.shadow.camera.top    = 150;
moon.shadow.camera.bottom = -150;
scene.add(moon);

// Soft ambient
const ambient = new THREE.AmbientLight(0x112244, 2.5);
scene.add(ambient);

// Fill from below (fake water bounce)
const fillLight = new THREE.HemisphereLight(0x003366, 0x001133, 1.0);
scene.add(fillLight);

/* =============================================
   SKY DOME
   ============================================= */
const skyGeo = new THREE.SphereGeometry(600, 32, 32);
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    topColor:    { value: new THREE.Color(0x010312) },
    horizonColor:{ value: new THREE.Color(0x0a1a3e) },
  },
  vertexShader: `
    varying float vY;
    void main() {
      vY = position.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 horizonColor;
    varying float vY;
    void main() {
      float t = clamp(vY / 400.0, 0.0, 1.0);
      gl_FragColor = vec4(mix(horizonColor, topColor, t * t), 1.0);
    }
  `,
});
scene.add(new THREE.Mesh(skyGeo, skyMat));

/* =============================================
   MOON SPHERE
   ============================================= */
function buildMoon() {
  const group = new THREE.Group();

  const moonGeo = new THREE.SphereGeometry(12, 32, 32);
  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xe8e0c8,
    roughness: 0.9,
    metalness: 0.0,
    emissive: 0xffe8a0,
    emissiveIntensity: 0.3,
  });
  group.add(new THREE.Mesh(moonGeo, moonMat));

  // Halo (additive blending glow)
  const haloGeo = new THREE.SphereGeometry(18, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x8899cc,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(haloGeo, haloMat));

  group.position.set(-200, 220, -300);
  scene.add(group);
}
buildMoon();

/* =============================================
   STARS
   ============================================= */
function buildStars() {
  const count = 8000;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(count * 3);
  const col   = new Float32Array(count * 3);

  const colors = [
    [1.0, 1.0, 1.0],
    [0.7, 0.8, 1.0],
    [1.0, 0.9, 0.7],
    [0.8, 1.0, 1.0],
  ];

  for (let i = 0; i < count; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 500 + Math.random() * 50;
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 50;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const c = colors[Math.floor(Math.random() * colors.length)];
    col[i * 3]     = c[0];
    col[i * 3 + 1] = c[1];
    col[i * 3 + 2] = c[2];
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })));
}
buildStars();

/* =============================================
   OCEAN
   ============================================= */
const WATER_SEGS = 120;
const waterGeo   = new THREE.PlaneGeometry(900, 900, WATER_SEGS, WATER_SEGS);
waterGeo.rotateX(-Math.PI / 2);

const waterMat = new THREE.MeshPhongMaterial({
  color: 0x003d6b,
  emissive: 0x001a33,
  emissiveIntensity: 0.5,
  shininess: 120,
  specular: new THREE.Color(0x4488cc),
  transparent: true,
  opacity: 0.92,
});

const waterMesh = new THREE.Mesh(waterGeo, waterMat);
waterMesh.receiveShadow = true;
scene.add(waterMesh);

// Bioluminescent glow layer (additive)
const glowGeo = new THREE.PlaneGeometry(900, 900, 1, 1);
glowGeo.rotateX(-Math.PI / 2);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0x001a44,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const glowPlane = new THREE.Mesh(glowGeo, glowMat);
glowPlane.position.y = 0.1;
scene.add(glowPlane);

/* =============================================
   BIOLUMINESCENT PARTICLES (in water)
   ============================================= */
function buildBioluminescence() {
  const count = 4000;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(count * 3);
  const col   = new Float32Array(count * 3);

  const bioColors = [
    [0.0, 0.8, 1.0],
    [0.0, 1.0, 0.7],
    [0.2, 0.6, 1.0],
    [0.4, 0.9, 1.0],
  ];

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 600;
    pos[i * 3 + 1] = Math.random() * 1.5 - 0.5;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 600;

    const c = bioColors[Math.floor(Math.random() * bioColors.length)];
    const brightness = 0.3 + Math.random() * 0.7;
    col[i * 3]     = c[0] * brightness;
    col[i * 3 + 1] = c[1] * brightness;
    col[i * 3 + 2] = c[2] * brightness;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return new THREE.Points(geo, mat);
}
const bioParticles = buildBioluminescence();
scene.add(bioParticles);

/* =============================================
   PATH TUBE (the route line)
   ============================================= */
const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.4, 8, false);
const tubeMat = new THREE.MeshBasicMaterial({
  color: 0x00d4ff,
  transparent: true,
  opacity: 0.35,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const pathTube = new THREE.Mesh(tubeGeo, tubeMat);
pathTube.position.y = 0.3;
scene.add(pathTube);

/* =============================================
   WALK ANCHOR
   Invisible 3D position marker the girl (2D HUD
   sprite) is projected onto each frame, plus the
   glowing light-circle she walks on and the warm
   lantern glow that lights her path.
   ============================================= */
function buildWalkAnchor() {
  const group = new THREE.Group();

  // Soft glowing circle of light on the water beneath her feet
  const glowGeo = new THREE.RingGeometry(0.1, 2.4, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x8fe9ff,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const glowCircle = new THREE.Mesh(glowGeo, glowMat);
  glowCircle.rotation.x = -Math.PI / 2;
  glowCircle.position.y = 0.08;
  group.add(glowCircle);

  // Crisp outer ring outline
  const ringGeo = new THREE.RingGeometry(2.3, 2.55, 40);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xbdf4ff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.09;
  group.add(ring);

  // Lantern glow beside her (warm point light)
  const lanternLight = new THREE.PointLight(0xffcc66, 4.5, 20);
  lanternLight.position.set(-1.6, 2.2, 0);
  group.add(lanternLight);

  // Soft guiding light a step ahead, in her direction of travel
  const guideLight = new THREE.PointLight(0x66e0ff, 2.5, 14);
  guideLight.position.set(2.2, 1.6, 0);
  group.add(guideLight);

  return { group, glowCircle, ring };
}

const { group: boatGroup, glowCircle: girlGlowCircle, ring: girlGlowRing } = buildWalkAnchor();
scene.add(boatGroup);

/* =============================================
   WAKE TRAIL
   ============================================= */
const WAKE_COUNT = 80;
const wakeGeo   = new THREE.BufferGeometry();
const wakePos   = new Float32Array(WAKE_COUNT * 3);
const wakeSizes = new Float32Array(WAKE_COUNT);
wakeGeo.setAttribute('position', new THREE.BufferAttribute(wakePos, 3));

const wakeMat = new THREE.PointsMaterial({
  color: 0x88ccff,
  size: 1.8,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true,
});
const wakeMesh = new THREE.Points(wakeGeo, wakeMat);
scene.add(wakeMesh);

let wakeIndex  = 0;
let lastProg   = -1;
const wakeHistory = [];

/* =============================================
   MILESTONE ISLANDS
   ============================================= */
function buildPalmTree(group, ox, oz) {
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 5, 8);
  const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8b6914 });
  const trunk    = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(ox, 2.5, oz);
  trunk.rotation.z = (Math.random() - 0.5) * 0.3;
  group.add(trunk);

  const leafColors = [0x1a7a1a, 0x228b22, 0x2d9e2d];
  for (let i = 0; i < 5; i++) {
    const leafGeo = new THREE.ConeGeometry(2.5, 1.5, 6);
    const leafMat = new THREE.MeshPhongMaterial({ color: leafColors[i % leafColors.length] });
    const leaf    = new THREE.Mesh(leafGeo, leafMat);
    const angle   = (i / 5) * Math.PI * 2;
    leaf.position.set(ox + Math.cos(angle) * 1.5, 5.5, oz + Math.sin(angle) * 1.5);
    leaf.rotation.z = Math.PI * 0.3;
    leaf.rotation.y = angle;
    group.add(leaf);
  }
}

function buildIsland(pathT, milestoneColor, milestoneIndex) {
  const group = new THREE.Group();

  // Offset the island to the side of the path
  const pos       = curve.getPoint(pathT);
  const tangent   = curve.getTangent(pathT);
  const perp      = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  const side      = milestoneIndex % 2 === 0 ? 1 : -1;
  const islandPos = pos.clone().add(perp.multiplyScalar(side * 22));

  // Rock base (submerged cylinder)
  const rockGeo = new THREE.CylinderGeometry(9, 11, 5, 14);
  const rockMat = new THREE.MeshPhongMaterial({ color: 0x2e4a2e, shininess: 10 });
  const rock    = new THREE.Mesh(rockGeo, rockMat);
  rock.position.y = -2;
  rock.castShadow = true;
  group.add(rock);

  // Sandy beach top
  const sandGeo = new THREE.CylinderGeometry(8.5, 9, 1.5, 14);
  const sandMat = new THREE.MeshPhongMaterial({ color: 0xe8d5a3, shininess: 5 });
  const sand    = new THREE.Mesh(sandGeo, sandMat);
  sand.position.y = 0.8;
  sand.castShadow = true;
  group.add(sand);

  // Grass top
  const grassGeo = new THREE.CylinderGeometry(6.5, 8, 1, 14);
  const grassMat = new THREE.MeshPhongMaterial({ color: 0x2d6e2d, shininess: 5 });
  const grass    = new THREE.Mesh(grassGeo, grassMat);
  grass.position.y = 2.0;
  group.add(grass);

  // Palm trees
  buildPalmTree(group, -2, -1);
  buildPalmTree(group,  2,  1.5);

  // Beacon pillar
  const pillarGeo = new THREE.CylinderGeometry(0.3, 0.4, 7, 8);
  const pillarMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const pillar    = new THREE.Mesh(pillarGeo, pillarMat);
  pillar.position.set(0, 6.5, 0);
  pillar.castShadow = true;
  group.add(pillar);

  // Glowing orb at beacon top
  const orbGeo = new THREE.SphereGeometry(1.2, 16, 16);
  const orbMat = new THREE.MeshBasicMaterial({ color: milestoneColor });
  const orb    = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(0, 10.5, 0);
  group.add(orb);

  // Outer glow
  const glowOrbGeo = new THREE.SphereGeometry(2.5, 16, 16);
  const glowOrbMat = new THREE.MeshBasicMaterial({
    color: milestoneColor,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(glowOrbGeo, glowOrbMat)).position.set(0, 10.5, 0);

  // Beacon light
  const beaconLight = new THREE.PointLight(milestoneColor, 8, 45);
  beaconLight.position.set(0, 10.5, 0);
  group.add(beaconLight);

  // Number sign
  const signGeo = new THREE.PlaneGeometry(2, 1);
  const signMat = new THREE.MeshBasicMaterial({ color: milestoneColor, side: THREE.DoubleSide });
  const sign    = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 12.5, 0);
  group.add(sign);

  group.position.copy(islandPos);
  group.position.y = -2.5;

  scene.add(group);
  return { group, orb, beaconLight, islandPos };
}

const islands = MILESTONES.map((m, i) => buildIsland(m.t, m.color, i));

/* =============================================
   DESTINATION ARCH (final island)
   ============================================= */
function buildDestinationArch() {
  const endPos = curve.getPoint(1.0);
  const group  = new THREE.Group();

  // Two pillars
  [-5, 5].forEach(ox => {
    const pilGeo = new THREE.CylinderGeometry(0.7, 0.9, 12, 10);
    const pilMat = new THREE.MeshPhongMaterial({ color: 0xd4af37, shininess: 80, metalness: 0.3 });
    const pil    = new THREE.Mesh(pilGeo, pilMat);
    pil.position.set(ox, 6, 0);
    group.add(pil);
  });

  // Arch top bar
  const barGeo = new THREE.BoxGeometry(12, 1, 1.2);
  const barMat = new THREE.MeshPhongMaterial({ color: 0xd4af37, shininess: 80 });
  const bar    = new THREE.Mesh(barGeo, barMat);
  bar.position.set(0, 12.5, 0);
  group.add(bar);

  // Glowing star at center of arch
  const starGeo = new THREE.SphereGeometry(1.5, 16, 16);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
  const star    = new THREE.Mesh(starGeo, starMat);
  star.position.set(0, 12.5, 0);
  group.add(star);

  const archLight = new THREE.PointLight(0xffd700, 10, 50);
  archLight.position.set(0, 12.5, 0);
  group.add(archLight);

  group.position.set(endPos.x, -2.5, endPos.z);
  scene.add(group);
}
buildDestinationArch();

/* =============================================
   SCROLL STATE
   ============================================= */
let scrollProgress = 0;
window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  scrollProgress  = Math.min(window.scrollY / maxScroll, 1);
});

/* =============================================
   UI REFERENCES
   ============================================= */
const msIcon      = document.getElementById('msIcon');
const msDate      = document.getElementById('msDate');
const msLocation  = document.getElementById('msLocation');
const msTitle     = document.getElementById('msTitle');
const msDesc      = document.getElementById('msDesc');
const msTags      = document.getElementById('msTags');
const msNumber    = document.getElementById('msNumber');
const progressFill = document.getElementById('progressFill');
const metaLabel    = document.getElementById('metaLabel');
const scrollHint   = document.getElementById('scrollHint');
const compassNeedle = document.getElementById('compassNeedle');
const milestoneCard = document.getElementById('milestoneCard');

/* =============================================
   ISLAND POPUP OVERLAYS
   ============================================= */
const islandPopupsContainer = document.getElementById('islandPopups');
const islandPopupEls = MILESTONES.map((m, i) => {
  const el = document.createElement('div');
  el.className = 'island-popup';
  el.style.setProperty('--accent', m.highlight);
  el.innerHTML = `
    <div class="ip-card">
      <div class="ip-icon">${m.icon}</div>
      <div class="ip-title">${m.title}</div>
      <div class="ip-meta">${m.date}</div>
      <div class="ip-location">${m.location}</div>
      <div class="ip-arrow"></div>
    </div>
  `;
  islandPopupsContainer.appendChild(el);
  return el;
});

const _projVec = new THREE.Vector3();

function updateIslandPopups(nearbyIdx) {
  islands.forEach((island, i) => {
    const el = islandPopupEls[i];
    if (nearbyIdx !== i) {
      el.classList.remove('popup-visible');
      return;
    }
    // Project island orb position (world y ≈ 8) up a bit for tooltip anchor
    _projVec.set(island.islandPos.x, 14, island.islandPos.z);
    _projVec.project(camera);

    // Behind camera — skip
    if (_projVec.z >= 1) { el.classList.remove('popup-visible'); return; }

    const sx = (_projVec.x *  0.5 + 0.5) * window.innerWidth;
    const sy = (_projVec.y * -0.5 + 0.5) * window.innerHeight;

    el.style.left = `${sx}px`;
    el.style.top  = `${sy}px`;
    el.classList.add('popup-visible');
  });
}

/* Build progress dots & labels */
const dotsContainer   = document.getElementById('progressDots');
const labelsContainer = document.getElementById('progressLabels');
const progressDots    = [];

MILESTONES.forEach((m, i) => {
  const dot = document.createElement('div');
  dot.className = 'prog-dot';
  dot.style.setProperty('--color', m.highlight);
  dotsContainer.appendChild(dot);
  progressDots.push(dot);

  const label = document.createElement('span');
  label.className = 'prog-label';
  label.textContent = m.title;
  labelsContainer.appendChild(label);
});

/* =============================================
   MILESTONE DETECTION
   ============================================= */
let currentMilestoneIdx = -1;

/* How close (in scroll-progress units) the boat must be to an island
   for it to count as "arrived". Each milestone gap is ~0.16, so 0.07
   gives a visible window of ~0.14 with small gaps between islands.    */
const ARRIVAL_THRESHOLD = 0.07;

function getNearbyMilestoneIdx(t) {
  for (let i = 0; i < MILESTONES.length; i++) {
    if (Math.abs(t - MILESTONES[i].t) < ARRIVAL_THRESHOLD) return i;
  }
  return -1; // traveling between islands
}

function updateMilestoneCard(idx) {
  if (idx === currentMilestoneIdx) return;
  currentMilestoneIdx = idx;

  milestoneCard.classList.remove('card-visible');

  if (idx === -1) return; // boat is between islands — keep card hidden

  const m = MILESTONES[idx];
  milestoneCard.style.setProperty('--accent', m.highlight);

  setTimeout(() => {
    msIcon.textContent     = m.icon;
    msDate.textContent     = m.date;
    msLocation.textContent = m.location;
    msTitle.textContent    = m.title;
    msDesc.textContent     = m.desc;
    msNumber.textContent   = `${String(idx + 1).padStart(2, '0')} / ${String(MILESTONES.length).padStart(2, '0')}`;

    msTags.innerHTML = m.tags
      .map(tag => `<span class="ms-tag">${tag}</span>`)
      .join('');

    milestoneCard.classList.add('card-visible');
  }, 120);
}

function updateProgressDots(t) {
  const nearbyIdx = getNearbyMilestoneIdx(t);
  progressDots.forEach((dot, i) => {
    const m = MILESTONES[i];
    if (t >= m.t - 0.001) {
      dot.classList.add('active');
      dot.classList.toggle('current', nearbyIdx === i);
    } else {
      dot.classList.remove('active', 'current');
    }
  });
}

/* =============================================
   WAVE ANIMATION HELPER
   ============================================= */
const wavePositions  = waterGeo.attributes.position;
const waveCount      = wavePositions.count;
const waveOriginalY  = new Float32Array(waveCount);

for (let i = 0; i < waveCount; i++) {
  waveOriginalY[i] = wavePositions.getY(i);
}

function animateWaves(t) {
  for (let i = 0; i < waveCount; i++) {
    const x = wavePositions.getX(i);
    const z = wavePositions.getZ(i);
    wavePositions.setY(
      i,
      waveOriginalY[i]
        + Math.sin(x * 0.06 + t * 0.9) * 1.2
        + Math.cos(z * 0.05 + t * 0.7) * 0.8
        + Math.sin((x - z) * 0.04 + t * 1.1) * 0.4
    );
  }
  wavePositions.needsUpdate = true;
  waterGeo.computeVertexNormals();
}

/* =============================================
   GIRL CHARACTER SYSTEM
   Grows from baby → 25-year-old across all milestones
   ============================================= */

const GIRL_STAGES = [
  {
    age: 0,
    label: 'Baby Varsha',
    color: '#FFB6C1',
    glow: 'rgba(255,182,193,0.55)',
    width: 50,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="24" r="14" fill="#F5C5A3"/>
      <path d="M22 14 Q30 7 38 14" stroke="#3D2314" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M17 36 Q30 30 43 36 Q48 51 43 65 Q30 73 17 65 Q12 51 17 36 Z" fill="#FFB6C1"/>
      <path d="M18 58 Q30 64 42 58" stroke="white" stroke-width="2" fill="none" opacity="0.5"/>
      <g class="girl-crawl-a">
        <path d="M17 40 Q10 48 11 58" stroke="#F5C5A3" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="11" cy="59" r="3.3" fill="#F5C5A3"/>
      </g>
      <g class="girl-crawl-b">
        <path d="M43 40 Q50 48 49 58" stroke="#F5C5A3" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="49" cy="59" r="3.3" fill="#F5C5A3"/>
      </g>
      <g class="girl-crawl-b">
        <path d="M22 65 Q18 75 20 86" stroke="#F5C5A3" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="20" cy="88" rx="5" ry="3.3" fill="#FFB6C1"/>
      </g>
      <g class="girl-crawl-a">
        <path d="M38 65 Q42 75 40 86" stroke="#F5C5A3" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="40" cy="88" rx="5" ry="3.3" fill="#FFB6C1"/>
      </g>
    </svg>`
  },
  {
    age: 14,
    label: 'Little Varsha',
    color: '#6EC6F5',
    glow: 'rgba(110,198,245,0.5)',
    width: 56,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="26" r="13" fill="#2C1810"/>
      <path d="M16 24 Q14 32 17 38 Q19 30 18 24 Z" fill="#2C1810"/>
      <path d="M44 24 Q46 32 43 38 Q41 30 42 24 Z" fill="#2C1810"/>
      <circle cx="14" cy="31" r="4" fill="#2C1810"/>
      <path d="M14 34 Q11 43 13 51" stroke="#2C1810" stroke-width="4" fill="none" stroke-linecap="round" class="girl-hair-wind"/>
      <circle cx="46" cy="31" r="4" fill="#2C1810"/>
      <path d="M46 34 Q49 43 47 51" stroke="#2C1810" stroke-width="4" fill="none" stroke-linecap="round" class="girl-hair-wind"/>
      <path d="M20 36 Q30 32 40 36 L42 56 Q42 60 30 60 Q18 60 18 56 Z" fill="#6EC6F5"/>
      <path d="M27 38 L30 41 L33 38 L33 42 L30 44 L27 42 Z" fill="white" opacity="0.6"/>
      <g class="girl-arm-l">
        <path d="M19 38 Q13 46 16 56" stroke="#F5C5A3" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <circle cx="16" cy="57" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M41 38 Q47 46 44 56" stroke="#F5C5A3" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <circle cx="44" cy="57" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="60" width="7" height="30" rx="3.5" fill="#F5C5A3" class="girl-leg-l"/>
      <rect x="31" y="60" width="7" height="30" rx="3.5" fill="#F5C5A3" class="girl-leg-r"/>
      <rect x="21" y="86" width="9" height="4" rx="2" fill="#F5F5F5" opacity="0.85"/>
      <rect x="30" y="86" width="9" height="4" rx="2" fill="#F5F5F5" opacity="0.85"/>
      <ellipse cx="25" cy="93" rx="8" ry="4.3" fill="#3E7CB8"/>
      <ellipse cx="35" cy="93" rx="8" ry="4.3" fill="#3E7CB8"/>
    </svg>`
  },
  {
    age: 17,
    label: 'Teen Varsha',
    color: '#B5A3F5',
    glow: 'rgba(181,163,245,0.5)',
    width: 60,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="24" r="12.5" fill="#2C1810"/>
      <path d="M16 22 Q13 32 18 40 Q20 30 18 22 Z" fill="#2C1810"/>
      <path d="M44 22 Q47 32 42 40 Q40 30 42 22 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M14 24 Q7 34 10 50 Q14 40 15 30 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M20 36 Q30 32 40 36 L42 56 Q42 60 30 60 Q18 60 18 56 Z" fill="#B5A3F5"/>
      <path d="M30 38 L30 58" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      <g class="girl-arm-l">
        <path d="M19 38 Q13 46 16 57" stroke="#F5C5A3" stroke-width="5.3" fill="none" stroke-linecap="round"/>
        <circle cx="16" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M41 38 Q47 46 44 57" stroke="#F5C5A3" stroke-width="5.3" fill="none" stroke-linecap="round"/>
        <circle cx="44" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="60" width="7" height="32" rx="3.5" fill="#F5C5A3" class="girl-leg-l"/>
      <rect x="31" y="60" width="7" height="32" rx="3.5" fill="#F5C5A3" class="girl-leg-r"/>
      <ellipse cx="25" cy="95" rx="8" ry="4.3" fill="#6B4FA0"/>
      <ellipse cx="35" cy="95" rx="8" ry="4.3" fill="#6B4FA0"/>
    </svg>`
  },
  {
    age: 20,
    label: 'Student Varsha',
    color: '#78C5A3',
    glow: 'rgba(120,197,163,0.5)',
    width: 62,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="23" r="12" fill="#2C1810"/>
      <path d="M15 21 Q12 31 17 39 Q19 29 17 21 Z" fill="#2C1810"/>
      <path d="M45 21 Q48 31 43 39 Q41 29 43 21 Z" fill="#2C1810" class="girl-hair-wind"/>
      <circle cx="30" cy="34" r="3.2" fill="#2C1810"/>
      <path d="M30 37 Q26 46 30 56 Q34 46 30 37" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M20 34 Q30 30 40 34 L42 56 Q42 60 30 60 Q18 60 18 56 Z" fill="#78C5A3"/>
      <rect x="23" y="39" width="14" height="15" rx="3" fill="#2E5B44" opacity="0.85"/>
      <path d="M22 34 L20 50" stroke="#3A6B50" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 34 L40 50" stroke="#3A6B50" stroke-width="2" stroke-linecap="round"/>
      <g class="girl-arm-l">
        <path d="M19 36 Q13 46 16 57" stroke="#F5C5A3" stroke-width="5.2" fill="none" stroke-linecap="round"/>
        <circle cx="16" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M41 36 Q47 46 44 57" stroke="#F5C5A3" stroke-width="5.2" fill="none" stroke-linecap="round"/>
        <circle cx="44" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="60" width="7" height="32" rx="3.5" fill="#F5C5A3" class="girl-leg-l"/>
      <rect x="31" y="60" width="7" height="32" rx="3.5" fill="#F5C5A3" class="girl-leg-r"/>
      <ellipse cx="25" cy="95" rx="8" ry="4.3" fill="#2E5B44"/>
      <ellipse cx="35" cy="95" rx="8" ry="4.3" fill="#2E5B44"/>
    </svg>`
  },
  {
    age: 21,
    label: 'Coder Varsha',
    color: '#F5A63B',
    glow: 'rgba(245,166,59,0.5)',
    width: 64,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="24" r="11.5" fill="#2C1810"/>
      <path d="M18 22 Q15 30 19 37 Q21 28 19 22 Z" fill="#2C1810"/>
      <path d="M42 22 Q45 30 41 37 Q39 28 41 22 Z" fill="#2C1810"/>
      <circle cx="30" cy="11" r="4.5" fill="#2C1810"/>
      <path d="M25 13 Q30 9 35 13" stroke="#2C1810" stroke-width="2" fill="none"/>
      <path d="M19 35 Q30 31 41 35 L41 58 Q41 62 30 62 Q19 62 19 58 Z" fill="#F5A63B"/>
      <path d="M22 35 Q26 40 22 46 Q28 43 30 40 Q32 43 38 46 Q34 40 38 35 Q34 38 30 39 Q26 38 22 35" fill="#D9891F" opacity="0.55"/>
      <text x="24" y="55" font-size="6" fill="rgba(255,255,255,0.5)" font-family="monospace">&lt;/&gt;</text>
      <g class="girl-arm-l">
        <path d="M18 37 Q12 47 15 58" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="15" cy="59" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M42 37 Q48 47 45 58" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="45" cy="59" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="61" width="7" height="31" rx="3.5" fill="#22252B" class="girl-leg-l"/>
      <rect x="31" y="61" width="7" height="31" rx="3.5" fill="#22252B" class="girl-leg-r"/>
      <ellipse cx="25" cy="95" rx="8" ry="4.3" fill="#EDEDED"/>
      <ellipse cx="35" cy="95" rx="8" ry="4.3" fill="#EDEDED"/>
    </svg>`
  },
  {
    age: 22,
    label: 'Certified Varsha',
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.55)',
    width: 66,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="23" r="12" fill="#2C1810"/>
      <path d="M17 21 Q14 31 19 39 Q21 29 19 21 Z" fill="#2C1810"/>
      <path d="M43 21 Q46 31 41 39 Q39 29 41 21 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M15 25 Q13 45 15 62 Q18 44 19 27 Z" fill="#2C1810"/>
      <path d="M45 25 Q47 45 45 62 Q42 44 41 27 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M26 11 L30 14 L34 11 L34 15 L30 17 L26 15 Z" fill="#FFD700" opacity="0.85"/>
      <path d="M19 34 Q30 30 41 34 L41 56 Q41 60 30 60 Q19 60 19 56 Z" fill="#F5F5F5"/>
      <path d="M30 40 L30 58" stroke="#ddd" stroke-width="1"/>
      <g class="girl-arm-l">
        <path d="M18 36 Q12 46 15 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="15" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M42 36 Q48 46 45 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="45" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="60" width="7" height="32" rx="3.5" fill="#2B2B40" class="girl-leg-l"/>
      <rect x="31" y="60" width="7" height="32" rx="3.5" fill="#2B2B40" class="girl-leg-r"/>
      <ellipse cx="25" cy="95" rx="8" ry="4.3" fill="#3A3A5C"/>
      <ellipse cx="35" cy="95" rx="8" ry="4.3" fill="#3A3A5C"/>
    </svg>`
  },
  {
    age: 23,
    label: 'Dev Varsha',
    color: '#00CED1',
    glow: 'rgba(0,206,209,0.5)',
    width: 68,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="22" r="11.5" fill="#2C1810"/>
      <path d="M16 20 Q13 30 18 37 Q20 27 18 20 Z" fill="#2C1810"/>
      <path d="M44 20 Q47 30 42 37 Q40 27 42 20 Z" fill="#2C1810" class="girl-hair-wind"/>
      <circle cx="30" cy="9" r="4" fill="#2C1810"/>
      <path d="M15 24 Q13 42 15 58 Q18 42 19 26 Z" fill="#2C1810"/>
      <path d="M45 24 Q47 42 45 58 Q42 42 41 26 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M19 33 Q30 29 41 33 L41 55 Q41 59 30 59 Q19 59 19 55 Z" fill="#00CED1"/>
      <path d="M20 33 L40 58" stroke="#0A6E73" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
      <g class="girl-arm-l">
        <path d="M18 35 Q12 45 14 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M42 35 Q48 45 46 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="46" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="59" width="7" height="33" rx="3.5" fill="#16303A" class="girl-leg-l"/>
      <rect x="31" y="59" width="7" height="33" rx="3.5" fill="#16303A" class="girl-leg-r"/>
      <ellipse cx="25" cy="95" rx="8" ry="4.3" fill="#1A2840"/>
      <ellipse cx="35" cy="95" rx="8" ry="4.3" fill="#1A2840"/>
    </svg>`
  },
  {
    age: 24,
    label: 'Engineer Varsha',
    color: '#7B2FFF',
    glow: 'rgba(123,47,255,0.55)',
    width: 70,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <circle cx="30" cy="22" r="11.5" fill="#2C1810"/>
      <path d="M15 20 Q12 30 17 37 Q19 27 17 20 Z" fill="#2C1810"/>
      <path d="M45 20 Q48 30 43 37 Q41 27 43 20 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M14 23 Q11 42 13 62 Q16 42 18 25 Z" fill="#2C1810"/>
      <path d="M46 23 Q49 42 47 62 Q44 42 42 25 Z" fill="#2C1810" class="girl-hair-wind"/>
      <path d="M19 32 Q30 28 41 32 L41 55 Q41 59 30 59 Q19 59 19 55 Z" fill="#7B2FFF"/>
      <path d="M30 38 L30 57" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <g class="girl-arm-l">
        <path d="M17 34 Q11 44 14 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M43 34 Q49 44 46 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="46" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="22" y="59" width="7" height="33" rx="3.5" fill="#241640" class="girl-leg-l"/>
      <rect x="31" y="59" width="7" height="33" rx="3.5" fill="#241640" class="girl-leg-r"/>
      <ellipse cx="25" cy="95" rx="8" ry="4.3" fill="#3C1888"/>
      <ellipse cx="35" cy="95" rx="8" ry="4.3" fill="#3C1888"/>
    </svg>`
  },
  {
    age: 25,
    label: 'Varsha',
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.65)',
    width: 74,
    svg: `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg" class="girl-char-svg">
      <defs>
        <linearGradient id="dresGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFD700"/>
          <stop offset="100%" stop-color="#FF6B9D"/>
        </linearGradient>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3D2314"/>
          <stop offset="100%" stop-color="#5A3620"/>
        </linearGradient>
      </defs>
      <circle cx="30" cy="21" r="11" fill="url(#hairGrad)"/>
      <path d="M16 15 Q30 5 44 15 Q46 24 40 29 Q30 25 20 29 Q14 24 16 15 Z" fill="url(#hairGrad)"/>
      <ellipse cx="30" cy="9" rx="7.5" ry="5.5" fill="url(#hairGrad)"/>
      <path d="M24 8 Q30 5 36 8" stroke="#2A1710" stroke-width="1" fill="none" opacity="0.4"/>
      <path d="M16 18 Q12 27 16 35" stroke="url(#hairGrad)" stroke-width="3" fill="none" stroke-linecap="round" class="girl-hair-wind"/>
      <path d="M44 18 Q48 27 44 35" stroke="url(#hairGrad)" stroke-width="3" fill="none" stroke-linecap="round" class="girl-hair-wind"/>
      <circle cx="30" cy="28" r="1.3" fill="#FFD700"/>
      <path d="M27 27 Q30 29.5 33 27" stroke="#FFD700" stroke-width="0.8" fill="none" opacity="0.7"/>
      <path d="M19 32 Q30 28 41 32 L39 44 Q30 41 21 44 Z" fill="url(#dresGrad)"/>
      <path d="M21 44 Q30 47.5 39 44 L42 60 Q42 64 30 64 Q18 64 18 60 Z" fill="url(#dresGrad)"/>
      <path d="M21 44 Q30 47.5 39 44" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" fill="none"/>
      <path d="M27 45.5 L30 48.5 L33 45.5 L33 50.5 L30 52.5 L27 50.5 Z" fill="white" opacity="0.6"/>
      <path d="M5 57 L10 55 L8 60 Z" fill="#FFD700" opacity="0.8"/>
      <path d="M52 59 L57 57 L55 62 Z" fill="#FF6B9D" opacity="0.8"/>
      <g class="girl-arm-l">
        <path d="M17 34 Q11 44 14 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <g class="girl-arm-r">
        <path d="M43 34 Q49 44 46 57" stroke="#F5C5A3" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="46" cy="58" r="3" fill="#F5C5A3"/>
      </g>
      <rect x="21" y="64" width="8" height="33" rx="4" fill="#F5C5A3" class="girl-leg-l"/>
      <rect x="31" y="64" width="8" height="33" rx="4" fill="#F5C5A3" class="girl-leg-r"/>
      <ellipse cx="25" cy="98" rx="8.5" ry="4.5" fill="#C0394F"/>
      <ellipse cx="35" cy="98" rx="8.5" ry="4.5" fill="#C0394F"/>
    </svg>`
  },
];

/* ---- DOM refs for girl ---- */
const girlWrapper     = document.getElementById('girlWrapper');
const girlContainer   = document.getElementById('girlContainer');
const girlChar        = document.getElementById('girlChar');
const girlAgeNum      = document.getElementById('girlAgeNum');
const girlNameTag     = document.getElementById('girlNameTag');
const girlGrowthRing  = document.getElementById('girlGrowthRing');
const girlSparkleBurst = document.getElementById('girlSparkleBurst');

let girlCurrentStage = -1;

/* Project world position to screen */
const _girlVec = new THREE.Vector3();

function getBoatScreenPos() {
  // Her standing position in world space (on the glowing water circle)
  _girlVec.copy(boatGroup.position);
  _girlVec.y += 0.3; // stand on the water, just above the glow ring
  _girlVec.project(camera);

  const sx = (_girlVec.x *  0.5 + 0.5) * window.innerWidth;
  const sy = (_girlVec.y * -0.5 + 0.5) * window.innerHeight;
  return { sx, sy, behind: _girlVec.z >= 1 };
}

/* Fire sparkle particles */
function fireSparkles(color) {
  girlSparkleBurst.innerHTML = '';
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'sparkle-particle';
    const angle = (i / count) * Math.PI * 2;
    const dist  = 40 + Math.random() * 40;
    const sx    = Math.cos(angle) * dist;
    const sy    = Math.sin(angle) * dist;
    p.style.cssText = `
      background: ${color};
      box-shadow: 0 0 6px ${color};
      --sx: ${sx}px;
      --sy: ${sy}px;
      animation-delay: ${Math.random() * 0.15}s;
      width: ${4 + Math.random() * 4}px;
      height: ${4 + Math.random() * 4}px;
    `;
    girlSparkleBurst.appendChild(p);
  }
}

/* Fire growth ring */
function fireGrowthRing(color) {
  girlGrowthRing.style.setProperty('--ring-color', color);
  girlGrowthRing.classList.remove('ring-burst');
  void girlGrowthRing.offsetWidth; // reflow
  girlGrowthRing.classList.add('ring-burst');
}

/* Switch to a new growth stage */
function setGirlStage(idx) {
  if (idx === girlCurrentStage) return;
  girlCurrentStage = idx;

  const stage = GIRL_STAGES[idx];

  // Update SVG
  girlChar.innerHTML = stage.svg;
  // Set width to drive scale
  const svgEl = girlChar.querySelector('svg');
  if (svgEl) svgEl.style.width = stage.width + 'px';

  // Update glow filter
  girlChar.style.setProperty('--girl-glow', stage.glow);
  girlChar.style.filter = `drop-shadow(0 8px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 14px ${stage.glow})`;

  // Update labels with pop animation
  girlAgeNum.classList.remove('age-pop');
  void girlAgeNum.offsetWidth;
  girlAgeNum.textContent  = stage.age;
  girlAgeNum.classList.add('age-pop');
  girlNameTag.textContent = stage.label;

  // Final stage special class
  if (idx === GIRL_STAGES.length - 1) {
    girlContainer.classList.add('stage-final');
  } else {
    girlContainer.classList.remove('stage-final');
  }

  // Baby crawls instead of walking — swap the bob timing to match
  girlContainer.classList.toggle('stage-crawling', idx === 0);
  girlNameTag.style.borderColor = stage.color + '55';
  girlNameTag.style.boxShadow   = `0 0 12px ${stage.color}30`;
  girlNameTag.style.color       = '#ffffff';

  // Age badge color
  document.querySelector('.girl-age-badge').style.borderColor = stage.color + '80';

  // Growth effects (skip on initial load)
  if (idx > 0) {
    girlContainer.classList.remove('growing');
    void girlContainer.offsetWidth;
    girlContainer.classList.add('growing');
    girlContainer.addEventListener('animationend', () => {
      girlContainer.classList.remove('growing');
    }, { once: true });

    fireSparkles(stage.color);
    fireGrowthRing(stage.color);
  }
}

/* Map scroll progress → girl stage index */
function getGirlStageIdx(t) {
  // 9 milestones evenly mapped
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (t >= MILESTONES[i].t - 0.001) return i;
  }
  return 0;
}

/* Called every frame from animate() */
function updateGirlCharacter(t) {
  const { sx, sy, behind } = getBoatScreenPos();

  if (behind) {
    girlWrapper.style.opacity = '0';
    return;
  }

  girlWrapper.style.opacity = '1';
  girlWrapper.style.left = sx + 'px';
  girlWrapper.style.top  = (sy - 6) + 'px'; // slightly above boat

  const stageIdx = getGirlStageIdx(scrollProgress);
  setGirlStage(stageIdx);
}

// Initialize first stage immediately
setTimeout(() => setGirlStage(0), 300);

/* =============================================
   MAIN CAMERA STATE
   ============================================= */
const camTarget = new THREE.Vector3();
const camPos    = new THREE.Vector3(0, 14, 28);

/* =============================================
   ANIMATION LOOP
   ============================================= */
const clock = new THREE.Clock();
let hasScrolled = false;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  /* ---- Waves ---- */
  animateWaves(t);

  /* ---- Scroll-driven progress ---- */
  const progress = scrollProgress;

  if (progress > 0.001 && !hasScrolled) {
    hasScrolled = true;
    scrollHint.classList.add('hint-gone');
  }

  /* ---- Girl's position along curve ---- */
  const safeP  = Math.max(0, Math.min(progress, 0.9999));
  const boatPt = curve.getPoint(safeP);
  const tang   = curve.getTangent(safeP);

  // Keep her light-circle on the water surface (add wave height)
  const waterY = Math.sin(boatPt.x * 0.06 + t * 0.9) * 1.2
               + Math.cos(boatPt.z * 0.05 + t * 0.7) * 0.8;

  boatGroup.position.set(boatPt.x, waterY, boatPt.z);

  // Face direction of travel
  const angle = Math.atan2(tang.x, tang.z);
  boatGroup.rotation.y = angle;

  // Glowing walk-circle: slow spin + gentle pulse
  girlGlowCircle.rotation.z = t * 0.3;
  girlGlowRing.rotation.z   = -t * 0.18;
  const glowPulse = 0.26 + 0.1 * Math.sin(t * 1.6);
  girlGlowCircle.material.opacity = glowPulse;
  girlGlowRing.material.opacity   = glowPulse + 0.2;

  /* ---- Wake trail ---- */
  if (Math.abs(progress - lastProg) > 0.001) {
    wakePos[wakeIndex * 3]     = boatPt.x;
    wakePos[wakeIndex * 3 + 1] = waterY + 0.3;
    wakePos[wakeIndex * 3 + 2] = boatPt.z;
    wakeIndex = (wakeIndex + 1) % WAKE_COUNT;
    wakeGeo.attributes.position.needsUpdate = true;
    lastProg = progress;
  }

  /* ---- Camera follow (smooth lerp) ---- */
  // Offset: behind the boat, elevated
  const behindOffset = new THREE.Vector3(-tang.x * 22, 13, -tang.z * 22);
  const idealCamPos  = boatPt.clone().add(behindOffset);
  camPos.lerp(idealCamPos, 0.04);
  camera.position.copy(camPos);

  const lookTarget = boatPt.clone().add(new THREE.Vector3(tang.x * 8, 2, tang.z * 8));
  camTarget.lerp(lookTarget, 0.04);
  camera.lookAt(camTarget);

  /* ---- Bioluminescence drift ---- */
  bioParticles.rotation.y = t * 0.006;

  /* ---- Island beacon pulse ---- */
  islands.forEach((island, i) => {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.1);
    island.beaconLight.intensity = 5 + pulse * 6;
    island.orb.scale.setScalar(1 + pulse * 0.15);
  });

  /* ---- Path tube glow ---- */
  tubeMat.opacity = 0.25 + 0.1 * Math.sin(t * 1.5);

  /* ---- Milestone UI ---- */
  const activeIdx = getNearbyMilestoneIdx(progress);
  updateMilestoneCard(activeIdx);
  updateIslandPopups(activeIdx);
  updateProgressDots(progress);
  progressFill.style.width = `${progress * 100}%`;

  /* ---- Meta label ---- */
  metaLabel.textContent = `${Math.round(progress * 100)}% of journey`;

  /* ---- Compass needle (direction of travel) ---- */
  const compassDeg = -angle * (180 / Math.PI);
  if (compassNeedle) compassNeedle.style.transform = `rotate(${compassDeg}deg)`;

  /* ---- Girl character ---- */
  updateGirlCharacter(t);

  renderer.render(scene, camera);
}

animate();

/* Show initial milestone card (journey starts at island 0) */
setTimeout(() => { currentMilestoneIdx = -1; updateMilestoneCard(0); }, 600);

/* =============================================
   RESIZE
   ============================================= */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
