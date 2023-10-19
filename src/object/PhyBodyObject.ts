import { Color, Graphics } from "pixi.js";
import { Body, Circle } from "planck";
import { Helper } from "../helper/helper";

export class PhyBodyObject extends Graphics{
    private _body?:Body;
    public setBody(body:Body){
        this._body = body;

        this.clear();
        this.beginFill(new Color("red").toArray(), 1);
        let size = 10;
        const fixture = this._body?.getFixtureList();
        if(fixture){
            size = Helper.VecToPos(fixture.getShape().getRadius());
        }
        this.drawCircle(0, 0, size);
    }

    public setSize(size:number){
        const fixture = this._body?.getFixtureList()
        if(fixture){
            this._body?.destroyFixture(fixture);
        }

        this._body?.createFixture({
            shape: new Circle(Helper.PosToVec(size)),
            density: 1.0,
            friction: 0.3,
        });

        this.clear();
        this.beginFill(new Color("red").toArray(), 1);
        this.drawCircle(0, 0, size);
    }

    public onUpdatePosition(_:number){
        if(this._body){
            this.position.set(this._body.getPosition().x * 50, this._body.getPosition().y * 50);
        }
    }
}