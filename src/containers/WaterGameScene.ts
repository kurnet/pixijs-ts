import { Color, Graphics } from "pixi.js";
import { ScreenBaseContainer } from "./SceneBase";
import { IBounds, IVector2D, PhyObject } from "../object/PhyObject";
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
        playArea.eventMode = "static";
        playArea.cursor = "pointer";
        playArea.on('pointerdown', (evt)=>{
            // this.ball!.acceleration.x = 0;
            // this.ball?.position.set(evt.global.x, evt.global.y);

            const ball2 = new PhyObject(Helper.GetRandomNumber(50, 10));
            ball2.x = evt.global.x;
            ball2.draw();
            this.addChild(ball2);
    
            this.ballsPool.push(ball2);
        });

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
            const ball2 = new PhyObject(Helper.GetRandomNumber(50, 10));
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
            this.ballsPool.forEach(obj=>obj.calForce());
            this.ballsPool.forEach(obj=>{
                obj.frameUpdate(dt, this._bound!);

                const extPool = this.ballsPool.filter(obj2 => obj2 !== obj);
                extPool.forEach(obj2 =>{
                    if(this.isOverlap(obj, obj2)){
                        // const dist = this.getBallDistance(obj, obj2);
                        let overlapX = this.getOverlapX(obj, obj2);
                        let overlapY = this.getOverlapY(obj, obj2);
                        let distX = Math.abs(obj.position.x - obj2.position.x);
                        let distY = Math.abs(obj.position.y - obj2.position.y);

                        const force:IVector2D = {x:0, y:0};

                        // let ratio = Math.max(distX, distY) / dist;
                        // if(distX > distY){
                        //     overlapX *= ratio; 
                        //     overlapY *= (1 - ratio);
                        // }else{
                        //     overlapY *= ratio;
                        //     overlapX *= (1 - ratio);
                        // }

                        if(distX > distY){
                            overlapX *= distX/distY;
                        }else{
                            overlapY *= distY/distX;
                        }

                        const pow = 1;
                        force.x += Math.max(0, overlapX * pow);
                        force.y += Math.max(0, overlapY * pow);
                        if(obj.position.x > obj2.position.x){
                            force.x *= -1;
                        }
                        if(obj.position.y > obj2.position.y){
                            force.y *= -1;
                        } 

                        obj2.applyForce(force);
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

    public getBallDistance(obj1:PhyObject, obj2:PhyObject):number{
        const distX = obj1.position.x - obj2.position.x;
        const distY = obj1.position.y - obj2.position.y;
 
        return Math.hypot(distX, distY);
    }

    public isOverlap(obj1:PhyObject, obj2:PhyObject):boolean{
        const dist = this.getBallDistance(obj1, obj2);
        return dist < obj1.radius + obj2.radius;
    }
   
}