const STICK_ORIGIN = new Vector2D(970, 10);
const STICK_SHOOT_ORIGIN = new Vector2D(950, 10);
const MAX_POWER = 250;

class Stick{
    
    constructor(position, toShoot, stickOrigin, stickShootOrigin){
        this.position = position;
        this.stickOrigin = stickOrigin;
        this.stickShootOrigin = stickShootOrigin;
        this.origin = this.stickOrigin.copy();
        this.angle = 0;
        this.power = 0;
        this.toShoot = toShoot;

        this.img=new Image();
        this.img.src="images/stick.png";
    }

    update(posX, posY, ball){
        
        this.updateAngle(posX, posY, ball);
    }

    updateAngle(posX, posY){
        let opposite = posY - this.position.y;
        let adjacent = posX - this.position.x; 
            
        this.angle = Math.atan2(opposite, adjacent);
        this.power = Math.sqrt(Math.pow(opposite,2) + Math.pow(adjacent,2));
        this.power = this.power > MAX_POWER ? MAX_POWER : this.power;
        
    }

    shoot(){
        if(!this.toShoot.isMoving){
            this.toShoot.hit(this.power*30, this.angle);
            this.power = 0;
            this.origin = this.stickShootOrigin.copy();
        }
    }

    reposition(position){
        this.position = position;
        this.origin = this.stickOrigin.copy();
    }

    draw(ctx){
        
        //ctx.drawImage(this.img, this.position.x,this.position.y, 700, 700*this.img.height/this.img.width);
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.img, -this.origin.x - this.power, -this.origin.y);
        ctx.restore();

        // guide line
        let grad = ctx.createLinearGradient(0, 0, -400, 0);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle + Math.PI);
        // ctx.drawImage(this.img, -this.origin.x - this.power, -this.origin.y);
        ctx.lineWidth=3;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.setLineDash([10,10]);
        ctx.moveTo(0, 0);
        ctx.lineTo(0 - 400, 0);
        ctx.stroke();
        ctx.restore();
    
    }
}