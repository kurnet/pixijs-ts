import { DisplayObjectEvents, Sprite, TextStyle, Texture, Text } from "pixi.js";
import { ScreenBaseContainer } from "./SceneBase";

export const EVT_START_PRESSED = "evt_start_pressed" as (keyof DisplayObjectEvents);
export class MainMenuContainer extends ScreenBaseContainer {
    override screenInited() {
        super.screenInited();

        const texPlayNormal = Texture.from("btnPlayNormal.png");
        const texPlayPressed = Texture.from("btnPlayPressed.png");

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
            setTimeout(() => {
                this.emit(EVT_START_PRESSED);

                btnPlay.texture = texPlayNormal;
            }, 300);
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
    }
}