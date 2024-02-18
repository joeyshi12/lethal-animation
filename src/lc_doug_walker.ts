import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

async function loadModels(): Promise<GLTF[]> {
    const gltfLoader = new GLTFLoader();
    const [scavengerGltf] = await Promise.all([
        await gltfLoader.loadAsync("../models/lc_doug_walker.glb")
    ]);
    return [scavengerGltf];
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-1.8, 1.2, 0.8);
camera.lookAt(new THREE.Vector3(0, 1, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
        console.log(camera.rotation);
    }
    requestAnimationFrame(animate);
}

loadModels().then(([scavengerGltf]) => {
    scene.add(scavengerGltf.scene);
    mixer = new THREE.AnimationMixer(scavengerGltf.scene);
    const clips = scavengerGltf.animations;
    mixer.clipAction(clips[0]).play();
    animate(0);
});
