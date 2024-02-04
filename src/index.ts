import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

async function loadModels(): Promise<GLTF[]> {
    const gltfLoader = new GLTFLoader();
    const [scavengerGltf, microwaveGltf] = await Promise.all([
        await gltfLoader.loadAsync("models/pointing_scavenger.glb"),
        await gltfLoader.loadAsync("models/microwave.glb")
    ]);
    scavengerGltf.scene.position.set(-0.3, 0.3, 0);
    microwaveGltf.scene.scale.set(0.7, 0.7, 0.7);
    microwaveGltf.scene.rotateY(Math.PI / 2);
    return [scavengerGltf, microwaveGltf];
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
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

let mixer: THREE.AnimationMixer;
let scavenger: GLTF; 

function animate(time: number) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mixer.update(0.01);
    scavenger.scene.rotateY(0.02);
}

loadModels().then(([scavengerGltf, microwaveGltf]) => {
    scavenger = scavengerGltf;
    scene.add(scavengerGltf.scene);
    scene.add(microwaveGltf.scene);
    mixer = new THREE.AnimationMixer(scavengerGltf.scene);
    const clips = scavengerGltf.animations;
    mixer.clipAction(clips[0]).play();
    animate(0);
});
