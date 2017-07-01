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

    if(Input.keyDown('F1')) {
      console.log('Down F1');
    }

    if(Input.key(' ')) {
      console.log('Space');
    }

    if(Input.keyUp('F1')) {
      console.log('Up F1');
    }

    if(Input.key('Enter')) {
      console.log('Enter');
    }

    if(Input.key('Shift')) {
      console.log('Shift');
    }
  }
}
