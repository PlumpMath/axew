"use strict";
import Game from './engine/core/Game';
import CubeEntity from './game/CubeEntity';
import SphereEntity from './game/SphereEntity';
import Controller from './game/Controller';
const THREE = require('three');

const game = new Game(window.innerWidth, window.innerHeight);
document.body.appendChild(game.renderer.domElement);

const controller = new Controller();
game.addEntity(controller);

const cubeEntity = new CubeEntity('cube');
const sphereEntity = new SphereEntity('sphere');
sphereEntity.object3D.position.x += 3;

game.addEntities([cubeEntity, sphereEntity]);

game.camera.position.z = 5;

window.addEventListener('resize', () => {
	game.resize(window.innerWidth, window.innerHeight);
});

game.mainLoop();
