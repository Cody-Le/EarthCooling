import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
function init(){	
  scene = new THREE.Scene();
	scene.backgroundColor = new THREE.Color(0xdddddd);
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 50);
	let hlight = new THREE.AmbientLight(0x404040, 100);
	scene.add(hlight)

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	let loader = new GLTFLoader();
	loader.load("/EarthSphereModel.gltf", function(gltf){
    console.log(gltf)
		scene.add(gltf.scene);
		renderer.render(scene, camera);
	})

}
init();
