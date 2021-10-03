import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

let scene, camera, renderer, sphere;
let radius = 1;
let dt = 1;//dt is how many year passed in one frame
let CO2Level = document.getElementById("CO2Slider")
let timePassed = 0;
console.log(CO2Level)



let notification = document.getElementsByClassName("notification");
//Major cities for considering the effect of water rising
let listOfCities = {"Moscow":156, "Newyork": 10, "Toronto": 76, "Tokyo": 40, "Seoul": 38, "Lagos": 41.1, "London": 11, "Paris": 35, "SaoPaulo": 760}







//Function that take in CO2 in gigatons to estimate sealevel in mm
//28.85 is the calculated ratio between mount everest in the simulated model/ mount everest to earth radius
function CO2ToSeaLevelEstimate(CO2){
	return  28.85 * (9.22434399e-01 * Math.pow(CO2, 2) - 1.37511697e+02 * CO2 + 4.15798071e+03)/1000000 //Conversion to km
}



let resetButton = document.getElementById('ResetButton');
resetButton.onclick = () => {
	radius = 1
	timePassed = 0
	for (const [key, value] of Object.entries(listOfCities)){
		document.getElementById(key).className = "notDrowned";
	}
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
	renderer.setSize(window.innerWidth , window.innerHeight);
	let earthDisplay = document.getElementById("Earth");
	let element = renderer.domElement
	element.className = "EarthScene"
	earthDisplay.appendChild(element);

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.update();
 
	function animate() {
		let seaLevelRise = CO2ToSeaLevelEstimate(document.getElementById("CO2Slider").value) ;
		//console.log(seaLevelRise)
		timePassed += dt;
		document.getElementById("TimePassed").innerHTML = timePassed + " Years Passed"

		document.getElementById("CO2Log").innerHTML = CO2Level.value + " Giga Tones of CO2";
		document.getElementById("CLincrease").value = seaLevelRise * 100;
		//console.log((seaLevelRise/6378))
		
		radius += seaLevelRise/6378 * dt;
		console.log(radius)

		radius = Math.min(Math.max(1, radius),1.2)
		for (const [key, value] of Object.entries(listOfCities)){
			if (1 + (value * 1.5)/6371 < radius){
			
				let object = document.getElementById(key)
				if (object.className == "notDrowned"){
					object.className = "drowned";
				}
			}
		}
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
	loader.load("/EarthSphere5.gltf", function(gltf){
	console.log(gltf)
		let earth = gltf.scene.children.at(-1);
		earth.scale.set(0.4,-0.4,-0.4);
		earth.frustumCulled = false;
		//earth.material = new THREE.MeshStandardMaterial({color: 0x3ec43b});
		let geometry = new THREE.SphereGeometry(7.70 * radius,40,40);
		let material = new THREE.MeshStandardMaterial({color: 0x0022ff});
		sphere = new THREE.Mesh(geometry, material);
		
		sphere.position.set(0,0,0)
		scene.add(sphere)
		scene.add(gltf.scene);
		animate()	
	})}
init();
