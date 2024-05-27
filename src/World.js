// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;

    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
    //v_Normal = a_Normal;


    v_VertPos = u_ModelMatrix * a_Position;
  }`
//where pointsize changes the size of the squares.


// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;  //code inspired by https://people.ucsc.edu/~jkohls/pa4/virtualWorld.js
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);  //use normal
    }
    else if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;     //use color
    }
    else if (u_whichTexture == -1){   //use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if (u_whichTexture == 0){      //use sky texture
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if (u_whichTexture == 1){      //maze leaves texture
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if (u_whichTexture == 2){       //diamond texture
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else{                  //Error, put red
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }

     vec3 lightVector = u_lightPos-vec3(v_VertPos);
     float r = length(lightVector);

     //red/green distance visualization
    // if (r<1.0){
    //   gl_FragColor = vec4(1,0,0,1);
    // }
    // else if (r<2.0){
    //   gl_FragColor = vec4(0,1,0,1);
    // }

    //Light falloff visualization 1/r^2
    //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);


    //N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L),0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    // Specular
    //float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;
    vec3 specular = vec3(gl_FragColor) * (pow(max(dot(E,R), 0.0), 64.0));  //Rohan's suggested code

    vec3 diffuse = vec3(1.0,1.0,0.9)* vec3(gl_FragColor) * nDotL * 0.7; 
    vec3 ambient = vec3(gl_FragColor) * 0.25 * u_lightColor;

    if (u_lightOn){
      if (u_whichTexture == -2){
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      }
      else{
        gl_FragColor = vec4(diffuse+ambient, 1.0);
      }
    }
  }` // add a line saying that if I don't want to use a specific texture or not in fragment shader.

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_lightColor; //line inspired by https://people.ucsc.edu/~jkohls/pa4/virtualWorld.js

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST); //Depth buffer will keep track of whats in front of something else.

}

function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0){
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  //Get the storage location of the light
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if(!u_lightPos){
    console.log("Failed to get the storage location of u_lightPos");
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if(!u_cameraPos){
    console.log("Failed to get the storage location of u_cameraPos");
    return;
  }

  // Get the storage location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log("Failed to get the storage location of u_lightOn");
    return;
  }

  //connect this variable to glsl, inspired by: https://people.ucsc.edu/~jkohls/pa4/virtualWorld.js
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log("Failed to get the storage location of u_lightColor");
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if(!u_NormalMatrix){
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix')
    return
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Set an initial value for this matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_NormalMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);   //If professor's guides make things dissapear, probably forgot to initialize something. 
}


// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let g_yellowAngle = 0;
let g_yellowAngleRight = 0;
let g_magentaAngle = 0;
let g_left_footangle = 0;
let g_midLegAngle = 0;   //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this line of code
let g_yellowAnimation=false;  //Always start without animation when starting up
let g_normalOn = false;
let mouse_x = 0;
let mouse_y = 0;
let g_wattleAnimation = false;
let g_wattleAnimationrock = 0;
let g_lightPos = [0,1.35,2];         //change light coorindates
let g_lightOn = true;
let g_lightAnimation = false;
let g_lightColor = new Vector3([1,1,1]); //inspired by https://people.ucsc.edu/~jkohls/pa4/virtualWorld.js
//let g_selectedSegment = 3;

//Initialize global camera variable
let camera;


function addActionForHTMLUI(){
  //Button Events

  document.getElementById('lightOn').onclick = function() {g_lightOn=true;};
  document.getElementById('lightOff').onclick = function() {g_lightOn=false;};
  document.getElementById('normalOn').onclick = function() {g_normalOn=true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn=false;};
  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false;};
  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true;};
  document.getElementById('light_animationOff').onclick = function() {g_lightAnimation=false;};
  document.getElementById('light_animationOn').onclick = function() {g_lightAnimation=true;};
  //Size Slider Events (chat gpt helped me fix this function, for some reason the professor's code was 
//   // causing the program to draw when I simply just hovered my mouse over the slider, which I don't want)
//   document.getElementById('angleSlide').addEventListener('input', function() {
//     g_globalAngle = this.value; 
//     renderAllShapes(); 
//   });  //calls renderallshapes everytime the slider moves dynamically. Updates happen on the current state of the world.

// //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this line of code
//   document.getElementById('angleSlideY').addEventListener('input', function() {
//     g_globalAngleY = this.value; 
//     renderAllShapes(); 
//   });
  // Color Slider Events
  //document.getElementById('yellowSlide').addEventListener('input', function() {g_yellowAngle = this.value; renderAllShapes();});

  document.getElementById('yellowSlideRight').addEventListener('input', function() {g_yellowAngleRight = this.value; renderAllShapes();});


  document.getElementById('left_foot_Slide').addEventListener('input', function() {g_left_footangle = this.value; renderAllShapes();});

  //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this snippet of code
  document.getElementById('midLegSlider').addEventListener('input', function() {
    // Update the rotation angle of the mid left leg and the foot
    g_midLegAngle = this.value;
    // Render all shapes with updated rotation angle
    renderAllShapes();
});

 //Light slide events
 document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes();}});
 document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes();}});
 document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes();}});



 //Light color slide events (inspired by:https://people.ucsc.edu/~jkohls/pa4/virtualWorld.js)
 document.getElementById('red_light').addEventListener("mousemove", function(ev) { if(ev.buttons == 1) {g_lightColor.elements[0] = this.value/255;}});
 document.getElementById('green_light').addEventListener("mousemove", function(ev) { if(ev.buttons == 1) {g_lightColor.elements[1] = this.value/255;}});
 document.getElementById('blue_light').addEventListener("mousemove", function(ev) { if(ev.buttons == 1) {g_lightColor.elements[2] = this.value/255;}});

// Mouse control to rotate canvas(CHATGPT helped me with this):
canvas.addEventListener('mousedown', function(ev) {
  // Event listener for mouse move to handle rotation while dragging on canvas
  canvas.addEventListener('mousemove', mouseMoveHandler);
});

// handle mouse move for rotation of canvas(CHATGPT helped me with this):
function mouseMoveHandler(ev) {
  // Calculate movement delta
  let X = ev.clientX - mouse_x;
  let Y = ev.clientY - mouse_y;
  
  // Update rotation angles based on mouse movement
  //Slower camera rotation.
  g_globalAngle += X * 0.5; // Sensitivity of 1 to make it fast
  g_globalAngleY += Y * 0.5;
  
  // Store intermediate mouse position
  mouse_x = ev.clientX;
  mouse_y = ev.clientY;
  
  // Render shapes with updated rotation angles
  renderAllShapes(); //professor's code
}

// Function to handle mouse up event (rotate canvas) (CHATGPT helped me with this):
canvas.addEventListener('mouseup', function(ev) {
  // Remove the mouse move event listener when mouse is released
  canvas.removeEventListener('mousemove', mouseMoveHandler);
});
}

function initTextures() {
  var image = new Image();   // Create a texture object
  var image2 = new Image();
  var image3 = new Image();

  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }

  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }

  //ChatGPT helped me debug this line of code to add new texture (add second parameter for texture unit)
  image.onload = function(){ sendTextureToGLSL(image,0); }; //this will setup function that will run when image is done laoding, runs after laoding is completed
  
  image.src = '../src/sky.jpg';

//ChatGPT helped me debug this line of code to add new texture (add second parameter for texture unit)
  image2.onload = function(){ sendTextureToGLSL(image2,1); }; //this will setup function that will run when image is done laoding, runs after laoding is completed
  
  image2.src = '../src/leaves.png';


  image3.onload = function(){ sendTextureToGLSL(image3,2); }; //this will setup function that will run when image is done laoding, runs after laoding is completed
  
  image3.src = '../src/diamond.jpg';

  return true;


// Add more texture loading
}

//ChatGPT helped me fix some lines of code in this function to accomodate and also helped me learn how to handle 2 textures in a program.
function sendTextureToGLSL(image, textureUnit) {
  var texture = gl.createTexture();
  if (!texture){
    console.log('Failed to create the texture object');
    return null;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

//ChatGPT helped me learn in these if-else statements how to handle using two textures (and additional ones if needed)
  if (textureUnit === 0) {
    gl.uniform1i(u_Sampler0, 0);
  }
  
  else if (textureUnit === 1) {
    gl.uniform1i(u_Sampler1, 1);
  }

  else if(textureUnit === 2){
    gl.uniform1i(u_Sampler2, 2);
  }

  return texture;
}



function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) { if(ev.buttons == 1) {click(ev) } };  //drag and move mouse on canvas

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1); //Chatgpt helped me calculate a good color for my background to allow the shadows to appear nicely (baby blue)

  // Register function (event handler) to be called on a mouse press
  //Code borrowed and learned from: https://people.ucsc.edu/~jrgu/asg2/blockyAnimal/BlockyAnimal.js
  canvas.onclick = function(ev) {if(ev.shiftKey) {if (g_wattleAnimation){g_wattleAnimation = false} g_wattleAnimation = true}}
  canvas.onmousedown = origin;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //clears the color and the depths (Rohan the course tutor helped me with this line of code)

  camera = new Camera();

//

  //renderAllShapes();
  requestAnimationFrame(tick);

  //canvas.onmousemove = function(ev) {if(ev.buttons == 1)}
  document.onkeydown = keydown;

  initTextures();

}

//var g_shapesList = [];

//  var g_points = [];  // The array for the position of a mouse press
//  var g_colors = [1.0, 1.0, 1.0, 1.0];  // The array to store the color of a point
//  var g_sizes = [];
// Keep track of startime when program starts and the seconds
var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now/1000.0-g_startTime;

//Called by the broswer repeatedly whenever its time
function tick(){
  // Save the current time
  g_seconds = performance.now()/1000.0-g_startTime;
  //console.log(g_seconds);

  //Update Animation Angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}


function click(ev) {
  //Extract the event click and return it in WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev); // grab the values of the click event and return it in WebGl coordinates.
  
  //Create and store the new point
  let point;
  if(g_selectedType==POINT){
    point = new Point();
  }
  else if (g_selectedType==TRIANGLE){
    point = new Triangle();
  }
  else if (g_selectedType==CIRCLE){
    point = new Circle();
    // Set the segments property of the circle
    point.segments = g_selectedSegment;  //chat gpt helped me come up with this line of code, I was stuck debugging part 11 but it helped me come up with this code.
  }

  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
  
}

function updateAnimationAngles(){ //put all of the different angles that we are going to move with the on/off button here
  if (g_yellowAnimation){                             //g_yellowAnimation is currently being used to animate all of the objects
    g_yellowAngle = (-34*Math.sin(g_seconds));        //ChatGPT helped me figure out the math for the angle rotations for the animations
  }
  if(g_yellowAnimation){
    g_yellowAngleRight = (34*Math.sin(g_seconds));
  }
  if(g_wattleAnimation){
    g_wattleAnimationrock = (-34 * Math.sin(g_seconds));
  }

  //Lighting animation
  if(g_lightAnimation){
    g_lightPos[0] = 3* Math.cos(g_seconds);
  }
}

function keydown(ev) {
  if(ev.keyCode == 87) { // forward
    camera.MoveForward();
  }
  if (ev.keyCode == 83) { // backward
    camera.moveBackwards();
  }
  if (ev.keyCode == 65) { // move left
    camera.moveLeft();
  }
  if (ev.keyCode == 68) { // move right
    camera.moveRight();
  }
  if (ev.keyCode == 81) { // panleft
    camera.panLeft();
  }
  if (ev.keyCode == 69) { // panRight
    camera.panRight();
  }

  renderAllShapes();
  console.log(ev.keyCode);
}



function renderAllShapes(){

  var startTime = performance.now();

  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  // var viewMat = new Matrix4();
  // viewMat.setLookAt(0,0,3,   0,0,-100,   0,1,0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMat.elements);

  //Pass the matrix to u_ModelMatrix attribute
  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //Pass the matrix to u_ModelMatrix attribute (ChatGPT helped me create this y-axis slider part)
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0).rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>  (rendering points)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

  //Pass the light position to GLSL
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  //Pass the camera position to GLSL
  gl.uniform3fv(u_cameraPos, camera.eye.elements);

  // Pass the light status
  gl.uniform1i(u_lightOn, g_lightOn);

  //Pass the light colors to glsl (inspired by: https://people.ucsc.edu/~jkohls/pa4/virtualWorld.js).
  gl.uniform3f(u_lightColor, g_lightColor.elements[0], g_lightColor.elements[1], g_lightColor.elements[2]);


  // // mid left leg
  // var mid_leg1 = new CenteredCube();
  // mid_leg1.color = [1, 1, 0.0, 1.0];
  // if(g_normalOn) mid_leg1.textureNum=-3;
  // mid_leg1.matrix.translate(0, -0.45, -0.15); // Translate to the base of the leg
  // mid_leg1.matrix.rotate(g_yellowAngle, 0, 0, 1);  // Rotate around the z-axis
  // mid_leg1.matrix.rotate(g_midLegAngle, 0, 0, 1);  // Rotate the mid leg //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this snippet of code
  // var left_foot_coordMat = new Matrix4(mid_leg1.matrix); //Debugged chat gpt suggested code
  // mid_leg1.matrix.scale(0.08,0.5,0.08);
  // mid_leg1.normalMatrix.setInverseOf(mid_leg1.matrix).transpose();
  // mid_leg1.render();



  //Draw the light
  var light=new CenteredCube();
  light.color=[2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-0.8,-0.8,-0.8);
  light.render();



// Draw the floor
  var floor = new Cube();
  floor.color = [0.45, 0.22, 0.05, 1.0]; //chatgpt helped me determine this dirt brown color
  floor.textureNum=2;
  floor.matrix.translate(0, -0.81, 0.0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  //Draw the sky
  var sky = new Cube();
  sky.color = [0.8, 0.8, 0.8, 1.0];
  if(g_normalOn) sky.textureNum=-3;
  sky.matrix.scale(-9,-9,-9);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();
  


  //Prof's shape thing
  //Draw a cube (red one)
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  if(g_normalOn) body.textureNum=-3;  //remove to not have bright shining thing on other cubes.
  //body.textureNum = -2;
  body.matrix.translate(-3, -0.75, 0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, 0.3, 0.5);         //this one happens first! Right to left matrix multiplication
  body.render();


  // Draw a yellow left arm
  var leftArm = new Cube();
  leftArm.color = [1,1,0,1];
  if(g_normalOn) leftArm.textureNum=-3;
  leftArm.matrix.setTranslate(-2.75,-0.5,0.0);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  // leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);  //2.6: rotate the yellow joint
  leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);  //2.6: rotate the yellow joint
  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.matrix.translate(-0.5, 0, 0);
  leftArm.normalMatrix.setInverseOf(leftArm.matrix).transpose();
  leftArm.render();

  //Test box (pink box)
  var box = new Cube();
  box.color = [1,0,1,1];
  if(g_normalOn) box.textureNum=-3;
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0,0.65,0.0,0);
  box.matrix.rotate(g_magentaAngle, 0, 0, 1);
  box.matrix.scale(0.3, 0.3, 0.3);
  box.matrix.translate(-0.5,0,-0.001);
  box.normalMatrix.setInverseOf(box.matrix).transpose();
  box.render();


  //Draw a cube (baby blue)
  var body2 = new Cube();
  body2.color = [0.7, 0.85, 0.95, 1.0];
  if(g_normalOn) body2.textureNum=-3;
  body2.matrix.translate(-2, -.74, -2);
  body2.matrix.rotate(0,1,0,0);
  body2.matrix.scale(0.8, 0.8, 0.8);         //this one happens first! Right to left matrix multiplication
  body2.render();


  //Draw a sphere
  var sphere1 = new Sphere();
  sphere1.color = [1.0,1.0,1.0,1.0];
  //sphere1.textureNum = 2;
  if (g_normalOn){
    sphere1.textureNum = -3;
  }
  else{
    sphere1.textureNum = -2;
  }
  sphere1.matrix.translate(1.3,-0.20,0);
  sphere1.matrix.scale(0.5,0.5,0.5);
  sphere1.render();

  //Draw Chicken Body (orange)
  var body = new CenteredCube();
  body.color = [1.0, 0.647, 0.0, 1.0];
  if(g_normalOn) body.textureNum=-3;
  body.matrix.scale(0.6,0.6,0.6);
  body.render();

  // Left Wing
  var left_wing = new CenteredCube();
  left_wing.color = [1.0, 0.647, 0.0, 1.0];
  if(g_normalOn) left_wing.textureNum=-3;
  left_wing.matrix.translate(0.0, 0.10, -0.35)
  left_wing.matrix.scale(0.5, 0.4, 0.10)
  left_wing.render();

  //Right Wing
  var right_wing = new CenteredCube();
  right_wing.color = [1.0, 0.647, 0.0, 1.0];
  if(g_normalOn) right_wing.textureNum=-3;
  right_wing.matrix.translate(0.0, 0.10, 0.35);
  right_wing.matrix.scale(0.5, 0.4, 0.10); 
  right_wing.render();
  
  //Head
  var head = new CenteredCube();
  head.color = [1.0, 0.647, 0.0,1.0]
  if(g_normalOn) head.textureNum=-3;
  head.matrix.translate(-0.35, 0.3, 0.0);
  head.matrix.scale(0.25, 0.5, 0.5); 
  head.render();

  //beak
  var beak = new CenteredCube();
  beak.color = [1, 1, 0.0, 1.0];
  if(g_normalOn) beak.textureNum=-3;
  beak.matrix.translate(-0.57, 0.3, 0);
  beak.matrix.scale(0.20, 0.20, 0.5); 
  beak.render();

  //Wattle (red part)
  var wattle = new CenteredCube();
  wattle.color = [1.0, 0.0, 0.0, 1.0];
  if(g_normalOn) wattle.textureNum=-3;
  wattle.matrix.translate(-0.52, 0.20, -0.001)
  wattle.matrix.rotate(g_wattleAnimationrock, 1, 0, 0);
  wattle.matrix.scale(0.10, 0.28, 0.2); 
  wattle.normalMatrix.setInverseOf(wattle.matrix).transpose();
  wattle.render();


  //left eye
  var left_eye = new CenteredCube();
  left_eye.color = [0.0, 0.0, 0.0, 1.0];
  if(g_normalOn) left_eye.textureNum=-3;
  left_eye.matrix.translate(-0.52001, 0.45, 0.20);
  left_eye.matrix.scale(0.1, 0.1, 0.10);
  left_eye.render();
  
  //Right Eye
  var right_eye = new CenteredCube();
  right_eye.color = [0.0, 0.0, 0.0, 1.0];
  if(g_normalOn) right_eye.textureNum=-3;
  right_eye.matrix.translate(-0.52001, 0.45, -0.20);
  right_eye.matrix.scale(0.1, 0.1, 0.10);
  right_eye.render();

  //upper left leg
  var upper_leg1 = new CenteredCube();
  upper_leg1.color = [1.0, 0.647, 0.0, 1.0];
  if(g_normalOn) upper_leg1.textureNum=-3;
  upper_leg1.matrix.translate(0, -0.25, -0.15)
  upper_leg1.matrix.rotate(g_yellowAngle, 0, 0, 1);  // Rotate around the z-axis
  upper_leg1.matrix.scale(0.31,0.15,0.13);
  //  leftArm.normalMatrix.setInverseOf(leftArm.matrix).transpose();
  upper_leg1.normalMatrix.setInverseOf(upper_leg1.matrix).transpose();
  upper_leg1.render();

  //upper right leg
  var upper_leg2 = new CenteredCube();
  upper_leg2.color = [1.0, 0.647, 0.0, 1.0];
  if(g_normalOn) upper_leg2.textureNum=-3;
  upper_leg2.matrix.translate(0, -0.25, 0.15)
  upper_leg2.matrix.rotate(g_yellowAngleRight, 0, 0, 1);  // Rotate around the z-axis
  upper_leg2.matrix.scale(0.31,0.15,0.13);
  upper_leg2.normalMatrix.setInverseOf(upper_leg2.matrix).transpose();
  upper_leg2.render();

  // mid left leg
  var mid_leg1 = new CenteredCube();
  mid_leg1.color = [1, 1, 0.0, 1.0];
  if(g_normalOn) mid_leg1.textureNum=-3;
  mid_leg1.matrix.translate(0, -0.45, -0.15); // Translate to the base of the leg
  mid_leg1.matrix.rotate(g_yellowAngle, 0, 0, 1);  // Rotate around the z-axis
  mid_leg1.matrix.rotate(g_midLegAngle, 0, 0, 1);  // Rotate the mid leg //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this snippet of code
  var left_foot_coordMat = new Matrix4(mid_leg1.matrix); //Debugged chat gpt suggested code
  mid_leg1.matrix.scale(0.08,0.5,0.08);
  mid_leg1.normalMatrix.setInverseOf(mid_leg1.matrix).transpose();
  mid_leg1.render();


  // //mid right leg
  var mid_leg2 = new CenteredCube();
  mid_leg2.color = [1, 1, 0.0, 1.0];
  if(g_normalOn) mid_leg2.textureNum=-3;
  mid_leg2.matrix.translate(0, -0.45, 0.15)
  //mid_leg2.matrix.rotate(-g_yellowAngleRight, 0, 0, 1);  // Rotate around the z-axis
  mid_leg2.matrix.rotate(g_yellowAngleRight, 0, 0, 1);  // Rotate around the z-axis
  var right_foot_coordMat = new Matrix4(mid_leg2.matrix);
  mid_leg2.matrix.scale(0.08,0.5,0.08);
  mid_leg2.normalMatrix.setInverseOf(mid_leg2.matrix).transpose();
  mid_leg2.render();

  // left foot
  var left_foot = new CenteredCube();
  left_foot.color = [1, 1, 0.0, 1.0];
  if(g_normalOn) left_foot.textureNum=-3;
  left_foot.matrix = left_foot_coordMat;   //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this snippet of code
  left_foot.matrix.translate(0.0, -0.45, 0)
  left_foot.matrix.rotate(g_left_footangle, 0, 1, 0);   //Chat gpt helped me debug my slider control for a second level joint (I originally had but got rid of and couldn't get it to work anymore when I tried implementing again). So it suggested me to add this snippet of code
  left_foot.matrix.scale(0.2,0.10,0.2);
  left_foot.matrix.translate(-0.3, 1.5, 0)
  left_foot.normalMatrix.setInverseOf(left_foot.matrix).transpose();
  left_foot.render();


  //right foot
  var right_foot = new CenteredCube();
  right_foot.color = [1, 1, 0.0, 1.0];
  if(g_normalOn) right_foot.textureNum=-3;
  right_foot.matrix = right_foot_coordMat;
  right_foot.matrix.translate(0.0, -0.45, 0.0)
  right_foot.matrix.scale(0.2,0.10,0.2);
  right_foot.matrix.translate(-0.3, 1.5, 0)
  // right_foot.matrix.scale(0.2,0.10,0.2);
  right_foot.normalMatrix.setInverseOf(right_foot.matrix).transpose();
  right_foot.render();

  //Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}


// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}