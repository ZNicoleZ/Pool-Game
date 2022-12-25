class Game{
    constructor(table, balls, stick, width, height){
        this.table = table;
        this.stick = stick;
        this.balls = balls;
        this.whiteBall = this.balls[0];

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

        this.cnvsW = width;
        this.cnvsH = height;
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

    draw(ctx){

        ctx.clearRect(0, 0, this.cnvsW, this.cnvsH);

        this.table.draw(ctx);
        if(this.status==0 && !this.ballsMoving()){
            this.stick.draw(ctx);
        }

        for(let i=this.balls.length-1; i>=0; i--){
            if(this.balls[i].isVisible){
                this.balls[i].draw(ctx);
            }
            
        }        
    }

}