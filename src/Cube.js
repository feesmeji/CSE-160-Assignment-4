class Cube{
    constructor(){
        this.type='cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        // this.size = 5.0;
        // this.segments = 3;
        this.matrix = new Matrix4();
        this.textureNum=-2;
    }
    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);

        //Pass color of a point to u_FragColor var
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        // Pass the color of a point to u_FragColor uniform variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);        
        
    
// Section 1: Drawtriangle3DUV

//CHATGPT helped me realize that I can use all of the triangle coordinates that I used in section 2 of my code and just adding the extra bracket to each line of code. 
//to allow webgl to draw the uv colors. I originally used its UV color coordinates with triangle point coordinates in my previous versions of my code (in section 1) which were working, but I modified it to match my original section 2 to make my code more consistent,
// and to help me understand the implementation better.
//It also helped me debug the 3DUV coordinates along with the drawtriangle3d coordinates, as just copying and pasting coordinates code from my original section 2 was not giving smooth color on each cube side.
    // Front face (already provided) UV
    drawTriangle3DUVNormal([0,0,0,    1,1,0,    1,0,0 ], [0,0,  1,1,  1,0], [0,0,-1, 0,0,-1, 0,0,-1]); //3rd is normal
    drawTriangle3DUVNormal([0,0,0,    0,1,0,    1,1,0 ], [0,0,  0,1,  1,1],  [0,0,-1, 0,0,-1, 0,0,-1]);

    //Pass color of a point to u_FragColor var
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

    //Top of cube
    drawTriangle3DUVNormal( [0,1,0,   0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,1,0, 0,1,0, 0,1,0] );
    drawTriangle3DUVNormal( [0,1,0,   1,1,1,  1,1,0], [0,0,  1,1,  1,0], [0,1,0, 0,1,0, 0,1,0] );
   //Pass color of a point to u_FragColor var
   gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);


    //Right side of cube
    gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
    drawTriangle3DUVNormal([1,1,0,   1,1,1,  1,0,1], [0,0,  1,1,  1,0], [1,0,0, 1,0,0, 1,0,0]);// right side of cube triangle 1
    drawTriangle3DUVNormal([1,0,0,   1,1,0,  1,1,1], [0,0,  0,1,  1,1], [1,0,0, 1,0,0, 1,0,0]);//right side of cube triangle 2


    //Left side of triangle
    gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
    drawTriangle3DUVNormal([0,0,0,   0,1,1,   0,0,1], [0,0,  1,1,  1,0], [-1,0,0, -1,0,0, -1,0,0]); //left side of cube triangle 1
    drawTriangle3DUVNormal([0,0,0,   0,1,0,   0,1,1], [0,0,  0,1,  1,1], [-1,0,0, -1,0,0, -1,0,0]); //left side of cube triangle 2


    //Bottom of cube
    gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
    drawTriangle3DUVNormal( [0,0,0,   0,0,1,  1,0,1], [0,0,  0,1,  1,1], [0,-1,0,  0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal( [0,0,0,   1,0,1,  1,0,0], [0,0,  1,1,  1,0], [0,-1,0,  0,-1,0, 0,-1,0]);


    //Back of cube (when drawing things, webgl renders objects closer to the camera when the z coordinate is less than zero. Further away from camera if z axis is greater than zero)
    gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
    drawTriangle3DUVNormal( [0,0,1,  1,1,1,  1,0,1 ], [0,0,  0,1,  1,1], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUVNormal( [0,0,1,  0,1,1,  1,1,1 ], [0,0,  1,1,  1,0], [0,0,1, 0,0,1, 0,0,1]);
    
    }

    //ChatGPT helped me debug this function (I was not including UVs which was messing up my map border, chatgpt helped me realize that I needed to add them as wekk and I learned how to do with chat gpt's help.)
    //Rohan helped me debug this function's coordinates.
    renderfast() {

        gl.uniform1i(u_whichTexture, this.textureNum);

        var rgba = this.color;
    
        //Pass color of a point to u_FragColor var
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);        
        
        var allverts = [];
        var allUVs = [];
    
        // Front of cube
        allverts = allverts.concat([0,0,0,  1,1,0,  1,0,0]);
        allUVs = allUVs.concat([0,0,  1,1,  1,0]);
        allverts = allverts.concat([0,0,0,  0,1,0,  1,1,0]);
        allUVs = allUVs.concat([0,0,  0,1,  1,1]);
    
        // Back of cube
        allverts = allverts.concat([0,0,1,  1,1,1,  1,0,1]);
        allUVs = allUVs.concat([0,0,  1,1,  1,0]);
        allverts = allverts.concat([0,0,1,  0,1,1,  1,1,1]);
        allUVs = allUVs.concat([0,0,  0,1,  1,1]);
    
        // Top of cube
        allverts = allverts.concat([0,1,0,  0,1,1,  1,1,1]);
        allUVs = allUVs.concat([0,0,  0,1,  1,1]);
        allverts = allverts.concat([0,1,0,  1,1,1,  1,1,0]);
        allUVs = allUVs.concat([0,0,  1,1,  1,0]);
        
        // Bottom of cube
        allverts = allverts.concat([0,0,0,  0,0,1,  1,0,1]);
        allUVs = allUVs.concat([0,0,  0,1,  1,1]);
        allverts = allverts.concat([0,0,0,  1,0,1,  1,0,0]);
        allUVs = allUVs.concat([0,0,  1,1,  1,0]);
    
        // Right side of cube
        allverts = allverts.concat([1,0,0,  1,1,1,  1,0,1]);
        allUVs = allUVs.concat([0,0,  1,1,  1,0]);
        allverts = allverts.concat([1,0,0,  1,1,0,  1,1,1]);
        allUVs = allUVs.concat([0,0,  0,1,  1,1]);
    
        // Left side of cube
        allverts = allverts.concat([0,0,0,  0,1,1,  0,0,1]);
        allUVs = allUVs.concat([0,0,  1,1,  1,0]);
        allverts = allverts.concat([0,0,0,  0,1,0,  0,1,1]);
        allUVs = allUVs.concat([0,0,  0,1,  1,1]);
    
        drawTriangle3DUV(allverts, allUVs);
    }
}