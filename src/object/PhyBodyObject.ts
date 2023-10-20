import { Color, Graphics } from "pixi.js";
import { Body, Circle } from "planck";
import { Helper } from "../helper/helper";

export interface IPhyBodyData {
    id:number,
    size:number,
    phyBody:PhyBodyObject,
};

export interface ILevelData {
    size: number,
    color: string,
}

const objLv:{[key:number]:ILevelData} = {};
objLv[1] = {color: "red", size: 10};
objLv[2] = {color: "white", size: 20};
objLv[3] = {color: "blue", size: 30};
objLv[4] = {color: "yellow", size: 40};
objLv[5] = {color: "black", size: 50};
objLv[6] = {color: "grey", size: 60};

export class PhyBodyObject extends Graphics{
    private static _count:number = 1;
    
    private _lv:number = 0;
    private _body?:Body;
    public get body() : Body | undefined {
        return this._body;
    }
    
    public setBody(body:Body, lv:number){
        this._body = body;

        this.clear();

        const lvData = objLv[lv];
        if(lvData){
            this._lv = lv;
            this.setSize( lvData.size);
        }
    }

    public setSize(size:number){
        const fixture = this._body?.getFixtureList()
        if(fixture){
            this._body?.destroyFixture(fixture);
        }

        const usrData:IPhyBodyData = {
            id: PhyBodyObject._count++,
            size,
            phyBody: this,
        };

        this._body?.createFixture({
            shape: new Circle(Helper.PosToVec(size)),
            density: 1.0,
            friction: 0.3,
            userData: usrData,
        });
        
        this.clear();
        this.beginFill(new Color(objLv[this._lv].color).toArray(), 1);
        this.drawCircle(0, 0, size);
    }

    public onUpdatePosition(_:number){
        if(this._body){
            this.position.set(this._body.getPosition().x * 50, this._body.getPosition().y * 50);
        }
    }
    
    public levelUp(): boolean{
        const nextLv = this._lv + 1;
        const lvData = objLv[nextLv];
        if(lvData){
            this._lv = nextLv;
            this.setSize(lvData.size);
            return true;
        }
        return false;
    }

}