// Rohan the tutor helped me debug many things in this code, along with Jacob the tutor.
// Mostly referenced to assignment instructions, but when I would sometimes get get bugs I referred to https://people.ucsc.edu/~jbrowne2/asgn3/src/Camera.js to gain inspiration for my code and to help me debug when I sometimes got stuck following the Camera instructions of Asgn3.
//TA Jihao helped me understand the eye and at to choose a good starting point for my camera.
class Camera{
    constructor(){
        this.type = 'Camera';
        this.fov = 60.0;
        this.eye = new Vector3([0,0, 4]);  //changes position
        this.at = new Vector3([0,0,-1]);   //changes where your eye is looking at
        this.up = new Vector3([0,1,0]);
        this.speed = 0.3;
        this.projectionMatrix = new Matrix4().setPerspective(this.fov, (canvas.width/canvas.height), 0.1, 1000 );
        this.update();
      }

      //Rohan suggested that I make this function instead of having it in my constructor which I did here.
      update(){
        this.viewMat = new Matrix4().setLookAt(
          //ChatGPT helped me write the following three lines of code. It helped me understand that since we have vector 3 for the attributes, we must initialize each eye,at,up with three different coordinates x,y,z
          this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], //x,y,z components
          this.at.elements[0], this.at.elements[1], this.at.elements[2], 
          this.up.elements[0], this.up.elements[1], this.up.elements[2],
        );
      }

      MoveForward(){
        let f = new Vector3();  //Create a new vector f = at - eye.
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        // orig code:
        // this.eye += f;
        // this.at += f;
        //ChatGpt debugged code:
        this.eye.add(f);
        this.at.add(f);
        this.update();
      }

      moveBackwards(){
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(this.speed);
        this.eye.add(b);
        this.at.add(b);
        this.update();
      }

      moveLeft(){
        let L = new Vector3(); //L is still considered to be a forward vector 
        L.set(this.at);
        L.sub(this.eye);
        let s = Vector3.cross(this.up, L)
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
        this.update();
      }

      moveRight(){
        let R = new Vector3();
        R.set(this.at);
        R.sub(this.eye);
        let s = Vector3.cross(R, this.up)
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
        this.update();
      }

      // got help from Rohan and Jacob the tutors for debugging this function
      panLeft(){
        let PL = new Vector3();
        PL.set(this.at);
        PL.sub(this.eye);
        let rot_mat = new Matrix4();
        rot_mat.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rot_mat.multiplyVector3(PL)
        // Code here "update the "at" vector to be at = eye + "panRight"
        //this.at = f_prime = rot_mat.add(this.eye);
        this.at.set(f_prime);
        this.at.add(this.eye);
        this.update();
      }

      // got help from Rohan and Jacob the tutors for debugging this function
      panRight(){
        let PR = new Vector3();
        PR.set(this.at);
        PR.sub(this.eye);
        let rot_mat = new Matrix4();
        rot_mat.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rot_mat.multiplyVector3(PR);
        // Code here "update the "at" vector to be at = eye + "panRight"
        //this.at = f_prime = rot_mat.add(this.eye);
        this.at.set(f_prime);
        this.at.add(this.eye);
        this.update();
      }
}