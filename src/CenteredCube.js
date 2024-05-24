class CenteredCube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, -2);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

//Got helped from chatgpt to debug and fix normal coordinates.
        // Front of cube
        drawTriangle3DUVNormal(
            [-0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5],
            [0, 0, 1, 1, 1, 0],
            [0, 0, -1, 0, 0, -1, 0, 0, -1]
        );
        drawTriangle3DUVNormal(
            [-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5],
            [0, 0, 0, 1, 1, 1],
            [0, 0, -1, 0, 0, -1, 0, 0, -1]
        );
  // Pass color of a point to u_FragColor var
  gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);


        // Back of cube
        gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);

        drawTriangle3DUVNormal(
            [-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5],
            [0, 0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 1]
        );
        drawTriangle3DUVNormal(
            [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            [0, 0, 0, 1, 1, 1],
            [0, 0, 1, 0, 0, 1, 0, 0, 1]
        );

        // Top of cube
        drawTriangle3DUVNormal(
            [-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            [0, 0, 0, 1, 1, 1],
            [0, 1, 0, 0, 1, 0, 0, 1, 0]
        );
        drawTriangle3DUVNormal(
            [-0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5],
            [0, 0, 1, 1, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 0]
        );

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Bottom of cube
        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        drawTriangle3DUVNormal(
            [-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5],
            [0, 0, 0, 1, 1, 1],
            [0, -1, 0, 0, -1, 0, 0, -1, 0]
        );
        drawTriangle3DUVNormal(
            [-0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5],
            [0, 0, 1, 1, 1, 0],
            [0, -1, 0, 0, -1, 0, 0, -1, 0]
        );

        // Right side of cube
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        drawTriangle3DUVNormal(
            [0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5],
            [0, 0, 1, 1, 1, 0],
            [1, 0, 0, 1, 0, 0, 1, 0, 0]
        );
        drawTriangle3DUVNormal(
            [0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5],
            [0, 0, 0, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 0]
        );

        // Left side of cube
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3DUVNormal(
            [-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5],
            [0, 0, 0, 1, 1, 1],
            [-1, 0, 0, -1, 0, 0, -1, 0, 0]
        );
        drawTriangle3DUVNormal(
            [-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5],
            [0, 0, 1, 1, 1, 0],
            [-1, 0, 0, -1, 0, 0, -1, 0, 0]
        );
    }
}
