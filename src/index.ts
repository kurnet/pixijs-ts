import { Application } from 'pixi.js'
import { EVT_GAME_DONE, GameSceneContainer } from './containers/GameScene';
import { EVT_SLOT_PRESSED, EVT_START_PRESSED, MainMenuContainer } from './containers/MenuScene';
import { preLoadCard } from './object/NodeObject';
import { SlotScene } from './containers/SlotScene';

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

let gameScene:GameSceneContainer;
let cardLoaded = false;
const cardLoading = preLoadCard();

cardLoading.then(()=>{
	gameScene = new GameSceneContainer(app);
	gameScene.on(EVT_GAME_DONE, () => {
		app.stage.addChild(menuScene);
		app.stage.removeChild(gameScene);
	});

	cardLoaded = true;
});
// app.stage.addChild(gameScene);

app.ticker.add((_ => {
	if(gameScene){
		gameScene.update(app.ticker.deltaMS);
	}
}));

menuScene.on(EVT_START_PRESSED, () => {	
	if(cardLoaded){
		app.stage.addChild(gameScene);
		app.stage.removeChild(menuScene);
	}	
});

const slotScene = new SlotScene(app);
menuScene.on(EVT_SLOT_PRESSED, ()=>{
	app.stage.addChild(slotScene);
	app.stage.removeChild(menuScene);
})

