"use strict";
export default class Entity {

  constructor(name, object3D) {
    if(name === null || name === undefined || name.length === 0) {
      throw "Cannot create an entity without a name!";
    }
    this.name = name;
    this.object3D = (object3D === undefined) ? null : object3D;
    this.enabled = true;
    this.isAlive = true;
  }

  setObject3D(object3D) {
    if(this.object3D !== null) {
      this.game.scene.remove(this.object3D);
      this.object3D = null;
    }

    if(object3D !== undefined && object3D !== null) {
      this.object3D = object3D;
      this.game.scene.add(object3D);
    }
  }

  bindToGame(game) {
    this.game = game;
    this.registerEvents();
  }

  enable() {
    this.enabled = true;
    if(this.object3D !== null) {
      this.object3D.visible = true;
    }
    this.registerEvents();
  }

  disable() {
    this.enabled = false;
    if(this.object3D !== null) {
      this.object3D.visible = false;
    }
    this.unregisterEvents();
  }

  registerEvents() {
  }

  unregisterEvents() {
  }

  onUpdate(deltaTime) {
  }
}
