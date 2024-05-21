class Pyramid{
    constructor(){
        this.type='pyramid';
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

        //Pass color of a point to u_FragColor var
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


        // Pass the color of a point to u_FragColor uniform variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);        
        
    
        //Bottom of pyramid (copied over from cube.js)
        drawTriangle3D([-0.5,-0.5,-0.5,  -0.5,-0.5,0.5,  0.5,-0.5,0.5]);
        drawTriangle3D([-0.5,-0.5,-0.5,  0.5,-0.5,0.5,  0.5,-0.5,-0.5]);

        //ChatGPT helped me figure out the positioning of the tetrahedron on the origin: in the next lines of code
        //I later mapped out by hand each point on a visualizing tool to make sure it was positioned correctly centered on the origin.
        //Back side of pyramid
        drawTriangle3D([0.0,0.5,0.0,  -0.5,-0.5,0.5, 0.5,-0.5,0.5]);
        //Front Side of pyramid
        drawTriangle3D([0.0,0.5,0.0, 0.5,-0.5,-0.5, -0.5,-0.5,-0.5]);
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]); //copied from cube.js
        //left Side of Pyramid
        drawTriangle3D([0.0,0.5,0.0, -0.5,-0.5,-0.5, -0.5,-0.5,0.5]);
        //Right side of pyramid
        drawTriangle3D([0.0,0.5,0.0,  0.5,-0.5,0.5,  0.5,-0.5,-0.5]);

    }
}