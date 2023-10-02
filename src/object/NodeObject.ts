import { Color, Container, Point, Sprite, Texture } from "pixi.js";
import { Helper } from "../helper/helper";

export interface OnCompleted {
    (node : NodeObject) : void;
}

type AnimeData = {
    target?: Point,
    duration : number;
    time : number;
}

export class NodeObject extends Container{
    public gridX: number = 0;
    public gridY : number = 0;

    public Marked : boolean = false;
    
    public setMarked(_val: boolean){
        this.Marked = _val;
        if(this.Marked){
            this.setColor(0.93, 0.44, 0.44);
        }else{
            this.setColor(1, 1, 1);
        }
    }

    Val : number = 0;
    
    public ImgHolder!: Sprite;
    private _texs: Sprite[] = [];
    private _board?: Sprite;

    private _animeObj : AnimeData;

    // private _callback?: OnCompleted;

    constructor(){
        super();
        this._animeObj = {
            duration : 0,
            time : 0
        };
        this.initialize();
    }

    initialize(){
        for(let vi = 1; vi <= 9; ++ vi){
            this._texs.push(Sprite.from(`num${vi}.png`));
        }

        this._board = new Sprite();
        this._board.width = 64;
        this._board.height = 64;
        
        this._board.texture = Texture.WHITE;
        this.setColor(1, 1, 1);
        this.addChild(this._board)

        this.ImgHolder = new Sprite();
        this.ImgHolder.anchor.set(0.5, 0.5);
        this.ImgHolder.scale.set(0.22, 0.22);
        this.ImgHolder.position.set(32, 32);
        this.addChild(this.ImgHolder);

        // this._board = (this.entity.findByName('eff') as Entity).element;
    }

    setVal( val : number , force : boolean = false) {
        if(val == 8) { val = 100 +  Helper.GetRandomNumber(7, 1); }
        else if(val == 9) { val = 200 + Helper.GetRandomNumber(7, 1); }

        if(!force && (this.Val > 100 && val == 0)){
            this.Val -= 100;
        }else{
            this.Val = val;
        }

        let _texIn = 0;
        if(this.Val > 200){_texIn = 8;}
        else if(this.Val > 100) {_texIn = 7;}
        else if(this.Val != 0){
            _texIn = this.Val - 1;
        }

        if(this.Val != 0){
            this.ImgHolder.texture = this._texs[_texIn].texture;
        }else{
            this.ImgHolder.texture = Texture.EMPTY;
        }
    }

    setColor( r :number, g : number, b:number, a:number = 1){
        if(this._board){
            this._board.tint = new Color([r, g, b, a]);
        }
    }

    update(_:number){
        // if(this._animeObj.target != null){
        //     let _pos:pc.Vec3 = this.entity.getLocalPosition();

        //     _pos.x += this._animeObj.target.x * (dt/this._animeObj.duration);
        //     _pos.y += this._animeObj.target.y * (dt/this._animeObj.duration);

        //     this.entity.setPosition(_pos);

        //     this._animeObj.time += dt;

        //     if(this._animeObj.time >= this._animeObj.duration){
        //         this._animeObj.target = null;

        //         if(this._callback != null)
        //             this._callback(this);

        //         this._callback = null;
        //     }
        // }
    }

    MoveTo(pt:Point, dur:number, _: (node:NodeObject) => void){
        // this._callback = callback;

        this._animeObj.duration = dur;
        this._animeObj.target = pt;

        this._animeObj.time = 0;
    }
}