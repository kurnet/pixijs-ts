import { Color, Graphics } from "pixi.js";
import { IBounds } from "../object/PhyObject";
import { ScreenBaseContainer } from "./SceneBase";
import { Edge, Vec2, World, Circle } from "planck";
import { PhyBodyObject } from "../object/PhyBodyObject";
import { Helper } from "../helper/helper";

export class WaterSceneBox2dScene extends ScreenBaseContainer {
    private _bound?: IBounds;
    private _phyWorld?: World;

    private phyObjs:PhyBodyObject[] = [];

    override onInit(): void {
        super.onInit();

        this._bound = {
            x1: 20, y1: 100,
            x2: this.screenWidth - 20, y2: this.screenHeight - 100,
        }
        const playArea = new Graphics();
        playArea.beginFill(new Color("green").toArray(), 1);
        playArea.drawRect(this._bound.x1, this._bound.y1, this._bound.x2 - this._bound.x1, this._bound.y2 - this._bound.y1);
        this.addChild(playArea);
        playArea.eventMode = "static";
        playArea.cursor = "pointer";
        playArea.on('pointerdown', (evt)=>{
            // this.ball!.acceleration.x = 0;
            // this.ball?.position.set(evt.global.x, evt.global.y);
            const anBody = this._phyWorld?.createBody({
                type: "dynamic",
                position: new Vec2(Helper.PosToVec(evt.global.x), Helper.PosToVec(evt.global.y))
            });
            anBody?.createFixture({
                shape: new Circle(Helper.PosToVec(Helper.GetRandomNumber(50, 10))),
                density: 1.0,
                friction: 0.3,
            });

            if(anBody){
                const pBody = new PhyBodyObject();
                pBody.setBody(anBody);
    
                this.phyObjs.push(pBody);
                this.addChild(pBody);


                pBody.eventMode = "static";
                pBody.cursor = "pointer";
                pBody.on('pointerdown', ()=>{
                    pBody.setSize(Helper.GetRandomNumber(20, 10));
                });
            }
        });

        this._phyWorld = new World({ gravity: new Vec2(0, 10) });
        const platform = this._phyWorld.createBody({
            type: 'static',
            // position: this.posToPhyVec((this._bound.x2 - this._bound.x1) * 0.5, this._bound.y2)
            position: new Vec2(0, 0),
        });

        console.log(platform.getPosition());

        platform.createFixture({
            shape: new Edge(new Vec2(Helper.PosToVec(this._bound.x1), Helper.PosToVec(this._bound.y2)), 
            new Vec2(Helper.PosToVec(this._bound.x2), Helper.PosToVec(this._bound.y2))),
        });
        platform.createFixture({
            shape: new Edge(new Vec2(Helper.PosToVec(this._bound.x1), Helper.PosToVec(this._bound.y1)), 
            new Vec2(Helper.PosToVec(this._bound.x1), Helper.PosToVec(this._bound.y2)))
        });
        platform.createFixture({
            shape: new Edge(new Vec2(Helper.PosToVec(this._bound.x2), Helper.PosToVec(this._bound.y1)), 
            new Vec2(Helper.PosToVec(this._bound.x2), Helper.PosToVec(this._bound.y2)))
        });

    }

    override onFrameUpdated(_: number): void {
        this._phyWorld?.step(1 / 60, 10, 8);

        this.phyObjs.forEach(obj=>{
            obj.onUpdatePosition(_); 
        });
    }

    // private posToPhyVec(x:number, y:number): Vec2{
    //     const centerY = this.screenHeight / 2;
    //     const vecX = x / 50;
    //     const vecY = (centerY - y) / 50;
    //     return new Vec2(vecX, vecY);
    // }

}