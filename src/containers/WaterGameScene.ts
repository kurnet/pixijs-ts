import { Color, Graphics } from "pixi.js";
import { ScreenBaseContainer } from "./SceneBase";
import { IBounds, PhyObject } from "../object/PhyObject";
import { Helper } from "../helper/helper";

export class WaterGameScene extends ScreenBaseContainer{
    private _bound?:IBounds;

    private ballsPool:PhyObject[] = [];
    private ball?:PhyObject;

    override onInit(): void {
        super.onInit();

        this._bound = {
            x1: 20, y1: 100,
            x2: this.screenWidth - 40, y2: this.screenHeight - 100,
        }
        const playArea = new Graphics();
        playArea.beginFill(new Color("green").toArray(), 1);
        playArea.drawRect(this._bound.x1, this._bound.y1, this._bound.x2 - this._bound.x1, this._bound.y2 - this._bound.y1);
        this.addChild(playArea);

        this.ball = new PhyObject(10);
        this.ball.draw();
        this.addChild(this.ball);

        this.ballsPool.push(this.ball);
        const push = Helper.CreateCentredText("Push", true);
        push.position.set(this.screenWidth - push.width, 10);
        this.addChild(push); 
        push.on('pointerdown', ()=>{    
            if(this.ball){
                this.ball.setSize(Helper.GetRandomNumber(100, 10));
                this.ball!.acceleration.y += -500;
                this.ball!.acceleration.x += Helper.GetRandomNumber(500, 0) - 250;
            }
        });

        for(let vi = 0; vi < 10; ++vi){
            const ball2 = new PhyObject(Helper.GetRandomNumber(10, 10));
            ball2.x = Helper.GetRandomNumber(this.screenWidth, 0);
            ball2.draw();
            this.addChild(ball2);
    
            this.ballsPool.push(ball2);
        }

    }

    override onAdded(): void {
    }

    override onFrameUpdated(dt: number): void {
        if(this._bound ){
            this.ballsPool.forEach(obj=>{
                obj.frameUpdate(dt, this._bound!);

                const extPool = this.ballsPool.filter(obj2 => obj2 !== obj);
                extPool.forEach(obj2 =>{
                    if(this.IsOverlap(obj, obj2)){
                        let overlapX = this.getOverlapX(obj, obj2);
                        let overlapY = this.getOverlapY(obj, obj2);
                        
                        if(overlapX > 0){
                            overlapX *= 0.5;
                            if(obj.position.x < obj2.position.x){
                                obj.acceleration.x -= overlapX;
                                obj2.acceleration.x += overlapX;
                            }else{
                                obj.acceleration.x += overlapX;
                                obj2.acceleration.x -= overlapX;
                            }
                        }
    
                        if(overlapY > 0){
                            overlapY *= 0.5;
                            if(obj.position.y < obj2.position.y){
                                obj.acceleration.y -= overlapY;
                                obj2.acceleration.y += overlapY;
                            }else{
                                obj.acceleration.y += overlapY;
                                obj2.acceleration.y -= overlapY;
                            }
                        }
                    }
                })
            });
        }
    }

    public getOverlapX(obj1:PhyObject, obj2:PhyObject):number{
        const distX = Math.abs(obj1.position.x - obj2.position.x);
        const totalSize = obj1.radius + obj2.radius;

        return totalSize - distX;
    }
    public getOverlapY(obj1:PhyObject, obj2:PhyObject):number{
        const distY = Math.abs(obj1.position.y - obj2.position.y);
        const totalSize = obj1.radius + obj2.radius;
        
        return totalSize - distY;
    }
    public IsOverlap(obj1:PhyObject, obj2:PhyObject):boolean{
        const distX = obj1.position.x - obj2.position.x;
        const distY = obj1.position.y - obj2.position.y;

        const dist = Math.hypot(distX, distY);

        return dist < obj1.radius + obj2.radius;
    }
   
}