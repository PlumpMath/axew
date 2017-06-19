"use strict";
const THREE = require('three');
import Entity from '../engine/core/entity';

export default class SphereEntity extends Entity {

  constructor(name) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const sphere = new THREE.Mesh(geometry, material);
    super(name, sphere);
  }

  onRotated(rotation) {
    this.object3D.setRotationFromEuler(rotation);
  }

  registerEvents() {
    this.game.registerEventListener('on-cube-rotated', this.onRotated, this);
  }

  unregisterEvents() {
    this.game.unregisterEventListener('on-cube-rotated', this.onRotated);
  }
}
