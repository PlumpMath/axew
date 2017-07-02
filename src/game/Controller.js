"use strict";
import { Modifiers, Input } from '../engine/input/Input';
import Entity from '../engine/core/Entity';
import KeyboardInputTracker from '../engine/input/KeyboardInputTracker';

export default class Controller extends Entity {
  constructor() {
    super('_controller');
    this.keyboardInputTracker = new KeyboardInputTracker();
  }

  bindToGame(game) {
    // this.keyboardInputTracker.listenForEvents(game);
  }

  onUpdate() {

    if(Input.key('ArrowRight')) {
      console.log('Arrow Right');
    }

    if(Input.key(' ')) {
      console.log('Space');
    }

    if(Input.key('Enter')) {
      console.log('Enter');
    }

    if(Input.key('Meta')) {
      console.log('Meta');
    }
  }
}
