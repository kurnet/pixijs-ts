import { Text, TextStyle } from "pixi.js";

export class Helper{
    public static GetRandomNumber(num:number, base:number) {
        return Math.floor(Math.random() * num) + base;
    }

    public static TimeoutPromise(ms:number) {
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve(true);
            }, ms);
        });        
    }

    public static CreateCentredText(str:string, interact?:boolean, txtStyle?:TextStyle) : Text {
        const txt = new Text(str, txtStyle);
        txt.anchor.set(0.5, 0.5);

        if(interact){
            txt.eventMode = "static";
            txt.cursor = "pointer";
        }

        return txt;
    }
}