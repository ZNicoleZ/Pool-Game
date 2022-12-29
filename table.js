class Table{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.borderWidth=height/20;
        this.innerWidth=width-2*this.borderWidth;
        this.innerHeight=height-2*this.borderWidth;

        this.borders = {
            TOP_Y: this.y-this.innerHeight/2,
            RIGHT_X: this.x+this.innerWidth/2,
            BOTTOM_Y: this.y+this.innerHeight/2,
            LEFT_X: this.x-this.innerWidth/2
        }

        this.holeRad=this.borderWidth*0.8;
        this.holes = [  new Vector2D(this.borders.LEFT_X,this.borders.TOP_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth/2,this.borders.TOP_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth,this.borders.TOP_Y),
                        new Vector2D(this.borders.LEFT_X,this.borders.BOTTOM_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth/2,this.borders.BOTTOM_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth,this.borders.BOTTOM_Y)        
                        ];

        this.greenImg=new Image();
        this.greenImg.src="images/green_texture2.jpg";
        this.woodImg=new Image();
        this.woodImg.src="images/wood_texture2.jpg";

    }

    resize(newX, newY, newWidth, newHeight){
        this.x=newX;
        this.y=newY;
        this.width=newWidth;
        this.height=newHeight;

        this.borderWidth=newHeight/20;
        this.innerWidth=newWidth-2*this.borderWidth;
        this.innerHeight=newHeight-2*this.borderWidth;

        this.borders = {
            TOP_Y: this.y-this.innerHeight/2,
            RIGHT_X: this.x+this.innerWidth/2,
            BOTTOM_Y: this.y+this.innerHeight/2,
            LEFT_X: this.x-this.innerWidth/2
        }

        this.holeRad=this.borderWidth*0.8;
        this.holes = [  new Vector2D(this.borders.LEFT_X,this.borders.TOP_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth/2,this.borders.TOP_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth,this.borders.TOP_Y),
                        new Vector2D(this.borders.LEFT_X,this.borders.BOTTOM_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth/2,this.borders.BOTTOM_Y),
                        new Vector2D(this.borders.LEFT_X+this.innerWidth,this.borders.BOTTOM_Y)        
                        ];
    }

    drawRoundRect(ctx, xx,yy, ww,hh, rad, fill, stroke){
        
        ctx.beginPath();
        ctx.moveTo(xx+rad, yy);
        ctx.arcTo(xx+ww, yy,    xx+ww, yy+hh, rad);
        ctx.arcTo(xx+ww, yy+hh, xx,    yy+hh, rad);
        ctx.arcTo(xx,    yy+hh, xx,    yy,    rad);
        ctx.arcTo(xx,    yy,    xx+ww, yy,    rad);
        if (stroke) ctx.stroke();
        if (fill)   ctx.fill();

    }

    draw(ctx){
        // brown frame
        ctx.save();
        
        // ctx.roundRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height, 15); // NOT SUPPORTED ON FIREFOX
        this.drawRoundRect(ctx, this.x-this.width/2, this.y-this.height/2, this.width, this.height, 15)
        ctx.shadowColor = "#311432";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        ctx.fill();
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle="#793802";
        ctx.fill();

        ctx.drawImage(this.woodImg, this.x-this.width/2, this.y-this.height/2, this.width, this.height);

        ctx.restore();

        // green area
        ctx.save();

        ctx.beginPath();
        ctx.rect(this.borders.LEFT_X, this.borders.TOP_Y, this.innerWidth, this.innerHeight);
        ctx.fillStyle="green";
        ctx.fill();
        ctx.closePath();
        
        ctx.shadowColor = "black";
        ctx.shadowBlur = 50;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.drawImage(this.greenImg, this.borders.LEFT_X, this.borders.TOP_Y, this.innerWidth, this.innerHeight);
        ctx.restore();
        
        // lines
        ctx.lineWidth=3;
        ctx.strokeStyle="white";
        ctx.beginPath();
        ctx.moveTo(this.borders.LEFT_X + this.innerWidth*0.25, this.borders.TOP_Y);
        ctx.lineTo(this.borders.LEFT_X + this.innerWidth*0.25, this.borders.BOTTOM_Y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.borders.LEFT_X + this.innerWidth*0.25,this.y,this.innerHeight/5,Math.PI/2,Math.PI/2*3);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.borders.LEFT_X + this.innerWidth*0.25,this.y,this.innerHeight/150,0,2*Math.PI);
        ctx.fillStyle="white";
        ctx.fill();



        // holes
        for(let i=0;i<this.holes.length;i++){
            ctx.beginPath();
            ctx.arc(this.holes[i].x,this.holes[i].y,this.holeRad,0,2*Math.PI);
            ctx.fillStyle="#222021";
            ctx.fill();
        }

        // res stroke
        // ctx.beginPath();
        // ctx.rect(this.borders.LEFT_X, this.borders.TOP_Y, this.innerWidth, this.innerHeight);
        // ctx.strokeStyle="red";
        // ctx.stroke();
        // ctx.closePath();
    }
}
