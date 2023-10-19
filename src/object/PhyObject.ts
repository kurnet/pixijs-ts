import { Color, Graphics } from "pixi.js";
import { Helper } from "../helper/helper";

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
    private _forces:IVector2D[] = [];
    private _gStack:number = 0;

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
        const color = Helper.GetRandomNumber(10, 0);
        let fillColor:Color;
        if(color < 3){
            fillColor = new Color("red");
        }else if (color < 6){
            fillColor = new Color("yellow");
        }else{
            fillColor = new Color("blue");
        }
        this.beginFill(fillColor.toArray(), 1);
        this.drawCircle(0, 0, this._radius);
    }

    public setSize(_r:number){
        this._radius = _r;
        this.draw();
    }

    public frameUpdate(dt:number, bound:IBounds){

        this.acceleration.x = this.acceleration.x * 0.99;
        this.acceleration.y = (this.acceleration.y * 0.99);


        const deltaSec = dt / 1000;

        const pos = this.position;

        const fixRange = 0;
        pos.x += Math.abs(this.acceleration.x) < fixRange ? 0 : this.acceleration.x * deltaSec;
        pos.y += Math.abs(this.acceleration.y) < fixRange ? 0 : this.acceleration.y * deltaSec;

        pos.x = Math.min(bound.x2 - this._radius, Math.max(pos.x, bound.x1 + this._radius));
        pos.y = Math.min(bound.y2 - this._radius, Math.max(pos.y, bound.y1 + this._radius));

        if(pos.y === bound.y2 - this._radius) {
            if( this.acceleration.y > GRAVITY / 2 ){
                this.acceleration.y = this.acceleration.y * -0.5;
            }
            this._gStack = 0;
        }

        // if(Math.abs(this.acceleration.x) < 1 && Math.abs(this.acceleration.y) < 1){
        //     this.acceleration.x = Helper.GetRandomNumber(200, -100);
        //     this.acceleration.y = Helper.GetRandomNumber(200, -100);
        // }
    }

    public calForce(){
        if(this._forces.length > 0){
            const finalForce:IVector2D = {x:0, y:0};
            this._forces.forEach(force=>{
                finalForce.x += force.x;
                finalForce.y += force.y;
            });
            this.acceleration.x = finalForce.x;
            this.acceleration.y = finalForce.y;

            if(this.acceleration.y < -GRAVITY){
                this._gStack = 0;
            }

            this.acceleration.y += GRAVITY * this._gStack;
        }else{
            this.acceleration.y = GRAVITY * this._gStack;
        }
        
        this._gStack += 1;
        
        this._forces = [];
    }

    public applyForce(force:IVector2D){
        this._forces.push(force);
    }
}