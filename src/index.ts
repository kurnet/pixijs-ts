import { Application } from 'pixi.js'
import { EVT_GAME_DONE, GameSceneContainer } from './containers/GameScene';
import { EVT_START_PRESSED, MainMenuContainer } from './containers/MenuScene';

const eleCanvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;

const app = new Application({
	view: eleCanvas,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 900,
});

const menuScene:MainMenuContainer = new MainMenuContainer(app);
app.stage.addChild(menuScene);

const gameScene:GameSceneContainer = new GameSceneContainer(app);
// app.stage.addChild(gameScene);

app.ticker.add((_ => {
	gameScene.update(app.ticker.deltaMS);
}));

menuScene.on(EVT_START_PRESSED, () => {
	app.stage.addChild(gameScene);
	app.stage.removeChild(menuScene);
});

gameScene.on(EVT_GAME_DONE, () => {
	app.stage.addChild(menuScene);
	app.stage.removeChild(gameScene);
})
