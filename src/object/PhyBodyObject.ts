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

export const ObjLvData:{[key:number]:ILevelData} = {};
ObjLvData[1] = {color: "red", size: 30};
ObjLvData[2] = {color: "white", size: 40};
ObjLvData[3] = {color: "blue", size: 60};
ObjLvData[4] = {color: "yellow", size: 90};
ObjLvData[5] = {color: "black", size: 130};
ObjLvData[6] = {color: "grey", size: 170};

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

        const lvData = ObjLvData[lv];
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
            density: 1.0 + 0.2 * this._lv,
            friction: 0.3,
            userData: usrData,
        });
        
        this.clear();
        this.beginFill(new Color(ObjLvData[this._lv].color).toArray(), 1);
        this.drawCircle(0, 0, size);
    }

    public onUpdatePosition(_:number){
        if(this._body){
            this.position.set(this._body.getPosition().x * 50, this._body.getPosition().y * 50);
        }
    }
    
    public levelUp(): boolean{
        const nextLv = this._lv + 1;
        const lvData = ObjLvData[nextLv];
        if(lvData){
            this._lv = nextLv;
            this.setSize(lvData.size);
            return true;
        }
        return false;
    }

}