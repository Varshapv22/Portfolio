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
    date: '1995',
    location: 'Your Hometown',
    icon: '🌟',
    color: 0xffd700,
    highlight: '#ffd700',
    desc: 'The voyage begins. A new soul sets sail on the ocean of life, full of wonder and possibility.',
    tags: ['Day 1', 'New Beginning'],
  },
  {
    t: 0.16,
    title: 'Childhood',
    date: '1998 – 2006',
    location: 'Home & Neighbourhood',
    icon: '🏡',
    color: 0x22c55e,
    highlight: '#22c55e',
    desc: 'Carefree days of play, discovery, and first friendships. Every day was a new adventure on familiar shores.',
    tags: ['Family', 'First Friends', 'Play'],
  },
  {
    t: 0.33,
    title: 'School',
    date: '2006 – 2013',
    location: 'Your School Name',
    icon: '📚',
    color: 0x00d4ff,
    highlight: '#00d4ff',
    desc: 'The compass of knowledge begins to point the way. Learning, growing, and finding the first glimpses of passion.',
    tags: ['Education', 'Curiosity', 'Growth'],
  },
  {
    t: 0.5,
    title: 'University',
    date: '2013 – 2017',
    location: 'Your University Name',
    icon: '🎓',
    color: 0x7b2fff,
    highlight: '#7b2fff',
    desc: 'Sailing into deeper waters. Pursuing a degree, building skills, and charting a course for the future.',
    tags: ['Degree', 'Independence', 'Vision'],
  },
  {
    t: 0.66,
    title: 'First Job',
    date: '2017 – 2019',
    location: 'Your First Company',
    icon: '💼',
    color: 0xff6b6b,
    highlight: '#ff6b6b',
    desc: 'Stepping onto a new deck. The real world opens up — challenges, victories, and invaluable lessons learned.',
    tags: ['Career Start', 'Real World', 'Learning'],
  },
  {
    t: 0.83,
    title: 'Career',
    date: '2019 – Present',
    location: 'Your Current Company',
    icon: '🚀',
    color: 0x00d4ff,
    highlight: '#00d4ff',
    desc: 'Full sail ahead. Building, creating, and making a lasting impact. The journey accelerates toward the horizon.',
    tags: ['Growth', 'Leadership', 'Impact'],
  },
  {
    t: 1.0,
    title: 'Destination',
    date: '2024+',
    location: 'The Future',
    icon: '✨',
    color: 0xffd700,
    highlight: '#ffd700',
    desc: 'The horizon stretches endlessly forward. New ports await, new adventures beckon, and the best chapters are still to be written.',
    tags: ['Future', 'Dreams', 'Infinite'],
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
   BOAT
   ============================================= */
function buildBoat() {
  const group = new THREE.Group();

  // Hull
  const hullGeo = new THREE.BoxGeometry(5, 1.2, 2.2);
  const hullMat = new THREE.MeshPhongMaterial({ color: 0x5c3d2e, shininess: 60 });
  const hull    = new THREE.Mesh(hullGeo, hullMat);
  hull.position.y = 0.6;
  hull.castShadow = true;
  group.add(hull);

  // White trim stripe
  const trimGeo = new THREE.BoxGeometry(5.1, 0.15, 2.3);
  const trimMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const trim    = new THREE.Mesh(trimGeo, trimMat);
  trim.position.y = 1.15;
  group.add(trim);

  // Deck
  const deckGeo = new THREE.BoxGeometry(4.7, 0.12, 2.0);
  const deckMat = new THREE.MeshPhongMaterial({ color: 0xa0704a, shininess: 40 });
  const deck    = new THREE.Mesh(deckGeo, deckMat);
  deck.position.y = 1.25;
  deck.castShadow = true;
  group.add(deck);

  // Cabin
  const cabinGeo = new THREE.BoxGeometry(1.8, 1.0, 1.6);
  const cabinMat = new THREE.MeshPhongMaterial({ color: 0xf0ece4 });
  const cabin    = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.6, 1.8, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // Cabin roof
  const roofGeo = new THREE.BoxGeometry(2.0, 0.12, 1.8);
  const roofMat = new THREE.MeshPhongMaterial({ color: 0x5c3d2e });
  const roof    = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(-0.6, 2.36, 0);
  group.add(roof);

  // Mast
  const mastGeo = new THREE.CylinderGeometry(0.07, 0.09, 7, 8);
  const mastMat = new THREE.MeshPhongMaterial({ color: 0x6b4c36 });
  const mast    = new THREE.Mesh(mastGeo, mastMat);
  mast.position.set(1.0, 4.85, 0);
  mast.castShadow = true;
  group.add(mast);

  // Main sail (triangle)
  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0);
  sailShape.lineTo(3.0, 0);
  sailShape.lineTo(0, 5.5);
  sailShape.closePath();
  const sailGeo = new THREE.ShapeGeometry(sailShape);
  const sailMat = new THREE.MeshPhongMaterial({
    color: 0xf5f0e8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    shininess: 20,
  });
  const sail = new THREE.Mesh(sailGeo, sailMat);
  sail.position.set(1.05, 1.35, 0.05);
  sail.castShadow = true;
  group.add(sail);

  // Boom (horizontal spar)
  const boomGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.5, 8);
  const boomMat = new THREE.MeshPhongMaterial({ color: 0x6b4c36 });
  const boom    = new THREE.Mesh(boomGeo, boomMat);
  boom.rotation.z = Math.PI / 2;
  boom.position.set(2.5, 1.45, 0);
  group.add(boom);

  // Flag at mast top
  const flagGeo = new THREE.PlaneGeometry(0.8, 0.5);
  const flagMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, side: THREE.DoubleSide });
  const flag    = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(1.45, 8.4, 0);
  group.add(flag);

  // Lantern (warm point light)
  const lanternGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
  const lantern    = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.set(-1.8, 2.0, 0);
  group.add(lantern);

  const boatLight = new THREE.PointLight(0xffcc44, 4, 18);
  boatLight.position.set(-1.8, 2.0, 0);
  group.add(boatLight);

  // Front bow light (cyan — navigation light)
  const bowLightGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const bowLightMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
  const bowLight    = new THREE.Mesh(bowLightGeo, bowLightMat);
  bowLight.position.set(2.5, 1.4, 0);
  group.add(bowLight);

  const bowPointLight = new THREE.PointLight(0x00ffcc, 2, 12);
  bowPointLight.position.set(2.5, 1.4, 0);
  group.add(bowPointLight);

  return { group, flag };
}

const { group: boatGroup, flag: boatFlag } = buildBoat();
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

  /* ---- Boat position along curve ---- */
  const safeP  = Math.max(0, Math.min(progress, 0.9999));
  const boatPt = curve.getPoint(safeP);
  const tang   = curve.getTangent(safeP);

  // Place boat on water surface (add wave height)
  const waterY = Math.sin(boatPt.x * 0.06 + t * 0.9) * 1.2
               + Math.cos(boatPt.z * 0.05 + t * 0.7) * 0.8;

  boatGroup.position.set(boatPt.x, waterY, boatPt.z);

  // Boat heading (face direction of travel)
  const angle = Math.atan2(tang.x, tang.z);
  boatGroup.rotation.y = angle;

  // Gentle roll & pitch with waves
  boatGroup.rotation.z = Math.sin(t * 1.1) * 0.04;
  boatGroup.rotation.x = Math.sin(t * 0.8 + 1.0) * 0.025;

  // Flag animation
  if (boatFlag) boatFlag.rotation.y = Math.sin(t * 3) * 0.4;

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

  renderer.render(scene, camera);
}

animate();

/* Show initial milestone card (boat starts at island 0) */
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
