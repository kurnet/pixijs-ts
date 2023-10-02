// import { Helper } from "../helper/helper";
import { Application, FederatedPointerEvent, Point } from "pixi.js";
import { Helper } from "../helper/helper";
import { NodeObject } from "../object/NodeObject";
import { ScreenBaseContainer } from "./SceneBase"
import { NodeData } from "../data/nodeData";
import node_precent from '../data/node_precent.json';
import { Easing, Group, Tween } from "tweedle.js";

interface CoreData {
    score: number,
    multiply: number,
    baseScore: number,
    nextVal: number,
    step: number,
    level: number;
    isStarted: boolean,
    UsedBlock: number
};

export class GameSceneContainer extends ScreenBaseContainer {
    static MAX_BLOCK: number = 7;
    static NODE_SIZE: number = 70;

    private gameData: CoreData;
    private nodePercent: NodeData;
    private hintNode?: NodeObject;

    private isDropping:boolean = false;

    ans: Array<Array<NodeObject>> = [];
    private ansBound: {
        x: number, y: number, w: number, h: number,
    } = { x: 0, y: 0, w: 0, h: 0 };

    constructor(app: Application) {
        super(app);
        this.gameData = {
            score: 0,
            multiply: 1,
            baseScore: 7,
            nextVal: 0,
            step: 0,
            level: 1,
            isStarted: false,
            UsedBlock: 0
        };
        this.nodePercent = new NodeData(node_precent);

        this.on('pointerdown', this.onMouseDown);
        this.eventMode = "static";
        this.cursor = "pointer";

        this.hintNode = new NodeObject();
        this.hintNode.eventMode = 'none';
        this.addChild(this.hintNode);
    }

    override screenInited(): void {
        this.resetGame();
    }

    override addedToScreen(): void {
        this.resetGame();
    }

    private resetGame() {
        console.log(`Screen Size ${this.screenHeight} / ${this.screenWidth}`);

        const nodeSize = GameSceneContainer.NODE_SIZE;
        const startX = (this.screenWidth - GameSceneContainer.MAX_BLOCK * nodeSize) / 2;
        const startY = this.screenHeight * 0.8;

        this.ansBound.x = startX;
        this.ansBound.y = startY;
        this.ansBound.w = startX + nodeSize * GameSceneContainer.MAX_BLOCK;
        this.ansBound.h = startY - nodeSize * GameSceneContainer.MAX_BLOCK;

        let i: number, j: number;
        for (j = 0; j < GameSceneContainer.MAX_BLOCK; ++j) {
            this.ans[j] = [];
            for (i = 0; i < GameSceneContainer.MAX_BLOCK; ++i) {
                let _node: NodeObject = new NodeObject();

                _node.x = startX + j * nodeSize,
                    _node.y = startY - i * nodeSize;

                _node.gridX = j;
                _node.gridY = i;

                this.ans[j][i] = _node;

                this.addChild(_node);
            }
        }

        this.gameData.step = Helper.GetRandomNumber(10, 10);
        this.randomInit();
    }

    // get the mouse/touch to raycast the Gird for drop node
    onMouseDown(e: FederatedPointerEvent) {
        if(this.isDropping) return;

        const mousePt = { x: e.screenX, y: e.screenY };
        console.log(`${mousePt.x}/${mousePt.y}\n${JSON.stringify(this.ansBound)}`);
        const gird = { x: 0, y: 0 };

        gird.x = Math.floor((mousePt.x - this.ansBound.x) / GameSceneContainer.NODE_SIZE);
        gird.y = Math.floor((this.ansBound.y - mousePt.y) / GameSceneContainer.NODE_SIZE) + 1;

        console.log(`${gird.x} / ${gird.y}`);

        if(this.dropNode(gird.x, this.gameData.nextVal)){
            this.hintNode!.visible = false;
            this.isDropping = true;
        }
    };


    // get init board filled
    private randomInit() {
        let x: number, y: number;
        for (x = 0; x < GameSceneContainer.MAX_BLOCK; ++x) {
            for (y = 0; y < GameSceneContainer.MAX_BLOCK; ++y) {
                if (Math.random() > 0.6) {
                    this.ans[x][y].setVal(this.getNewNodeValue(), true);
                    this.gameData.UsedBlock++;

                    console.log(`${x}/${y} : ${this.ans[x][y].Val}`);
                }
            }
        }

        this.processMarkedNode(this);
    }

    // next node show up 
    private genNext() {
        this.gameData.nextVal = this.getNewNodeValue();
        this.hintNode?.setVal(this.gameData.nextVal);        
        this.hintNode!.visible = true;

        this.isDropping = false;
    };

    private getNewNodeValue(): number {
        let _p: number = Helper.GetRandomNumber(this.nodePercent.MaxPercent, 0);
        let _count: number = 0;

        let vi: number = 0;
        for (vi = 0; vi < this.nodePercent.NodePercent.length; ++vi) {
            let _percent = this.nodePercent.NodePercent[vi];
            _count += _percent;
            if (_p <= _count) {
                return vi + 1;
            }
        }

        return 0;
    }

    // // check need or not insert row and gameover if no space to add row
    // // check the result of every step made, 0 - normal, 1 - created new row, -1 - game over
    // private moreStep() : number{
    //     this.gameData.step--;
    //     let _res: number = 0;
    //     if(this.gameData.step <= 0){
    //         if(this.isFullFilled()){
    //             _res = -1;
    //         }else{
    //             this.gameData.level++;
    //             let _nextStep = Math.max(Helper.GetRandomNumber(10, 10) - this.gameData.level, 5);
    //             this.gameData.step = _nextStep;
    //             this.insertRow();
    //             _res = 1;
    //         }
    //     }else{
    //         if(this.gameData.UsedBlock == Core.MAX_BLOCK * Core.MAX_BLOCK){
    //             _res = -1;
    //         }
    //     }
    //     this.txtStep.text = "Step : " + this.gameData.step;
    //     return _res;
    // }

    // // shift up the node and insert at the bottom
    // private insertRow() {
    //     let x:number, y:number;
    //     for(x = 0; x < GameSceneContainer.MAX_BLOCK; ++x){
    //         for(y = 5; y >= 0; --y){
    //             if(y == 0){
    //                 this.ans[x][y+1].setVal(this.ans[x][y].Val, true);
    //                 this.ans[x][y].setVal(Helper.GetRandomNumber(2, 8));
    //                 this.gameData.UsedBlock++;
    //             }else{
    //                 this.ans[x][y+1].setVal(this.ans[x][y].Val, true);
    //             }
    //         }
    //     }
    // }

    // // check full stacked node
    // private isFullFilled() : boolean {
    //     let x : number;
    //     for(x = 0; x < GameSceneContainer.MAX_BLOCK; ++x){
    //         if(this.ans[x][6].Val != 0){
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // drop the node at the specfic column
    private dropNode (x : number, num : number) : boolean {
        let i: number;
        let _tarNode:NodeObject;

        for(i = 0; i < GameSceneContainer.MAX_BLOCK; ++i){
            if(this.ans[x][i].Val == 0){
                //this.ans[x][i].setVal(num);
                this.gameData.UsedBlock++;

                _tarNode = this.ans[x][i];
                break;
            }
        }
        if(i == 7){return false;}

        // wait for scan puzzle need to solve, should be animation here
        //setTimeout(this.scanPuzzleNeedToSolve, 250, this);
        this.addDummyDropAnime(x, num, _tarNode!);
        return true;
    };

    private addDummyDropAnime(x:number, num:number, targetNode:NodeObject){
        let _pos:Point = this.ans[x][6].position;
        _pos = new Point(_pos.x, _pos.y);
        _pos.y -= GameSceneContainer.NODE_SIZE;
        
        const _dummy:NodeObject = new NodeObject();
        _dummy.setVal(num);
        
        _dummy.position.set(_pos.x, _pos.y);
        this.addChild(_dummy);

        let _yDiff:number =  targetNode.y;
        let _yDur:number = Math.abs((_yDiff/2.5) * 0.5);

        const _nodePos = _dummy.position;
        new Tween(_nodePos).to({x:_pos.x, y:_yDiff}, _yDur).onComplete(()=>{
            _dummy.destroy();
            targetNode.setVal(num);

            this.scanPuzzleNeedToSolve(this);
        }).easing(Easing.Quadratic.InOut).start();
    }

    // scan puzzle and remark any solve needed
    private scanPuzzleNeedToSolve(_game: GameSceneContainer) {
        let _x: number, _y: number;
        for (_x = 0; _x < GameSceneContainer.MAX_BLOCK; ++_x) {
            _game.checkVert(_x);
        }
        for (_y = 0; _y < GameSceneContainer.MAX_BLOCK; ++_y) {
            _game.checkHori(_y);
        }

        // should be animation play when found detected node to solve
        setTimeout(_game.processMarkedNode, 300, _game);
    }

    // remove and sort the empty space out
    private processMarkedNode(_game: GameSceneContainer) {
        let _pClean: boolean = _game.CheckAndCleanMarked();
        let _pSort: boolean = _game.sortBlock();
        if (_pClean || _pSort) {
            // if any change made on the board have to scan puzzle again until nothing change, and score got multiply
            _game.gameData.multiply += 4;
            setTimeout(_game.scanPuzzleNeedToSolve, 200, _game);
        } else {
            _game.genNext();
            // let _gameStatus : number = this.moreStep();
            // if(!_gameStatus){
            //     // happen nothing if the step is not yet need to insert row
            //     this.gameData.multiply = 1;
            //     this.BlockerEntity.enabled = false;
            //     this.genNext();

            //     if(!this.gameData.isStarted){ this.gameData.isStarted = true; }
            // }else if(_gameStatus == 1){
            //     // insert row at the bottom and scan puzzle again
            //     this.scanPuzzleNeedToSolve(this);
            // }else{
            //     // no more row can insert or full board dropped make the game over
            //     this.gameData.isStarted = false;
            //     this.sharedUIMgr.showGameOver(true);
            //     //Game Over
            // }
        }
    }

    // sort down to fill the empty space
    private sortBlock() {
        let _sorted: boolean = false;
        let i, j;
        for (j = 0; j < GameSceneContainer.MAX_BLOCK; ++j) {
            let _empty: number = -1;
            for (i = 0; i < GameSceneContainer.MAX_BLOCK; ++i) {
                if (this.ans[j][i].Val > 0 && _empty != -1) {
                    this.ans[j][_empty].setVal(this.ans[j][i].Val);
                    this.ans[j][i].setVal(0, true);

                    _empty++;

                    _sorted = true;
                }

                if (this.ans[j][i].Val == 0 && _empty == -1) {
                    _empty = i;
                }

            }

        }
        return _sorted;
    };

    // check column if any matched node will marked
    private checkVert(x: number) {
        let y: number;
        let _max: number = 0;
        for (y = 6; y >= 0; --y) {
            if (this.ans[x][y].Val > 0 && _max == 0) {
                _max = y + 1;
            }

            if (this.ans[x][y].Val != 0 && this.ans[x][y].Val == _max) {
                this.ans[x][y].setMarked(true);
            }

        }

    };

    // check row if any matched node will marked
    private checkHori(y: number) {
        let x: number;
        let _max: number = 0;
        for (x = 0; x <= GameSceneContainer.MAX_BLOCK; ++x) {
            if (x == GameSceneContainer.MAX_BLOCK || this.ans[x][y].Val == 0) {
                if (_max > 0) {
                    let _chk: number = _max;
                    while (_chk > 0) {
                        let sx: number = x - _chk;
                        if (this.ans[sx][y].Val == _max) {
                            this.ans[sx][y].setMarked(true);
                        }
                        _chk--;
                    }

                    _max = 0;
                }
            } else {
                _max++;
            }

        }
    };

    // handle all the node that marked as matched node to remove
    CheckAndCleanMarked() {
        let _act: boolean = false;
        let x: number, y: number;
        for (x = 0; x < GameSceneContainer.MAX_BLOCK; ++x) {
            for (y = 0; y < GameSceneContainer.MAX_BLOCK; ++y) {
                if (this.ans[x][y].Marked) {
                    this.removeBlock(x, y);
                    this.ans[x][y].setMarked(false);
                    _act = true;
                }
            }
        }
        return _act;
    };

    // remove the block is matched the logics and break nearly by in cross
    private removeBlock(x: number, y: number) {
        this.ans[x][y].setVal(0);
        this.gameData.UsedBlock--;

        let _close: number = 0;
        while (_close < 4) {
            let _nextNode: NodeObject | null = null;
            switch (_close) {
                case 0:
                    if (x - 1 >= 0) {
                        _nextNode = this.ans[x - 1][y];
                    }
                    break;
                case 1:
                    if (x + 1 < GameSceneContainer.MAX_BLOCK) {
                        _nextNode = this.ans[x + 1][y];
                    }
                    break;
                case 2:
                    if (y - 1 >= 0) {
                        _nextNode = this.ans[x][y - 1];
                    }
                    break;
                case 3:
                    if (y + 1 < GameSceneContainer.MAX_BLOCK) {
                        _nextNode = this.ans[x][y + 1];
                    }
                    break;
            }
            if (_nextNode != null && _nextNode.Val > 100) {
                _nextNode.setVal(0);
            }
            _close++;
        }

        // this.addScore(this.gameData.multiply * this.gameData.baseScore);
    };

    override update(_: number): void {
        Group.shared.update();
    }
}