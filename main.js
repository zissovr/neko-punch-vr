import './style.css'
import * as THREE from "three";
import { GLTFLoader } from './GLTFLoader';
// import modelGltf from './NekoPunchForThree.glb'


//Canvas
const canvas = document.querySelector(".webgl");

let scene, camera, renderer, controls;

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};


//Scene
scene = new THREE.Scene();


//Material
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});


//Mesh
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.1), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.1, 0.35, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1), material);


//Place for rotation
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];


//Camera
camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 6;
scene.add(camera);


//Renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


//Particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
);

//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.025,
    color: "#3c94d7",
});

//Mesh
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);


//Add light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight("#ffffff", 2);
directionalLight2.position.set(-2, 1, 1);
scene.add(directionalLight2);


//Resize browser
window.addEventListener("resize", () => {
  //Update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});


//Mouse wheel operation
let wheelSpeed = 0;
let rotation = 0;
window.addEventListener("wheel", (event) => {
  wheelSpeed += event.deltaY * 0.0002;
});

function objectRotation() {
  rotation += wheelSpeed;
  wheelSpeed *= 0.93;
  
  //Rotate the whole
  mesh1.position.x = 2 + 4 * Math.cos(rotation);
  mesh1.position.z = -3 + 4 * Math.sin(rotation);
  mesh2.position.x = 2 + 4 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 4 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 4 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 4 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 4 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 4 * Math.sin(rotation + 3 * (Math.PI / 2));

  window.requestAnimationFrame(objectRotation);
}
objectRotation();


//Get cursor position
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});


//GLTFLoader
const loader = new GLTFLoader();

// const glbModel = await loader.loadAsync("./images/NekoPunchForThree.glb");
// glbModel.scene.position.set(1.5, -1, 0);
// const model = glbModel.scene;
// scene.add(model);
// function gltfAnimate() {
//   requestAnimationFrame(gltfAnimate);
//   model.rotation.y -= 0.005;
//   renderer.render(scene, camera);
// }
// gltfAnimate();


// const awaitModel = fetch("NekoPunchForThree.gltf").then(response =>
//   loader.load(response.url, (gltf) => {
//     gltf.scene.position.set(1.5, -1, 0);
//     const model = gltf.scene;
//     scene.add(model);
//     function gltfAnimate() {
//       requestAnimationFrame(gltfAnimate);
//       model.rotation.y -= 0.005;
//       renderer.render(scene, camera);
//     }
//     gltfAnimate();
//   })
// );


const url = "./NekoPunchForThree.glb";
// const url = modelGltf;
let model = null;
loader.load(url, function (gltf) {
  gltf.scene.position.set(1.5, -1, 0);
  model = gltf.scene;
  scene.add(model);
  function gltfAnimate() {
    requestAnimationFrame(gltfAnimate);
    model.rotation.y -= 0.005;
    renderer.render(scene, camera);
  }
  gltfAnimate();
  }
)


//Animation
const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);

  let getDeltaTime = clock.getDelta();

  //Rotate mesh
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime * 2;
    mesh.rotation.y += 0.1 * getDeltaTime * 2;
  }

  //Camera control
  camera.position.x += cursor.x * getDeltaTime * 1.5;
  camera.position.y += -cursor.y * getDeltaTime * 1.5;

  window.requestAnimationFrame(animate);
}

animate();