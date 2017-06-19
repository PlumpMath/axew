"use strict";
import Entity from '../engine/core/entity';
const THREE = require('three');
const degToRad = THREE.Math.degToRad;

export default class CubeEntity extends Entity {

  constructor(name) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh(geometry, material);
    super(name, cube);
  }

  onUpdate(deltaTime) {
    //Rotates 30 degree per second on all axes
    const deltaRotation = degToRad(30.0 * deltaTime);
    this.object3D.rotateX(deltaRotation);
    this.object3D.rotateY(deltaRotation);
    this.object3D.rotateZ(deltaRotation);
    this.game.dispatchEvent('on-cube-rotated', this.object3D.rotation);
  }

}
