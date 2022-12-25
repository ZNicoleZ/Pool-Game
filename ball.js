const BALL_ORIGIN = new Vector2D(25,25);
const SIZE = 25;
class Ball{
    constructor(position,color){
        this.position = position;
        this.velocity = new Vector2D();
        this.isMoving = false;
        this.inHole = false;
        this.isVisible = true;
        this.radius = 19;
        this.diameter = this.radius*2;
        this.opacity = 100;
        this.color = color;


        this.img=new Image();
        switch(color){
            case 1: // red ball
                this.img.src="images/redBall.png";
                break;
            case 2: // yellow ball
                this.img.src="images/yellowBall.png";
                break;
            case 3: // white ball
                this.img.src="images/whiteBall.png";
                break;
            case 4:// black ball
                this.img.src="images/blackBall.png";
                break;
            default:
                console.log("Ball color not valid");
                break;  
        }
        
        // this.img=new Image();
        // this.img.src="images/whiteBall.png";

        // this.mask=document.createElement("canvas");
        // // this.mask.width=SIZE;
        // // this.mask.height=SIZE;

        // const maskCtx=this.mask.getContext("2d");
        // this.img.onload=()=>{
        //     maskCtx.fillStyle=color;
        //     maskCtx.rect(0,0,this.mask.width, this.mask.height);
        //     maskCtx.fill();

        //     maskCtx.globalCompositeOperation="destination-atop";
        //     maskCtx.drawImage(this.img,0,0,this.img.width, this.img.height);
        // }        
    }

    update(){
        // this.#move();
        // if(this.velocity==0){
        //     this.isSelected=false;
        // }

        this.position.addTo(this.velocity.mult(1/177));
        this.velocity = this.velocity.mult(0.97);

        if(this.velocity.length() < 10){
            this.velocity = new Vector2D();
            this.isMoving = false;          
        }

        if(this.inHole && this.opacity>2){
            this.opacity = this.opacity/2;
        }

        if(this.opacity<2){
            this.isVisible = false;
            this.opacity = 0;
            this.velocity = new Vector2D();
            this.isMoving = false;
        }
        
    }

    checkInHole(holePosition, holeRadius, currentPlayer){
        let dist = this.position.subtract(holePosition).length();
        if(dist <= holeRadius){
            // this.isVisible = false;
            // console.log("BALL IN HOLE!");
            this.inHole = true;
            this.position.x = holePosition.x;
            this.position.y = holePosition.y;
            this.velocity = new Vector2D();
            this.isMoving = false;

            // player scores correct ball - add score
            if(currentPlayer == this.color){
                return 1;
            }

            // player scores wrong ball and NOT black OR white - add apponents score
            else if(this.color != 4 && this.color != 3){
                return 2;
            }

            else if(this.color == 3){
                return 0;
            }

            // player scores black ball - game over :(
            else if(this.color == 4){
                return -1;
            }
        }
    }

    checkBallCollision(ball){
        
        // find normal vector
        const n = this.position.subtract(ball.position);

        // find distance
        const dist = n.length();

        if(dist>this.diameter){
            return;
        }

        // find minimum translation distance
        const mtd = n.mult((this.diameter - dist)/dist);
        //const h_mtd = {x: mtd.x*(1/2), y:mtd.y*(1/2)};

        // push-pull balls apart
        this.position = this.position.add(mtd.mult(0.5));
        ball.position = ball.position.subtract(mtd.mult(0.5));

        // find unit normal vector
        const un = n.mult(1/n.length());

        // find unit tangent vector
        const ut = new Vector2D(-un.y, un.x);

        // project velocities onto the unit normal and unit tangent vectors
        const v1n = un.dot(this.velocity);
        const v1t = ut.dot(this.velocity);
        const v2n = un.dot(ball.velocity);
        const v2t = ut.dot(ball.velocity);

        // *** all balls have equal masses ***

        // find new normal velocities
        let v1nTag = v2n;
        let v2nTag = v1n;

        // convert the scalar normal and tnagential velocities into vectors
        v1nTag = un.mult(v1nTag);
        const v1tTag = ut.mult(v1t);
        v2nTag = un.mult(v2nTag);
        const v2tTag = ut.mult(v2t);

        // update velocities
        this.velocity = v1nTag.add(v1tTag);
        ball.velocity = v2nTag.add(v2tTag);

        this.isMoving = true;
        ball.isMoving = true;

        return ball.color;

    }

    checkTableCollision(borders, holeRad){
        if(!this.isMoving){
            return;
        }

        let left = [borders.LEFT_X, borders.LEFT_X + holeRad];
        let center = [borders.LEFT_X + (borders.RIGHT_X - borders.LEFT_X)/2 - holeRad, borders.LEFT_X + (borders.RIGHT_X - borders.LEFT_X)/2 + holeRad];
        let right = [borders.RIGHT_X - holeRad, borders.RIGHT_X];
        let top = [borders.TOP_Y, borders.TOP_Y + holeRad];
        let bottom = [borders.BOTTOM_Y - holeRad, borders.BOTTOM_Y];

        let inLeft = (this.position.x > left[0] && this.position.x < left[1]);
        let inCenter = (this.position.x > center[0] && this.position.x < center[1]);
        let inRight = (this.position.x > right[0] && this.position.x < right[1]);
        let inTop = (this.position.y > top[0] && this.position.x < top[1]);
        let inBottom = (this.position.y > bottom[0] && this.position.x < bottom[1]);

        let collide = false;
        if(this.position.y <= borders.TOP_Y + this.radius && !(inLeft || inCenter || inRight)){
            this.velocity.y = -this.velocity.y;
            this.position.y = borders.TOP_Y + this.radius + 0.001;
            collide = true;
        }

        if(this.position.y >= borders.BOTTOM_Y - this.radius && !(inLeft || inCenter || inRight)){
            this.velocity.y = -this.velocity.y;
            this.position.y = borders.BOTTOM_Y - this.radius - 0.001;
            collide = true;
        }

        if(this.position.x >= borders.RIGHT_X - this.radius && !(inTop || inBottom)){
            this.velocity.x = -this.velocity.x;
            this.position.x = borders.RIGHT_X - this.radius - 0.001;
            collide = true;
        }

        if(this.position.x <= borders.LEFT_X + this.radius && !(inTop || inBottom)){
            this.velocity.x = -this.velocity.x;
            this.position.x = borders.LEFT_X + this.radius + 0.001;
            collide = true;
        }

        if(collide){
            this.velocity = this.velocity.mult(0.98);
        }
    }

    hit(power, angle){
        
        this.velocity = new Vector2D(power * Math.cos(angle), power * Math.sin(angle));
        this.isMoving = true;
    }

    draw(ctx){
        
        //ctx.drawImage(this.img, this.x - this.radius,this.y - this.radius, this.diameter, this.diameter)
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.globalAlpha = this.opacity/100;
        //ctx.scale(this.opacity/100, this.opacity/100);
        ctx.drawImage(this.img, -BALL_ORIGIN.x, -BALL_ORIGIN.y);
        ctx.restore();

        // red stroke
        // ctx.beginPath();
        // ctx.arc(this.position.x-1, this.position.y, this.radius, 0, 2*Math.PI);
        // ctx.strokeStyle="red";
        // ctx.stroke();

        // ctx.save();
        // ctx.translate(this.position.x, this.position.y);
        // ctx.drawImage(this.mask, -BALL_ORIGIN.x, -BALL_ORIGIN.y);
            
        // ctx.globalCompositeOperation="multiply";
        // ctx.drawImage(this.img, -BALL_ORIGIN.x, -BALL_ORIGIN.y);

        // ctx.restore(); 
    }

}