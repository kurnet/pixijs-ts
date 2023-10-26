import { Container, Sprite } from "pixi.js";
import { Body, Circle } from "planck";
import { Helper } from "../helper/helper";

export interface IPhyBodyData {
    id: number,
    size: number,
    phyBody: PhyBodyObject,
};

export interface ILevelData {
    size: number,
    color: string,
    asset: string,
}

export const ObjLvData: { [key: number]: ILevelData } = {};
ObjLvData[1] = { color: "red", size: 35, asset: "icon1" };
ObjLvData[2] = { color: "white", size: 45, asset: "icon2" };
ObjLvData[3] = { color: "blue", size: 73, asset: "icon3" };
ObjLvData[4] = { color: "yellow", size: 70, asset: "icon4" };
ObjLvData[5] = { color: "black", size: 85, asset: "icon5" };
ObjLvData[6] = { color: "grey", size: 120, asset: "icon6" };
ObjLvData[7] = { color: "grey", size: 155, asset: "icon7" };
ObjLvData[8] = { color: "grey", size: 160, asset: "icon8" };
ObjLvData[9] = { color: "grey", size: 190, asset: "icon9" };
ObjLvData[10] = { color: "grey", size: 220, asset: "icon10" };
ObjLvData[11] = { color: "grey", size: 290, asset: "icon11" };

export class PhyBodyObject extends Container {
    private static _count: number = 1;

    private _lv: number = 0;
    private _body?: Body;
    public get body(): Body | undefined {
        return this._body;
    }

    public setBody(body: Body, lv: number) {
        this._body = body;

        this._body.setAngularDamping(1);

        // this.clear();

        const lvData = ObjLvData[lv];
        if (lvData) {
            this._lv = lv;
            this.setSize(lvData.size);
        }
    }

    public setSize(size: number) {
        const fixture = this._body?.getFixtureList()
        if (fixture) {
            this._body?.destroyFixture(fixture);
        }

        const usrData: IPhyBodyData = {
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

        // this.clear();
        this.removeChildren();

        // this.beginFill(new Color(ObjLvData[this._lv].color).toArray(), 1);
        // this.drawCircle(0, 0, size);
        
        const pic = Sprite.from(ObjLvData[this._lv].asset);
        pic.scale.set(0.5);
        pic.anchor.set(0.5, 0.5);
        // pic.alpha = 0.5;
        this.addChild(pic);
    }   

    public onUpdatePosition(_: number) {
        if (this._body) {
            this.position.set(this._body.getPosition().x * 50, this._body.getPosition().y * 50);
            this.rotation = this._body.getTransform().q.getAngle();
        }
    }

    public levelUp(): boolean {
        const nextLv = this._lv + 1;
        const lvData = ObjLvData[nextLv];
        if (lvData) {
            this._lv = nextLv;
            this.setSize(lvData.size);
            return true;
        }
        return false;
    }

}