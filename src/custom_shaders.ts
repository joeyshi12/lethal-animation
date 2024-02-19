import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0.8, 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x689DAB);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.8, 0)
controls.update();

const light = new THREE.PointLight(0xFFFFFF, 80);
light.position.set(-2, 3, 2);
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light, 0.5, 0xffff00);
scene.add(lightHelper);

const boxGeometry = new THREE.BoxGeometry(1, 0.05, 1);
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x444444});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.setY(-0.02);
scene.add(box)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const FRAME_PERIOD = 1 / 60;
let prevTime = 0;
let mixer: THREE.AnimationMixer;
let currentClipIndex = 0;

function initGui(shayGltf: GLTF) {
    const gui = new GUI();
    const emoteFolder = gui.addFolder("Emotes");
    const emoteOptions: any = {};
    for (let i = 0; i < shayGltf.animations.length; i++) {
        const animation = shayGltf.animations[i];
        emoteOptions[animation.name] = createPlayEmoteCallback(shayGltf, i);
        emoteFolder.add(emoteOptions, animation.name);
    }
    emoteFolder.open();
}

function createPlayEmoteCallback(shayGltf: GLTF, clipIndex: number) {
    return () => {
        const currentAction = mixer.clipAction(shayGltf.animations[currentClipIndex]);
        const nextAction = mixer.clipAction(shayGltf.animations[clipIndex]);
        currentAction.crossFadeTo(nextAction, 0.25, false);
        nextAction.clampWhenFinished = true;
        nextAction.reset().setLoop(THREE.LoopOnce, 1).play();
        currentClipIndex = clipIndex;
    }
}

async function loadModels(): Promise<GLTF[]> {
    const gltfLoader = new GLTFLoader();
    const [shayGltf] = await Promise.all([
        await gltfLoader.loadAsync("../models/shay.glb"),
    ]);
    return [shayGltf];
}

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
    mixer.clipAction(shayGltf.animations[currentClipIndex]).reset().play();
    initGui(shayGltf);
    animate(0);
});
