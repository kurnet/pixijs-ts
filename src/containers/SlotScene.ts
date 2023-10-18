import { Assets, BlurFilter, Container, Graphics, Sprite, TextStyle, Texture, Text } from "pixi.js";
import { ScreenBaseContainer } from "./SceneBase";
import { Easing, Tween } from "tweedle.js";


interface IReel{
    container: Container,
    symbols: Sprite[],
    position: number,
    previousPosition: number,
    blur: BlurFilter,
};

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

export class SlotScene extends ScreenBaseContainer {
    private reels:IReel[] = [];
    private slotTextures:Texture[] = [];
    private running:boolean = false;
    
    override onInit(): void {
        super.onInit();

        
        Assets.load([
            'https://pixijs.com/assets/eggHead.png',
            'https://pixijs.com/assets/flowerTop.png',
            'https://pixijs.com/assets/helmlok.png',
            'https://pixijs.com/assets/skully.png',
        ]).then(this.onAssetsLoaded.bind(this));
    }

    override onAdded(): void {
        super.onAdded();
    }

    private onAssetsLoaded()
    {
        // Create different slot symbols.
        this.slotTextures = [
            Texture.from('https://pixijs.com/assets/eggHead.png'),
            Texture.from('https://pixijs.com/assets/flowerTop.png'),
            Texture.from('https://pixijs.com/assets/helmlok.png'),
            Texture.from('https://pixijs.com/assets/skully.png'),
        ];

        // Build the reels
        const reelContainer = new Container();

        for (let i = 0; i < 5; i++)
        {
            const rc = new Container();

            rc.x = i * REEL_WIDTH;
            reelContainer.addChild(rc);

            const reel:IReel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new BlurFilter(),
            };

            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];

            // Build the symbols
            for (let j = 0; j < 4; j++)
            {
                const symbol = new Sprite(this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)]);
                // Scale the symbol to fit symbol area.

                symbol.y = j * SYMBOL_SIZE;
                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            this.reels.push(reel);
        }
        this.addChild(reelContainer);

        // Build top & bottom covers and position reelContainer
        const margin = (this.screenHeight - SYMBOL_SIZE * 3) / 2;

        reelContainer.y = margin;
        reelContainer.x = Math.round(this.screenWidth - REEL_WIDTH * 5);
        const top = new Graphics();

        top.beginFill(0, 1);
        top.drawRect(0, 0, this.screenWidth, margin);
        const bottom = new Graphics();

        bottom.beginFill(0, 1);
        bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, this.screenWidth, margin);

        // Add play text
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });

        const playText = new Text('Spin the wheels!', style);

        playText.x = Math.round((bottom.width - playText.width) / 2);
        playText.y = this.screenHeight - margin + Math.round((margin - playText.height) / 2);
        bottom.addChild(playText);

        // Add header text
        const headerText = new Text('PIXI MONSTER SLOTS!', style);

        headerText.x = Math.round((top.width - headerText.width) / 2);
        headerText.y = Math.round((margin - headerText.height) / 2);
        top.addChild(headerText);

        this.addChild(top);
        this.addChild(bottom);

        // Set the interactivity.
        bottom.eventMode = 'static';
        bottom.cursor = 'pointer';
        bottom.addListener('pointerdown', () =>
        {
            this.startPlay();
        });

        // let running = false;

        // // Reels done handler.
        // function reelsComplete()
        // {
        //     running = false;
        // }

        // // Listen for animate update.
        // app.ticker.add((delta) =>
        // {
        // // Update the slots.
        //     for (let i = 0; i < reels.length; i++)
        //     {
        //         const r = reels[i];
        //         // Update blur filter y amount based on speed.
        //         // This would be better if calculated with time in mind also. Now blur depends on frame rate.

        //         r.blur.blurY = (r.position - r.previousPosition) * 8;
        //         r.previousPosition = r.position;

        //         // Update symbol positions on reel.
        //         for (let j = 0; j < r.symbols.length; j++)
        //         {
        //             const s = r.symbols[j];
        //             const prevy = s.y;

        //             s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        //             if (s.y < 0 && prevy > SYMBOL_SIZE)
        //             {
        //                 // Detect going over and swap a texture.
        //                 // This should in proper product be determined from some logical reel.
        //                 s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
        //                 s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
        //                 s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        //             }
        //         }
        //     }
        // });
    }

    // Function to start playing.
    private startPlay()
    {
        if (this.running) return;
        this.running = true;

        for (let i = 0; i < this.reels.length; i++)
        {
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;

            const tween =  new Tween(r).to({position:target}, time).easing(Easing.Back.Out);
            if(i === this.reels.length - 1){
                tween.onComplete(() => { 
                    this.running = false; 
                    console.log("Ended"); 
                });
                console.log("Started");
            }
            tween.start();
            // tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }
    
    private onReelUpdate(_:number):void{
        for (let i = 0; i < this.reels.length; i++)
        {
            const r = this.reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.

            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;
        
            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++)
            {
                const s = r.symbols[j];
                const prevy = s.y;
        
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE)
                {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    }
    override onFrameUpdated(_: number): void {
        super.onFrameUpdated(_);
        this.onReelUpdate(_);
    }
}



// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
// const tweening = [];

// function tweenTo(object, property, target, time, easing, onchange, oncomplete)
// {
//     const tween = {
//         object,
//         property,
//         propertyBeginValue: object[property],
//         target,
//         easing,
//         time,
//         change: onchange,
//         complete: oncomplete,
//         start: Date.now(),
//     };

//     tweening.push(tween);

//     return tween;
// }
// // Listen for animate update.
// app.ticker.add((delta) =>
// {
//     const now = Date.now();
//     const remove = [];

//     for (let i = 0; i < tweening.length; i++)
//     {
//         const t = tweening[i];
//         const phase = Math.min(1, (now - t.start) / t.time);

//         t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
//         if (t.change) t.change(t);
//         if (phase === 1)
//         {
//             t.object[t.property] = t.target;
//             if (t.complete) t.complete(t);
//             remove.push(t);
//         }
//     }
//     for (let i = 0; i < remove.length; i++)
//     {
//         tweening.splice(tweening.indexOf(remove[i]), 1);
//     }
// });

// // Basic lerp funtion.
// function lerp(a1, a2, t)
// {
//     return a1 * (1 - t) + a2 * t;
// }

// // Backout function from tweenjs.
// // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
// function backout(amount)
// {
//     return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
// }
