"use strict";
import Game from './engine/core/game';
import CubeEntity from './game/cubeentity';
import SphereEntity from './game/sphereentity';
const THREE = require('three');

const game = new Game(window.innerWidth, window.innerHeight);
document.body.appendChild(game.renderer.domElement);

const cubeEntity = new CubeEntity('cube');
const sphereEntity = new SphereEntity('sphere');
sphereEntity.object3D.position.x += 3;

game.addEntities([cubeEntity, sphereEntity]);

game.camera.position.z = 5;

game.render();

window.addEventListener('resize', () => {
	game.resize(window.innerWidth, window.innerHeight);
});

setTimeout(() => {
	game.removeEntity(sphereEntity);
	setTimeout(() => {
		game.addEntity(sphereEntity);
	}, 5000);
}, 5000);
