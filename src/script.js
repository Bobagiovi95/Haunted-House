import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/examples/jsm/Addons.js";

// ==============================================
//              Elementi di Base
// ==============================================

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// ==============================================
//              Texture
// ==============================================

const textureLoader = new THREE.TextureLoader();

// Floor

const floor_alpha = textureLoader.load("/floor/alpha.jpg");
const floor_ARM = textureLoader.load("./floor/brown_mud_leaves_01_arm_1k.png");
const floor_diff = textureLoader.load(
  "./floor/brown_mud_leaves_01_diff_1k.webp"
);
const floor_disp = textureLoader.load(
  "./floor/brown_mud_leaves_01_disp_1k.webp"
);
const floor_normal = textureLoader.load(
  "./floor/brown_mud_leaves_01_nor_gl_1k.webp"
);

floor_diff.colorSpace = THREE.SRGBColorSpace;
floor_diff.repeat.set(8, 8);
floor_diff.wrapS = THREE.RepeatWrapping;
floor_diff.wrapT = THREE.RepeatWrapping;

floor_ARM.colorSpace = THREE.SRGBColorSpace;
floor_ARM.repeat.set(8, 8);
floor_ARM.wrapS = THREE.RepeatWrapping;
floor_ARM.wrapT = THREE.RepeatWrapping;

floor_disp.colorSpace = THREE.SRGBColorSpace;
floor_disp.repeat.set(8, 8);
floor_disp.wrapS = THREE.RepeatWrapping;
floor_disp.wrapT = THREE.RepeatWrapping;

floor_normal.colorSpace = THREE.SRGBColorSpace;
floor_normal.repeat.set(8, 8);
floor_normal.wrapS = THREE.RepeatWrapping;
floor_normal.wrapT = THREE.RepeatWrapping;

// Walls
const wall_diff = textureLoader.load("./walls/rock_wall_10_diff_2k.webp");
const wall_arm = textureLoader.load("./walls/rock_wall_10_arm_2k.webp");
const wall_disp = textureLoader.load("./walls/rock_wall_10_disp_2k.webp");
const wall_norm = textureLoader.load("./walls/rock_wall_10_norm_dx_2k.webp");

wall_diff.colorSpace = THREE.SRGBColorSpace;
wall_diff.repeat.set(2, 2);
wall_diff.wrapS = THREE.RepeatWrapping;
wall_diff.wrapT = THREE.RepeatWrapping;

wall_arm.repeat.set(2, 2);
wall_arm.wrapS = THREE.RepeatWrapping;
wall_arm.wrapT = THREE.RepeatWrapping;

wall_disp.repeat.set(2, 2);
wall_disp.wrapS = THREE.RepeatWrapping;
wall_disp.wrapT = THREE.RepeatWrapping;

wall_norm.repeat.set(2, 2);
wall_norm.wrapS = THREE.RepeatWrapping;
wall_norm.wrapT = THREE.RepeatWrapping;

// Roof
const roof_diff = textureLoader.load("./roof/roof_tiles_14_diff_1k.webp");
const roof_arm = textureLoader.load("./roof/roof_tiles_14_arm_1k.webp");
const roof_disp = textureLoader.load("./roof/roof_tiles_14_disp_1k.webp");
const roof_norm = textureLoader.load("./roof/roof_tiles_14_nor_gl_1k.webp");

roof_diff.colorSpace = THREE.SRGBColorSpace;
roof_diff.repeat.set(3, 1);
roof_diff.wrapS = THREE.RepeatWrapping;
roof_diff.wrapT = THREE.RepeatWrapping;

roof_arm.repeat.set(3, 1);
roof_arm.wrapS = THREE.RepeatWrapping;
roof_arm.wrapT = THREE.RepeatWrapping;

roof_disp.repeat.set(3, 1);
roof_disp.wrapS = THREE.RepeatWrapping;
roof_disp.wrapT = THREE.RepeatWrapping;

roof_norm.repeat.set(3, 1);
roof_norm.wrapS = THREE.RepeatWrapping;
roof_norm.wrapT = THREE.RepeatWrapping;

// bushes
const bush_diff = textureLoader.load(
  "./bushes/leaves_forest_ground_diff_1k.webp"
);
const bush_arm = textureLoader.load(
  "./bushes/leaves_forest_ground_arm_1k.webp"
);
const bush_norm = textureLoader.load(
  "./bushes/leaves_forest_ground_nor_gl_1k.webp"
);

bush_diff.colorSpace = THREE.SRGBColorSpace;
bush_diff.repeat.set(2, 2);
bush_diff.wrapS = THREE.RepeatWrapping;
bush_diff.wrapT = THREE.RepeatWrapping;

bush_arm.repeat.set(2, 2);
bush_arm.wrapS = THREE.RepeatWrapping;
bush_arm.wrapT = THREE.RepeatWrapping;

bush_norm.repeat.set(2, 2);
bush_norm.wrapS = THREE.RepeatWrapping;
bush_norm.wrapT = THREE.RepeatWrapping;

// graves
const grave_diff = textureLoader.load("./grave/defense_wall_diff_1k.webp");
const grave_arm = textureLoader.load("./grave/defense_wall_arm_1k.webp");
const grave_norm = textureLoader.load("./grave/defense_wall_nor_gl_1k.webp");

const repX = 1;
const repY = 1;

grave_diff.colorSpace = THREE.SRGBColorSpace;
grave_diff.repeat.set(repX, repY);
grave_diff.wrapS = THREE.RepeatWrapping;
grave_diff.wrapT = THREE.RepeatWrapping;

grave_arm.repeat.set(repX, repY);
grave_arm.wrapS = THREE.RepeatWrapping;
grave_arm.wrapT = THREE.RepeatWrapping;

grave_norm.repeat.set(repX, repY);
grave_norm.wrapS = THREE.RepeatWrapping;
grave_norm.wrapT = THREE.RepeatWrapping;

// door

const door_alpha = textureLoader.load("./door/alpha.webp");
const door_ao = textureLoader.load("./door/ambientOcclusion.webp");
const door_color = textureLoader.load("./door/color.webp");
const door_height = textureLoader.load("./door/height.webp");
const door_metalness = textureLoader.load("./door/metalness.webp");
const door_normal = textureLoader.load("./door/normal.webp");
const door_roughness = textureLoader.load("./door/roughness.webp");

door_color.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */

// Group HOUSE

const houseGroup = new THREE.Group();

scene.add(houseGroup);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: floor_alpha,
    map: floor_diff,
    aoMap: floor_ARM,
    roughnessMap: floor_ARM,
    metalnessMap: floor_ARM,
    normalMap: floor_normal,
    displacementMap: floor_disp,
    displacementScale: 0.7,
    displacementBias: -0.07,
  })
);

floor.rotation.x = -Math.PI / 2;

houseGroup.add(floor);
gui
  .add(floor.material, "displacementScale", 0, 1, 0.001)
  .name("Floor Displacement Scale");
gui
  .add(floor.material, "displacementBias", -1, 1, 0.001)
  .name("Floor Displacement Bias");

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wall_diff,
    aoMap: wall_arm,
    roughnessMap: wall_arm,
    metalnessMap: wall_arm,
    normalMap: wall_norm,
    roughness: 0.3,
    metalness: 0.1,
  })
);

walls.position.y += 2.5 / 2;

houseGroup.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    color: "#ff0000",
    map: roof_diff,
    aoMap: roof_arm,
    roughnessMap: roof_arm,
    metalnessMap: roof_arm,
    normalMap: roof_norm,
    roughness: 1,
    metalness: 0.1,
    // displacementMap: roof_disp,
    // displacementScale: 0.7,
    // displacementBias: 0.07
  })
);

roof.position.y += 2.5 + 1.5 / 2;
roof.rotation.y = Math.PI / 4;

houseGroup.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 32, 32),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: door_alpha,
    map: door_color,
    aoMap: door_ao,
    displacementMap: door_height,
    displacementScale: 0.15,
    displacementBias: -0.04,
    metalnessMap: door_metalness,
    normalMap: door_normal,
    roughness: door_roughness,
  })
);

// door.material.color = new THREE.Color('red')
door.position.y = 1;
door.position.z = 2 + 0.001;

houseGroup.add(door);

// Bushes - Cespugli
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bush_diff,
  aoMap: bush_arm,
  roughnessMap: bush_arm,
  metalnessMap: bush_arm,
  normalMap: bush_norm,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.setScalar(0.5);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.setScalar(0.25);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.scale.setScalar(0.4);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.setScalar(0.15);
bush4.rotation.x = -0.75;

houseGroup.add(bush1, bush2, bush3, bush4);

// Grave
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  // color: '#ccffcc',
  map: grave_diff,
  aoMap: grave_arm,
  roughnessMap: grave_arm,
  metalnessMap: grave_arm,
  normalMap: grave_norm,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const x = Math.sin(angle);
  const z = Math.cos(angle);
  grave.position.y = Math.random() * 0.4;
  grave.position.x = x * radius;
  grave.position.z = z * radius;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

// ==============================================
//              Lights
// ==============================================

// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 4);
doorLight.position.set(0, 2.2, 2.5);
houseGroup.add(doorLight);

const doorLightHelper = new THREE.PointLightHelper(doorLight);
// houseGroup.add(doorLightHelper)

// Ghost Lights
const ghostLight_1 = new THREE.PointLight("blue", 5);
const ghostLight_2 = new THREE.PointLight("purple", 5);
const ghostLight_3 = new THREE.PointLight("#ff0088", 6);

// ghostLight_1.position.set(-6, 0, 0)
// ghostLight_2.position.set(5, 0, 0)

scene.add(ghostLight_1, ghostLight_2, ghostLight_3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ==============================================
//              CAMERA
// ==============================================

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 18;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 22;
controls.minDistance = 4;
controls.maxPolarAngle = Math.PI / 2.2;

// ==============================================
//              Audio
// ==============================================

const listener = new THREE.AudioListener();
scene.add(listener);

const audioSource = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load("./audio/tadepole.mp3", function (buffer) {
  audioSource.setBuffer(buffer);
  audioSource.setLoop(true);
  audioSource.setVolume(0.2);
});

// Funzione per attivare l'audio al primo click
function enableAudioContext() {
  audioSource.play(); // Avvia l'audio solo dopo che il contesto è stato ripreso

  // Rimuovi l'event listener perché non è più necessario dopo il primo click
  window.removeEventListener("click", enableAudioContext);
}

// Aggiungi il listener per il primo click
window.addEventListener("click", enableAudioContext);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ==============================================
//              SHADOWS
// ==============================================

directionalLight.castShadow = true;
ghostLight_1.castShadow = true;
ghostLight_2.castShadow = true;
ghostLight_3.castShadow = true;

floor.receiveShadow = true;
roof.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;

for (const grave of graves.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping

directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.left = -8;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// scene.add(directionalLightCameraHelper)

ghostLight_1.shadow.mapSize.width = 256;
ghostLight_1.shadow.mapSize.height = 256;
ghostLight_1.shadow.camera.far = 20;

ghostLight_2.shadow.mapSize.width = 256;
ghostLight_2.shadow.mapSize.height = 256;
ghostLight_2.shadow.camera.far = 20;

ghostLight_3.shadow.mapSize.width = 256;
ghostLight_3.shadow.mapSize.height = 256;
ghostLight_3.shadow.camera.far = 20;

// ==============================================
//              Sky
// ==============================================

const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

// ==============================================
//              Fog
// ==============================================

scene.fog = new THREE.FogExp2("#0a343f", 0.1);

// ==============================================
//              Animation
// ==============================================

const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Animate Ghost Lights
  const angle_1 = elapsedTime * 0.3;
  ghostLight_1.position.x = Math.sin(angle_1) * 4.5;
  ghostLight_1.position.z = Math.cos(angle_1) * 4.5;
  ghostLight_1.position.y =
    Math.sin(angle_1) * Math.sin(angle_1 * 2.34) * Math.sin(angle_1 * 1.22);

  const angle_2 = -elapsedTime * 0.1;
  ghostLight_2.position.x = Math.sin(angle_2) * 6;
  ghostLight_2.position.z = Math.cos(angle_2) * 6;
  ghostLight_2.position.y = Math.sin(elapsedTime * -1);

  const angle_3 = elapsedTime * 0.1;
  ghostLight_3.position.x = Math.sin(angle_3) * 7;
  ghostLight_3.position.z = Math.cos(angle_3) * 7;
  ghostLight_3.position.y =
    Math.sin(elapsedTime * -1) * Math.sin(angle_1 * 2.34);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
