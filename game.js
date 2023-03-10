// colors
const WHITE = 3;
const BLACK = 4;
const RED = 1;
const YELLOW = 2;

class Game{
    constructor(width, height){
        this.cnvsW = width;
        this.cnvsH = height;
        this.ballRadius = height*0.025;
        this.table=new Table(this.cnvsW/2, this.cnvsH/2, this.cnvsH*1.4, this.cnvsH*0.8);
        this.balls=[   new Ball(new Vector2D(this.table.x - this.table.innerWidth*0.25,this.table.y),WHITE,this.ballRadius),
                        new Ball(new Vector2D(width*0.5+this.ballRadius*13.2,height*0.5),BLACK,this.ballRadius),
                        // yellows
                        new Ball(new Vector2D(width*0.5+this.ballRadius*11.6,height*0.5+this.ballRadius),YELLOW,this.ballRadius),//3
                        new Ball(new Vector2D(width*0.5+this.ballRadius*13.2,height*0.5-this.ballRadius*2),YELLOW,this.ballRadius),//4
                        new Ball(new Vector2D(width*0.5+this.ballRadius*14.8,height*0.5-this.ballRadius),YELLOW,this.ballRadius),//8
                        new Ball(new Vector2D(width*0.5+this.ballRadius*14.8,height*0.5+this.ballRadius*3),YELLOW,this.ballRadius),//10;
                        new Ball(new Vector2D(width*0.5+this.ballRadius*16.4,height*0.5-this.ballRadius*2),YELLOW,this.ballRadius),//11
                        new Ball(new Vector2D(width*0.5+this.ballRadius*16.4,height*0.5+this.ballRadius*2),YELLOW,this.ballRadius),//12
                        new Ball(new Vector2D(width*0.5+this.ballRadius*16.4,height*0.5-this.ballRadius*4),YELLOW,this.ballRadius),//14
                        // reds
                        new Ball(new Vector2D(width*0.5+this.ballRadius*10,height*0.5),RED,this.ballRadius),//1
                        new Ball(new Vector2D(width*0.5+this.ballRadius*11.6,height*0.5-this.ballRadius),RED,this.ballRadius),//2
                        new Ball(new Vector2D(width*0.5+this.ballRadius*13.2,height*0.5+this.ballRadius*2),RED,this.ballRadius),//6
                        new Ball(new Vector2D(width*0.5+this.ballRadius*14.8,height*0.5+this.ballRadius),RED,this.ballRadius),//7
                        new Ball(new Vector2D(width*0.5+this.ballRadius*14.8,height*0.5-this.ballRadius*3),RED,this.ballRadius),//9
                        new Ball(new Vector2D(width*0.5+this.ballRadius*16.4,height*0.5),RED,this.ballRadius),//13
                        new Ball(new Vector2D(width*0.5+this.ballRadius*16.4,height*0.5+this.ballRadius*4),RED,this.ballRadius)//15
                    ];
        this.whiteBall = this.balls[0];
        this.stick=new Stick(new Vector2D(346,400), this.whiteBall, new Vector2D(970, 10), new Vector2D(950, 10));

        this.borders = this.table.borders;

        this.score_player1=0;   // red
        this.score_player2=0;   // yellow

        this.currentTurn = 1;   // red player begins game
        this.status = 0;        // 0 - active, 1 - red won, 2 - yellow won, 3 - tie (manual exit usually)
        this.switchTurns = true;
        this.turnOver = false;
        this.isShot = false;
        this.hitRes = null;
        this.firstValidHit = null;

        this.repositionWhiteBall = false;
    }

    update(){

        if(this.status != 0){
            return;
        }

        // define the end of one turn
        if(!this.ballsMoving() && this.isShot){
            this.turnOver = true;
            this.isShot = false;
            if(this.hitRes == null){
                this.switchTurns = true;
            }
            this.hitRes = null;
        }

        // check if switching turns is needed
        if(this.turnOver){
            this.turnOver = false;
            if(this.switchTurns){
                if(this.currentTurn == 1){
                    this.currentTurn = 2;
                }
                else{
                    this.currentTurn = 1;
                }
            }
        }

        if(!this.repositionWhiteBall){
            this.findCollisions();
        }else{
            if(this.checkValidReposition()){
                this.balls[0].opacity = 100;
            }
            else{
                this.balls[0].opacity = 50;
            }  
        }
        
        for(let i=0; i<this.balls.length; i++){
            this.balls[i].update();
        }

        if(!this.ballsMoving()){
            // repositiion stick
            this.stick.reposition(this.balls[0].position.copy());
        }

        if(this.whiteBall.inHole && this.whiteBall.opacity == 0){
            this.repositionWhiteBall = true;
            this.whiteBall.isVisible = true;
            this.whiteBall.opacity = 100;
            this.whiteBall.inHole = false;
        }      
        
    }

    findCollisions(){
        let res = null;
        for(let i=0; i<this.balls.length; i++){
            if(!this.balls[i].inHole){

                this.balls[i].checkTableCollision(this.borders, this.table.holeRad);
                
                for(let k=0; k<this.table.holes.length; k++){
                    if(!(this.repositionWhiteBall && i==0))
                    res = this.balls[i].checkInHole(this.table.holes[k], this.table.holeRad, this.currentTurn);
                    
                    // red
                    if(this.currentTurn == 1){
                        if(res == 1){
                            this.score_player1++;
                            this.switchTurns = false;
                            this.hitRes = res;
                        }
                        else if(res == 2){
                            this.score_player2++;
                            this.switchTurns = true;
                            this.hitRes = res;
                        }
                        else if(res == 0){
                            this.switchTurns = true;
                            this.hitRes = res;
                        }
                        else if(res == -1 && this.score_player1<7){
                            console.log("red lost!");
                            this.status = 2;
                            this.hitRes = res;
                            return;
                        }
                        else if(res == -1 && this.score_player1==7){
                            console.log("red won!");
                            this.status = 1;
                            this.hitRes = res;
                            return;
                        }
                    }

                    // yellow
                    else{
                        if(res == 1){
                            this.score_player2++;
                            this.switchTurns = false;
                            this.hitRes = res;
                        }
                        else if(res == 2){
                            this.score_player1++;
                            this.switchTurns = true;
                            this.hitRes = res;
                        }
                        else if(res == 0){
                            this.switchTurns = true;
                            this.hitRes = res;
                        }
                        else if(res == -1 && this.score_player2<7){
                            console.log("yellow lost!");
                            this.status = 1;
                            this.hitRes = res;
                            return;
                        }
                        else if(res == -1 && this.score_player2==7){
                            console.log("yellow won!");
                            this.status = 2;
                            this.hitRes = res;
                            return;
                        }
                    }
                }

                for(let j=i+1; j<this.balls.length; j++){
                    if(this.balls[j].isVisible){
                        
                        let ball1 = this.balls[i];
                        let ball2 = this.balls[j];

                        let res = ball1.checkBallCollision(ball2);
                        if((this.balls[i] == 0 ) && (res = 4 || res != this.currentTurn)){
                            this.switchTurns = true;
                        }
                    
                    }
                }
            }
        }

    }

    checkValidReposition(){
        for(let i=1; i<this.balls.length; i++){

            if(this.balls[i].isVisible){
                let n = this.balls[0].position.subtract(this.balls[i].position);
                let dist = n.length();

                if(dist<=this.balls[0].diameter){
                    return false;
                }
            }
        }

        if(this.balls[0].position.x + this.balls[0].radius >= this.borders.RIGHT_X || this.balls[0].position.x - this.balls[0].radius <= this.borders.LEFT_X ||
            this.balls[0].position.y + this.balls[0].radius >= this.borders.BOTTOM_Y || this.balls[0].position.y - this.balls[0].radius <= this.borders.TOP_Y){
               return false; 
            }

        return true;
    }

    ballsMoving(){
        for(let i=0; i<this.balls.length; i++){
            if(this.balls[i].isMoving){
                return true;
            }
        }

        return false;
    }

    resetGame(){

        this.table=new Table(this.cnvsW/2, this.cnvsH/2, this.cnvsH*1.4, this.cnvsH*0.8);
        this.balls=[   new Ball(new Vector2D(this.table.x - this.table.innerWidth*0.25,this.table.y),WHITE,this.ballRadius),
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*13.2,this.cnvsH*0.5),BLACK,this.ballRadius),
                        // yellows
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*11.6,this.cnvsH*0.5+this.ballRadius),YELLOW,this.ballRadius),//3
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*13.2,this.cnvsH*0.5-this.ballRadius*2),YELLOW,this.ballRadius),//4
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*14.8,this.cnvsH*0.5-this.ballRadius),YELLOW,this.ballRadius),//8
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*14.8,this.cnvsH*0.5+this.ballRadius*3),YELLOW,this.ballRadius),//10;
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*16.4,this.cnvsH*0.5-this.ballRadius*2),YELLOW,this.ballRadius),//11
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*16.4,this.cnvsH*0.5+this.ballRadius*2),YELLOW,this.ballRadius),//12
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*16.4,this.cnvsH*0.5-this.ballRadius*4),YELLOW,this.ballRadius),//14
                        // reds
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*10,this.cnvsH*0.5),RED,this.ballRadius),//1
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*11.6,this.cnvsH*0.5-this.ballRadius),RED,this.ballRadius),//2
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*13.2,this.cnvsH*0.5+this.ballRadius*2),RED,this.ballRadius),//6
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*14.8,this.cnvsH*0.5+this.ballRadius),RED,this.ballRadius),//7
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*14.8,this.cnvsH*0.5-this.ballRadius*3),RED,this.ballRadius),//9
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*16.4,this.cnvsH*0.5),RED,this.ballRadius),//13
                        new Ball(new Vector2D(this.cnvsW*0.5+this.ballRadius*16.4,this.cnvsH*0.5+this.ballRadius*4),RED,this.ballRadius)//15
                    ];
        this.whiteBall = this.balls[0];
        this.stick=new Stick(new Vector2D(346,400), this.whiteBall, new Vector2D(970, 10), new Vector2D(950, 10));
        this.borders = this.table.borders;

        this.score_player1=0;   // red
        this.score_player2=0;   // yellow

        this.currentTurn = 1;   // red player begins game
        this.status = 0;        // 0 - active, 1 - red won, 2 - yellow won, 3 - tie (manual exit usually)
        this.switchTurns = true;
        this.turnOver = false;
        this.isShot = false;
        this.hitRes = null;
        this.firstValidHit = null;

        this.repositionWhiteBall = false;

    }

    resize(newWidth, newHeight){
        console.log("W: " + newWidth + " H: " + newHeight);
        let tableProportionChange = newHeight/this.cnvsH;
        let oldWidth = this.cnvsW;
        let oldHeight = this.cnvsH;
        this.cnvsW = newWidth;
        this.cnvsH = newHeight;
        this.ballRadius = newHeight*0.025;
        this.table.resize(newWidth/2, newHeight/2, newHeight*1.4, newHeight*0.8);
        this.borders = this.table.borders;

        for(let i=0; i<this.balls.length; i++){
            let newX = 0;
            let newY = 0;

            if(this.balls[i].position.x < oldWidth/2){
                newX = newWidth/2 - (oldWidth/2 - this.balls[i].position.x)*tableProportionChange;                
            } else {
                newX = newWidth/2 + (this.balls[i].position.x - oldWidth/2)*tableProportionChange;
            }

            if(this.balls[i].position.y < oldHeight/2){
                newY = newHeight/2 - (oldHeight/2 - this.balls[i].position.y)*tableProportionChange;                
            } else {
                newY = newHeight/2 + (this.balls[i].position.y - oldHeight/2)*tableProportionChange;
            }

            this.balls[i].resize(newHeight*0.025, newX, newY);
        }
    }

    draw(ctx){

        ctx.clearRect(0, 0, this.cnvsW, this.cnvsH);

        this.table.draw(ctx);

        for(let i=this.balls.length-1; i>=0; i--){
            if(this.balls[i].isVisible){
                this.balls[i].draw(ctx);
            }
            
        }
        
        if(this.status==0 && !this.ballsMoving()){
            this.stick.draw(ctx);
        }        
    }

}