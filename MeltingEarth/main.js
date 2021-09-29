import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

let scene, camera, renderer, sphere;
let x = 1;



function setx(value){
	x = value
}


function init(){	
  	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xff9966);
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 50);
	camera.rotation.y = 45/180 * Math.PI;
	camera.position.x = 30;
	camera.position.y = 10;
	camera.position.z = 20;


	
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth -100, window.innerHeight - 100);
	document.body.appendChild(renderer.domElement);

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	function animate() {
		x += 0.00001
		sphere.scale.set( x, x,x)
		console.log(x)
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera)
		
	}


	let hlight = new THREE.AmbientLight(0x121008, 30);
	let directionalLight = new THREE.DirectionalLight(0x555555, 10);
	directionalLight.position.set(0,100,0);
	directionalLight.castShadow =true;
	scene.add(hlight)
	//scene.add(directionalLight)


	let directionalLight2 = new THREE.DirectionalLight(0x555555, 10);
	directionalLight2.position.set(0,-100,0);

	//scene.add(hlight)
	//scene.add(directionalLight2)

	





	let loader = new GLTFLoader();
	loader.load("/EarthSphere.gltf", function(gltf){
	console.log(gltf)
		let earth = gltf.scene.children[0];
		earth.scale.set(-0.4,-0.4,-0.4);
		earth.frustumCulled = false;
		//earth.material = new THREE.MeshStandardMaterial({color: 0x3ec43b});
		let geometry = new THREE.SphereGeometry(7.75 * x,40,40);
		let material = new THREE.MeshStandardMaterial({color: 0x0022ff});
		sphere = new THREE.Mesh(geometry, material);
		
		sphere.position.set(0,0.2,-0.55)
		scene.add(sphere)
		scene.add(gltf.scene);
		animate()	
	})}
init();
