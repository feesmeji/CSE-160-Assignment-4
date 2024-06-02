import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';

//ChatGPT suggested I add this line of code to debug my shapes not spinning 
let cube, sphere, tetrahedron; // Declare variables at higher scope

function main() {
	const scene = new THREE.Scene();
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	function updateLight() {

		light.target.updateMatrixWorld();
		helper.update();
	}

// Add sky2block
{

	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
		'afternoon_sky.jpg',
		'afternoon_sky.jpg',
		'afternoon_sky.jpg',
		'afternoon_sky.jpg',
		'afternoon_sky.jpg',
		'afternoon_sky.jpg',

	] );
	scene.background = texture;

}

//Camera Setup
//Update from last time
	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 50 );

	class MinMaxGUIHelper {

		constructor( obj, minProp, maxProp, minDif ) {

			this.obj = obj;
			this.minProp = minProp;
			this.maxProp = maxProp;
			this.minDif = minDif;

		}
		get min() {

			return this.obj[ this.minProp ];

		}
		set min( v ) {

			this.obj[ this.minProp ] = v;
			this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

		}
		get max() {

			return this.obj[ this.maxProp ];

		}
		set max( v ) {

			this.obj[ this.maxProp ] = v;
			this.min = this.min; // this will call the min setter

		}

	}

	function updateCamera() {

		camera.updateProjectionMatrix();

	}


//Passed the OrbitControls a camera to control
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 ); //orbit around 5 units above the origin and call control.update.
	controls.update();
	// /scene.background = new THREE.Color( 'black' );


// Floor 
	{
		//Load grass texture, 
	 const planeSize = 80;    //size of the floor.

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'grasslight-big.jpg' );
		texture.wrapS = THREE.RepeatWrapping;   //repeat the texture 
		texture.wrapT = THREE.RepeatWrapping;   //repeat the texture
		texture.magFilter = THREE.NearestFilter;   //set filtering to nearest.
		//texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 20;  //"Since the texture is a 2x2 pixel checkerboard, by repeating and setting the repeat to half the size of the plane each check on the checkerboard will be exactly 1 unit large"
		texture.repeat.set( repeats, repeats );


		//Make Plane geometry. (Default Xy plane), ground (XZ) plane
		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshStandardMaterial( {  //make material for the plane
			map: texture,
			side: THREE.DoubleSide,
		} );
		//Create a mesh to insert it in the scene.
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}


//White bone

	{
		//White rectangle
		const cubeGeo = new THREE.BoxGeometry( 4, 0.3, 0.6);
		const cubeMat = new THREE.MeshStandardMaterial( { color: '#ffffff' } );
		const mesh = new THREE.Mesh( cubeGeo, cubeMat );
		mesh.position.set( 7, 0.7, 0 );
		scene.add( mesh );

	}

	{
		//left sphere
		//3A Sphere (red)
		const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
		const sphere_material = new THREE.MeshStandardMaterial( { color: '#ffffff' } ); 
		sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

		sphere.position.set(5,0.7,0);  //chatgpt suggested I use this function to set the position on the screen, I put the values on my own

		scene.add( sphere );

	}

	{
		//Right sphere
		const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
		const sphere_material = new THREE.MeshStandardMaterial( { color: '#ffffff' } ); 
		sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

		sphere.position.set(9,0.7,0);  //chatgpt suggested I use this function to set the position on the screen, I put the values on my own

		scene.add( sphere );
	}



// White bone ends


//Blue Bone

{
	//White rectangle
	const cubeGeo = new THREE.BoxGeometry( 4, 0.3, 0.6);
	const cubeMat = new THREE.MeshStandardMaterial( { color: '#0000FF' } );
	const mesh = new THREE.Mesh( cubeGeo, cubeMat );
	mesh.position.set( 0, 0.7, -11 );
	scene.add( mesh );

}

{
	//left sphere
	//3A Sphere (red)
	const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
	const sphere_material = new THREE.MeshStandardMaterial( { color: '#0000FF' } ); 
	sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

	sphere.position.set(2,0.7,-11);  

	scene.add( sphere );

}

{
	//Right sphere
	const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
	const sphere_material = new THREE.MeshStandardMaterial( { color: '#0000FF' } ); 
	sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

	sphere.position.set(-2,0.7,-11);  

	scene.add( sphere );
}

//Blue bone ends



//Bone in mouth

{
	//White rectangle
	const cubeGeo = new THREE.BoxGeometry( 4, 0.2, 0.4);
	const cubeMat = new THREE.MeshStandardMaterial( { color: '#ffffff' } );
	const mesh = new THREE.Mesh( cubeGeo, cubeMat );
	mesh.position.set( 0, 3, -12 );
	scene.add( mesh );

}

{
	//left sphere
	const sphere_geometry = new THREE.SphereGeometry( 0.4, 32, 16 ); 
	const sphere_material = new THREE.MeshStandardMaterial( { color: '#ff0000' } ); 
	sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

	sphere.position.set(2,3,-12);  

	scene.add( sphere );

}

{
	//Right sphere
	const sphere_geometry = new THREE.SphereGeometry( 0.4, 32, 16 ); 
	const sphere_material = new THREE.MeshStandardMaterial( { color: '#ff0000' } ); 
	sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

	sphere.position.set(-2,3,-12);  

	scene.add( sphere );
}

//Bone in mouth ends

	{
		//Green Sphere
		const sphereRadius = 0.7;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
		const sphereMat = new THREE.MeshStandardMaterial( { color: '#00FF00' } );
		const mesh = new THREE.Mesh( sphereGeo, sphereMat );
		mesh.position.set(-6, 0.8, -5 );
		scene.add( mesh );

	}
	{
		//3A cube (duck):
		const boxWidth = 2;
		const boxHeight = 2;
		const boxDepth = 2;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'rubber_duck.jpg');
		texture.colorSpace = THREE.SRGBColorSpace;

		const material = new THREE.MeshStandardMaterial( { map: texture} ); // greenish blue hex number
		cube = new THREE.Mesh( geometry, material );
		//cube.visible = false
		cube.position.set(0,1.5,0);
		scene.add( cube );
	}

	{
		//3A Sphere (red)
		const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
		const sphere_material = new THREE.MeshStandardMaterial( { color: 0xff0000 } ); 
		sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

		sphere.position.set(-10,0.8,0);  //chatgpt suggested I use this function to set the position on the screen, I put the values on my own

		scene.add( sphere );
	}


// DOG PARK OBSTACLES

//Cylinders

	{
	const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32, ); 
	const material = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
	const cylinder = new THREE.Mesh( geometry, material ); scene.add( cylinder );
	cylinder.rotation.set(Math.PI/2,0,0)   //CHATGPT helped me determine and use MATH.PI/2 to rotate to make various shapes in my code lay flat on my floor. I first found out how to use it here then I used Math.PI/2 elsewhere
	cylinder.scale.set(0.3,0.3,0.3)
	cylinder.position.set(-6,0,-15)
	}


	{
	const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32,); 
	const material = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
	const cylinder = new THREE.Mesh( geometry, material ); scene.add( cylinder );
	cylinder.rotation.set(Math.PI/2,0,0)
	cylinder.scale.set(0.3,0.3,0.3)
	cylinder.position.set(-11,0,-15)
	}


	{
	const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32,); 
	const material = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
	const cylinder = new THREE.Mesh( geometry, material ); scene.add( cylinder );
	cylinder.rotation.set(Math.PI/2,0,0)
	cylinder.scale.set(0.3,0.3,0.3)
	cylinder.position.set(-16,0,-15)
	}

	{
	const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 ); 
	const material = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
	const cylinder = new THREE.Mesh( geometry, material ); scene.add( cylinder );
	cylinder.rotation.set(Math.PI/2,0,0)
	cylinder.scale.set(0.3,0.3,0.3)
	cylinder.position.set(-21,0,-15)
	}

//Yellow Ring
	{
	const geometry = new THREE.TorusGeometry( 10, 1, 16, 100 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
	torus.rotation.set(0,Math.PI/2,0)
	torus.scale.set(0.4,0.4,0.4);
	torus.position.set(-23, 4.4,-15)
	}

//Rings next to eachother:
	{
	const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
	//torus.rotation.set(0,Math.PI/2,0)
	torus.scale.set(0.2,0.2,0.2);
	torus.position.set(26, 2.6,-15)
	}

	{
	const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
	//torus.rotation.set(0,Math.PI/2,0)
	torus.scale.set(0.2,0.2,0.2);
	torus.position.set(26, 2.6,-13)
	}


	{
	const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
	//torus.rotation.set(0,Math.PI/2,0)
	torus.scale.set(0.2,0.2,0.2);
	torus.position.set(26, 2.6,-11)
	}


	{
	const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
	//torus.rotation.set(0,Math.PI/2,0)
	torus.scale.set(0.2,0.2,0.2);
	torus.position.set(26, 2.6,-9)
	}



	//Obj obstacles
{
	const objLoader = new OBJLoader();
	objLoader.load('./obstacle_1.obj', (object) => {
	object.rotation.set((-Math.PI/2),0,Math.PI/2);  //z axis rotates the object left to right
	object.scale.set(0.5, 0.5, 0.5); // Adjust the scaling factor (CHATgpt helped me come up with this line of code, I input the numbers by myself)
	object.position.set(-30,0.05,15);    //I added the appropriate numbers to get close to the cube

	
	scene.add(object);
	// Apply texture to the material of the 3D dog object (chatgpt helped me come up with the next 4 lines, I learned its a standard way of applying textures to 3d object like this using children)
	// Similar to this: https://discourse.threejs.org/t/how-to-texture-a-3d-model-in-three-js/25035
	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			const loader = new THREE.TextureLoader();
			const dogTexture = loader.load('gs_dog_texture.webp');
			child.material.map = dogTexture;
		}
	});
	});
}


// DOG PARK OBSTACLES END

//Pink donut
	{
	const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xFFC0CB} ); 
	const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
	torus.rotation.set(Math.PI/2,0,0)
	torus.scale.set(0.1,0.1,0.1);
	torus.position.set(12,0.3,-7);
	}


	{
	//3A Dog Obj File
	//Stuff for obj file
	//create init object
	const objLoader = new OBJLoader();
	objLoader.load('./white_dog.obj', (object) => {
	//object.rotation.set(0,60,0);
	object.scale.set(0.5, 0.5, 0.5); // Adjust the scaling factor (CHATgpt helped me come up with this line of code, I input the numbers by myself)
	object.position.set(0,-0.1,-15);    //I added the appropriate numbers to get close to the cube

	
	scene.add(object);
	// Apply texture to the material of the 3D dog object (chatgpt helped me come up with the next 4 lines, I learned its a standard way of applying textures to 3d object like this using children)
	// Similar to this: https://discourse.threejs.org/t/how-to-texture-a-3d-model-in-three-js/25035
	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			const loader = new THREE.TextureLoader();
			const dogTexture = loader.load('gs_dog_texture.webp');
			child.material.map = dogTexture;
		}
	});
	});
	}

	//Sitting dog obj file:
{
	const objLoader = new OBJLoader();
	objLoader.load('./sitting_dog.obj', (object) => {
	object.rotation.set(-Math.PI/2,0,Math.PI/2);
	object.scale.set(0.1, 0.1, 0.1); // Adjust the scaling factor (CHATgpt helped me come up with this line of code, I input the numbers by myself)
	object.position.set(-15,0,-2);    //I added the appropriate numbers to get close to the cube

	
	scene.add(object);
	// Apply texture to the material of the 3D dog object (chatgpt helped me come up with the next 4 lines, I learned its a standard way of applying textures to 3d object like this using children)
	// Similar to this: https://discourse.threejs.org/t/how-to-texture-a-3d-model-in-three-js/25035
	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			const loader = new THREE.TextureLoader();
			const dogTexture = loader.load('black_dog_texture.jpg');
			child.material.map = dogTexture;
		}
	});
	});
}


//Wolf jumping over rings 

//torus.position.set(26, 2.6,-15)
const objLoader = new OBJLoader();
objLoader.load('./Wolf_obj.obj', (object) => {
    object.rotation.set(19, 0, 0); // Adjust the Y-axis rotation incrementally
    object.scale.set(5, 5, 5); // Adjust the scaling factor
    object.position.set(26, 1.6, -12); // Adjust the position

    scene.add(object);

    // Apply texture to the material of the 3D wolf object
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const loader = new THREE.TextureLoader();
            const wolfTexture = loader.load('Wolf_Body.jpg');
            child.material.map = wolfTexture;
        }
    });
});








//Lighting ------------------------------------------------
//GUI setup:

class ColorGUIHelper {
	constructor(object, prop) {
	this.object = object;
	this.prop = prop;
	}
	get value() {
	return `#${this.object[this.prop].getHexString()}`;
	}
	set value(hexString) {
	this.object[this.prop].set(hexString);
	}
}

//Ambient Lighting
{
	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.AmbientLight(color, intensity);
	scene.add(light);

	// I believe these lines of code I got help from chat gpt to try and fix the lighting controls, but nothing worked.
	const ambientGUI = new GUI();
	const ambientContainer = document.getElementById('ambient-container'); // Create a container for ambient GUI controls
	ambientContainer.appendChild(ambientGUI.domElement); // Append to the ambient container
	//document.getElementById('ambient-container').appendChild(ambientGUI.domElement); // Append to a container div (chatgpt)
	ambientGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	ambientGUI.add(light, 'intensity', 0, 2, 0.01);


}

// RectArea Light
{
	class DegRadHelper {
		constructor(obj, prop) {
		  this.obj = obj;
		  this.prop = prop;
		}
		get value() {
		  return THREE.MathUtils.radToDeg(this.obj[this.prop]);
		}
		set value(v) {
		  this.obj[this.prop] = THREE.MathUtils.degToRad(v);
		}
	  }
	
	RectAreaLightUniformsLib.init();
	const color = 0xFFFFFF;
	const intensity = 5;
	const width = 12;
	const height = 4;
	const light = new THREE.RectAreaLight(color, intensity, width, height);
	light.position.set(0, 10, 0);
	light.rotation.x = THREE.MathUtils.degToRad(-90);
	scene.add(light);
	 
	const helper = new RectAreaLightHelper(light);
	light.add(helper);

//GUI (This was ChatGPT attempting to help me fix lighting controls)
	const gui = new GUI();
	gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	gui.add(light, 'intensity', 0, 10, 0.01);
	gui.add(light, 'width', 0, 20);
	gui.add(light, 'height', 0, 20);
	gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
	gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
	gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');
	
	makeXYZGUI(gui, light.position, 'position');

}


//Directional Light
// I believe some of these lines of code I got help from chat gpt to try and fix the lighting controls, but nothing worked.
function makeXYZGUI( gui, vector3, name, onChangeFn ) {

	const folder = gui.addFolder( name );
	folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
	folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
	folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
	folder.open();

}

{

	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( 0, 10, 0 );
	light.target.position.set( - 5, 0, 0 );
	scene.add( light );
	scene.add( light.target );

	const helper = new THREE.DirectionalLightHelper( light );
	scene.add( helper );

	function updateLight() {

		light.target.updateMatrixWorld();
		helper.update();

	}

	updateLight();

// I believe some of these lines of code I got help from chat gpt to try and fix the lighting controls, but nothing worked.
	const directionalGUI = new GUI();
    const directionalContainer = document.getElementById('directional-container'); // Create a container for directional GUI controls
    directionalContainer.appendChild(directionalGUI.domElement); // Append to the directional container
	//document.getElementById('directional-container').appendChild(directionalGUI.domElement); // Append to a container div
	directionalGUI.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
	directionalGUI.add( light, 'intensity', 0, 5, 0.01 );

	makeXYZGUI( directionalGUI, light.position, 'position', updateLight );
	makeXYZGUI( directionalGUI, light.target.position, 'target', updateLight );

}

// Directional Light End ---------------------------

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render(time) {

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}
		time *= 0.001; // convert time to seconds

		cube.rotation.x = time;
		cube.rotation.y = time;

		// sphere.rotation.x = time;
		// sphere.rotation.y = time;

		// tetrahedron.rotation.x = time;
		// tetrahedron.rotation.y = time;
		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );


}

main();