import { Assets, Color, Graphics, Sprite, Text, UnresolvedAsset } from "pixi.js";
import { IBounds } from "../object/PhyObject";
import { ScreenBaseContainer } from "./SceneBase";
import { Edge, Vec2, World } from "planck";
import { IPhyBodyData, ObjLvData, PhyBodyObject } from "../object/PhyBodyObject";
import { Helper } from "../helper/helper";

export class WaterSceneBox2dScene extends ScreenBaseContainer {
    private _bound!: IBounds;
    private _phyWorld?: World;

    private phyObjs:PhyBodyObject[] = [];
     
    private matchPair:{[key:number]:PhyBodyObject} = {}
    
    private _nextBlock:number = 1;
    private _nextBlockObj?:Graphics;

    override onInit(): void {
        super.onInit();
        this._bound = {
            x1: 20, y1: 100,
            x2: this.screenWidth - 20, y2: this.screenHeight - 100,
        }

        const assetList:UnresolvedAsset[] = [];
        for(let vi = 1; vi <=11; ++vi){
            assetList.push({
                alias: `icon${vi}`,
                src: `hk_assets/game_icon${vi}.png`,
            });
        }
        Assets.load(assetList).then(()=>{
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
                    position: new Vec2(Helper.PosToVec(evt.global.x), Helper.PosToVec(this._bound!.y1))
                });

                if(anBody){
                    const pBody = new PhyBodyObject();
                    pBody.setBody(anBody, this._nextBlock);

                    this.phyObjs.push(pBody);
                    this.addChild(pBody);

                    this.getNextBlock();
                    // pBody.eventMode = "static";
                    // pBody.cursor = "pointer";
                    // pBody.on('pointerdown', ()=>{
                    //     pBody.setSize(30);
                    // });
                }
            });

            this._phyWorld = new World({ gravity: new Vec2(0, 20) });

            this._phyWorld.on('post-solve', (contact)=>{
                const fA = contact.getFixtureA();
                const fB = contact.getFixtureB();

                const usrDataA = fA.getUserData() as IPhyBodyData;
                const usrDataB = fB.getUserData() as IPhyBodyData;

                if(usrDataA && usrDataB){
                    if(usrDataA.id && usrDataB.id && usrDataA.size === usrDataB.size){
                        if(!this.matchPair[usrDataA.id] && !this.matchPair[usrDataB.id]){
                            this.matchPair[usrDataA.id] = usrDataA.phyBody;
                            this.matchPair[usrDataB.id] = usrDataB.phyBody;
                        }
                    }
                }
            });

            const platform = this._phyWorld.createBody({
                type: 'static',
                // position: this.posToPhyVec((this._bound.x2 - this._bound.x1) * 0.5, this._bound.y2)
                position: new Vec2(0, 0),
            });

            console.log(platform.getPosition());

            platform.createFixture({
                shape: new Edge(new Vec2(Helper.PosToVec(this._bound.x1), Helper.PosToVec(this._bound.y2)), 
                new Vec2(Helper.PosToVec(this._bound.x2), Helper.PosToVec(this._bound.y2))),
                friction: 1,
            });
            platform.createFixture({
                shape: new Edge(new Vec2(Helper.PosToVec(this._bound.x1), Helper.PosToVec(this._bound.y1)), 
                new Vec2(Helper.PosToVec(this._bound.x1), Helper.PosToVec(this._bound.y2)))
            });
            platform.createFixture({
                shape: new Edge(new Vec2(Helper.PosToVec(this._bound.x2), Helper.PosToVec(this._bound.y1)), 
                new Vec2(Helper.PosToVec(this._bound.x2), Helper.PosToVec(this._bound.y2)))
            });

            const nextText = new Text("Next : ");
            this.addChild(nextText);
            nextText.position.set(10, 50);
            nextText.anchor.set(0, 0.5);

            this.getNextBlock();
        });
    }

    private getNextBlock():void{
        const _p = Helper.GetRandomNumber(100, 0);
        if(_p < 45){
            this._nextBlock = 1;
        }else if(_p < 90){
            this._nextBlock = 2;
        }else{
            this._nextBlock = 3;
        }
        
        const lvData = ObjLvData[this._nextBlock];
        if(lvData){
            this._nextBlockObj?.destroy();
            
            const hintSize = 20;
            this._nextBlockObj = new Graphics();
            this._nextBlockObj.beginFill(new Color(lvData.color).toArray(), 0);
            // this._nextBlockObj.drawCircle(0, 0, 30);

            const pic = Sprite.from(lvData.asset);
            pic.scale.set(hintSize / lvData.size);
            pic.anchor.set(0.5, 0.5);
            // pic.alpha = 0.5;
            this._nextBlockObj.addChild(pic);
            
            this._nextBlockObj.position.set(120, 50);
            this.addChild(this._nextBlockObj);
        }

    }
    override onFrameUpdated(_: number): void {
        const matchList = Object.entries(this.matchPair);
        if(matchList.length > 0){
            this.matchPair = {};
            let del = false;
            for(const [_, phyObj] of matchList){
                if(del){
                    this._phyWorld?.destroyBody(phyObj.body!);
                    phyObj.destroy();
    
                    const objIn = this.phyObjs.indexOf(phyObj);
                    if(objIn > -1){
                        this.phyObjs.splice(objIn, 1);
                    }
                }else{
                    del = !phyObj.levelUp();
                }

                del = !del;
            }
        }
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