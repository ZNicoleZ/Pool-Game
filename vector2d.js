class Vector2D{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }

    copy(){
        return new Vector2D(this.x, this.y);
    }

    addTo(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    add(vector){
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector){
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    mult(scalar){
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    dot(vector){
        return this.x * vector.x + this.y * vector.y;
    }

    length(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }


}