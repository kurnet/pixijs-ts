import { DisplayObjectEvents, Sprite, TextStyle, Texture, Text, Assets } from "pixi.js";
import { ScreenBaseContainer } from "./SceneBase";
import { Helper } from "../helper/helper";

export const EVT_START_PRESSED = "evt_start_pressed" as (keyof DisplayObjectEvents);
export const EVT_SLOT_PRESSED = "evt_slot_pressed" as (keyof DisplayObjectEvents);
export const EVT_WATER_PRESSED = "evt_water_pressed" as (keyof DisplayObjectEvents);

export class MainMenuContainer extends ScreenBaseContainer {
    override onInit() {
        super.onInit();
        
        Assets.add('btnPlay0', "btnPlayNormal.png");
        Assets.add('btnPlay1', "btnPlayPressed.png");
        Assets.load(["btnPlay0", "btnPlay1"]).then(()=>{
            const texPlayNormal = Texture.from("btnPlay0");
            const texPlayPressed = Texture.from("btnPlay1");
    
            const btnPlay = Sprite.from(texPlayNormal);
            this.addChild(btnPlay);
    
            btnPlay.x = this.screenWidth / 2;
            btnPlay.y = this.screenHeight * 0.6;
    
            btnPlay.scale.set(0.5, 0.5);
            btnPlay.anchor.set(0.5, 0.5);
            btnPlay.eventMode = "static";
            btnPlay.cursor = 'pointer';
            btnPlay.on('pointerdown', () => {
                btnPlay.texture = texPlayPressed;
                Helper.TimeoutPromise(300).then(()=>{
                    this.emit(EVT_START_PRESSED);
    
                    btnPlay.texture = texPlayNormal;
                });
            });
    
            const style = new TextStyle({
                fill: "#11ff00",
                fontFamily: "Comic Sans MS",
                fontSize: 64,
                fontVariant: "small-caps",
                fontWeight: "bold",
                strokeThickness: 2
            });
            const txtStart = new Text('Start', style);
            txtStart.anchor.set(0.5, 0.5);
            txtStart.position.set(this.screenWidth/2, this.screenHeight/2);
            this.addChild(txtStart);


            const slotStyle = Object.assign({}, style);
            slotStyle.fill = "#33ffff";
            slotStyle.fontSize = 42;

            const txtSlot = new Text(`Slot Testing`, slotStyle);
            txtSlot.anchor.set(0.5, 0.5);
            txtSlot.position.set(this.screenWidth/2, btnPlay.position.y + 100);
            this.addChild(txtSlot);

            txtSlot.eventMode = "static";
            txtSlot.cursor = "pointer";
            txtSlot.on('pointerdown', ()=>{
                this.emit(EVT_SLOT_PRESSED);
            });

            const txtWater = Helper.CreateCentredText("Watermelon", true);
            txtWater.position.set(this.screenWidth /2, txtSlot.position.y + 50);
            this.addChild(txtWater);

            txtWater.on('pointerdown', ()=>{
                this.emit(EVT_WATER_PRESSED);
            })


        });
    }
}