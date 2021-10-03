import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

let scene, camera, renderer, sphere;
let radius = 1;
let dt = 1/600;//dt is how many year passed in one frame
let CO2Level = document.getElementById("CO2Slider")

console.log(CO2Level)


//Function that take in CO2 in gigatons to estimate sealevel in mm
//28.85 is the calculated ratio between mount everest in the simulated model/ mount everest to earth radius
function CO2ToSeaLevelEstimate(CO2){
	return  28.85 * (9.22434399e-01 * Math.pow(CO2, 2) - 1.37511697e+02 * CO2 + 4.15798071e+03)/1000000 //Conversion to km
}


let dxSlider = document.getElementById("CLincrease")
console.log(dxSlider)

let resetButton = document.getElementById('ResetButton');
resetButton.onclick = () => {
	radius = 1
}








function init(){	
  	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xff9966);
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 50);
	camera.rotation.y = 45/180 * Math.PI;
	camera.position.x = 30;
	camera.position.y = 10;
	camera.position.z = 0.5;


	
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth - 30, window.innerHeight - 30);
	let earthDisplay = document.getElementById("Earth");
	let element = renderer.domElement
	element.className = "EarthScene"
	earthDisplay.appendChild(element);

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	function animate() {
		let seaLevelRise = CO2ToSeaLevelEstimate(CO2Level.value) ;
		//console.log(seaLevelRise)
		document.getElementById("CO2Log").innerHTML = CO2Level.value + " Giga Tones of CO2"
		document.getElementById("CLincrease").value = seaLevelRise * 100;
		console.log((seaLevelRise/6,378) * dt)
		radius += seaLevelRise/6,378 * dt;

		radius = Math.min(Math.max(1, radius),1.2)
	
		sphere.scale.set( radius, radius,radius)
	
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera)
		
	}


	let hlight = new THREE.AmbientLight(0x101008, 30);
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
		let geometry = new THREE.SphereGeometry(7.70 * radius,40,40);
		let material = new THREE.MeshStandardMaterial({color: 0x0022ff});
		sphere = new THREE.Mesh(geometry, material);
		
		sphere.position.set(0,0.2,-0.55)
		scene.add(sphere)
		scene.add(gltf.scene);
		animate()	
	})}
init();
