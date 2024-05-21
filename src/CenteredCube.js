//Rohan the tutor suggested I make this file to make it easier to make my blocky animal appear in my blocky world.
class CenteredCube{
    constructor(){
        this.type='cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        // this.size = 5.0;
        // this.segments = 3;
        this.matrix = new Matrix4();
    }
    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        gl.uniform1i(u_whichTexture, -2);

        //Pass color of a point to u_FragColor var
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        // Pass the color of a point to u_FragColor uniform variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);        
        
    
//CHATGPT Helped me center the cube on the origin with the correct coordinates (This code is from asng2).
//I later mapped out by hand each point on a visualizing tool to make sure it was positioned correctly centered on the origin.
// I originally was printing cubes on the 1st quadrant which I didn't like.

        //Front of cube
        drawTriangle3D([-0.5,-0.5,-0.5,  0.5,0.5,-0.5,  0.5,-0.5,-0.5]);
        drawTriangle3D([-0.5,-0.5,-0.5, -0.5,0.5,-0.5,  0.5,0.5,-0.5]);

        //Back of cube
        drawTriangle3D([-0.5,-0.5,0.5,  0.5,0.5, 0.5,  0.5,-0.5,0.5]);
        drawTriangle3D([-0.5,-0.5,0.5,  -0.5,0.5,0.5,  0.5,0.5,0.5]);
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        //Top of cube
        drawTriangle3D([-0.5,0.5,-0.5,  -0.5,0.5,0.5,  0.5,0.5,0.5]);
        drawTriangle3D([-0.5,0.5,-0.5,  0.5,0.5,0.5,  0.5,0.5,-0.5]);

        //Bottom of cube
        drawTriangle3D([-0.5,-0.5,-0.5,  -0.5,-0.5,0.5,  0.5,-0.5,0.5]);
        drawTriangle3D([-0.5,-0.5,-0.5,  0.5,-0.5,0.5,  0.5,-0.5,-0.5]);

        //Right side of cube
        drawTriangle3D([0.5,0.5,0.5,  0.5,-0.5,0.5, 0.5,-0.5,-0.5]);
        drawTriangle3D([0.5,0.5,0.5,  0.5,0.5,-0.5,  0.5,-0.5,-0.5]);

        //Left side of cube
        drawTriangle3D([-0.5,-0.5,-0.5,  -0.5,0.5,-0.5,  -0.5,0.5,0.5]);
        drawTriangle3D([-0.5,-0.5,-0.5,  -0.5,-0.5,0.5,  -0.5,0.5,0.5]);


    }
}