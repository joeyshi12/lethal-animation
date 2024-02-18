import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

async function loadModels(): Promise<GLTF[]> {
    const gltfLoader = new GLTFLoader();
    const [shayGltf] = await Promise.all([
        await gltfLoader.loadAsync("../models/shay.glb"),
    ]);
    return [shayGltf];
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1, 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x689DAB);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement)

const light = new THREE.PointLight(0xFFFFFF, 100);
light.position.set(-6, 4, 4);
scene.add(light);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const FRAME_PERIOD = 1 / 60;
let prevTime = 0;
let mixer: THREE.AnimationMixer;

function animate(time: number) {
    const deltaTime = time - prevTime;
    if (deltaTime > FRAME_PERIOD) {
        renderer.render(scene, camera);
        mixer.update(0.015);
        prevTime = time;
    }
    requestAnimationFrame(animate);
}

loadModels().then(([shayGltf]) => {
    scene.add(shayGltf.scene);
    mixer = new THREE.AnimationMixer(shayGltf.scene);
    const clips = shayGltf.animations;
    mixer.clipAction(clips[2]).play();
    animate(0);
});
