import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(-1.8, 1.2, 0.8);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();
scene.add(camera);

const light = new THREE.PointLight(0xFFFFFF, 20);
light.position.set(-2, 4, -2);
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light, 0.5, 0xffff00);
scene.add(lightHelper);

const grid = new THREE.GridHelper(40, 40, 0x444444, 0x444444);
scene.add(grid);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let mixer: THREE.AnimationMixer;
let scavengerGltf: GLTF;

function initGui() {
    const gui = new GUI();
    const suitColorFolder = gui.addFolder("Textures");
    const suitColorOptions = {
        "Orange": createScavengerTextureUpdateCallback("../textures/ScavengerPlayerModel.png"),
        "Green": createScavengerTextureUpdateCallback("../textures/ScavengerSuitGreen.png"),
        "Purple": createScavengerTextureUpdateCallback("../textures/ScavengerSuitPurple.png"),
        "Yellow": createScavengerTextureUpdateCallback("../textures/ScavengerSuitYellow.png"),
        "Mario": createScavengerTextureUpdateCallback("../textures/Mario.png")
    };
    for (const key in suitColorOptions) {
        suitColorFolder.add(suitColorOptions, <any>key);
    }
    suitColorFolder.open();
}

function createScavengerTextureUpdateCallback(texturePath: string) {
    return () => {
        const texture = new THREE.TextureLoader().load(texturePath);
        texture.flipY = false;
        const material = new THREE.MeshToonMaterial({map: texture});
        scavengerGltf.scene.traverse((child: any) => {
            if (child.isMesh) {
                child.material = material;
            }
        });
    }
}

async function loadModels(): Promise<GLTF[]> {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const [scavengerGltf, terminalGltf, scavengerTexture] = await Promise.all([
        gltfLoader.loadAsync("../models/lc_doug_walker.glb"),
        gltfLoader.loadAsync("../models/lc_terminal.glb"),
        textureLoader.loadAsync("../textures/ScavengerPlayerModel.png")
    ]);
    scavengerTexture.flipY = false;
    const material = new THREE.MeshToonMaterial({map: scavengerTexture});
    scavengerGltf.scene.traverse((child: any) => {
        if (child.isMesh) {
            child.material = material;
        }
    });
    return [scavengerGltf, terminalGltf];
}

function animate() {
    renderer.render(scene, camera);
    mixer.update(clock.getDelta());
    requestAnimationFrame(animate);
}

loadModels().then(([scavenger, terminal]) => {
    document.getElementById("loader-container")?.remove();
    document.body.appendChild(renderer.domElement);

    scavengerGltf = scavenger;
    scene.add(scavenger.scene);
    scene.add(terminal.scene);
    mixer = new THREE.AnimationMixer(scavenger.scene);
    const clips = scavenger.animations;
    mixer.clipAction(clips[0]).play();

    initGui()
    animate();
});
