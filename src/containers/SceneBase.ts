import { Application, Container } from "pixi.js";

export class ScreenBaseContainer extends Container {
    protected screenWidth:number;
    protected screenHeight:number;

    constructor(app:Application) {
        super();
        this.screenWidth = app.screen.width;
        this.screenHeight = app.screen.height;

        this.once('added', this.screenInited);
    }

    screenInited():void {
        this.on('added', this.addedToScreen);
    }

    addedToScreen():void { 
    }

    update(_:number) { }
}