import { Color, Graphics } from "pixi.js";

export interface IVector2D{
    x:number,
    y:number
};

export interface IBounds{
    x1:number,
    y1:number,
    x2:number,
    y2:number
}

export const GRAVITY:number = 10;

export class PhyObject extends Graphics {
    private _radius:number = 0;
    public get radius() : number {
        return this._radius;
    }
    
    public acceleration:IVector2D = {x:0, y:0};
    constructor(_r:number){
        super();

        this._radius = _r;
    }

    public draw():void{
        this.clear();
        this.beginFill(new Color("red").toArray(), 1);
        this.drawCircle(0, 0, this._radius);
    }

    public setSize(_r:number){
        this._radius = _r;
        this.draw();
    }

    public frameUpdate(dt:number, bound:IBounds){
        this.acceleration.x = this.acceleration.x * 0.99;
        this.acceleration.y = this.acceleration.y * 0.99 + GRAVITY;

        const deltaSec = dt / 1000;

        const pos = this.position;
        pos.x += this.acceleration.x * deltaSec;
        pos.y += this.acceleration.y * deltaSec;

        pos.x = Math.min(bound.x2 - this._radius, Math.max(pos.x, bound.x1 + this._radius));
        pos.y = Math.min(bound.y2 - this._radius, Math.max(pos.y, bound.y1 + this._radius));

        if(pos.y === bound.y2 - this._radius) {
            if( this.acceleration.y > GRAVITY ){
                this.acceleration.y = this.acceleration.y * -0.5;
            }
        }
    }
}