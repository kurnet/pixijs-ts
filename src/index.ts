import { Application } from 'pixi.js'
import { GameSceneContainer } from './containers/GameScene';

const eleCanvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;

const app = new Application({
	view: eleCanvas,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 900,
});

const gameScene:GameSceneContainer = new GameSceneContainer(app);
app.stage.addChild(gameScene);

app.ticker.add((_ => {
	gameScene.update(app.ticker.deltaMS);
}));