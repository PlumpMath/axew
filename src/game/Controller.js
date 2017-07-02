"use strict";
import { Modifiers, Input } from '../engine/input/Input';
import Entity from '../engine/core/Entity';

export default class Controller extends Entity {
  constructor() {
    super('_controller');
    Input.registerEventListener('key', (event) => {
      console.log(event);
      console.log(this);
    }, this);
  }

  bindToGame(game) {
  }

  onUpdate() {
  }
}
