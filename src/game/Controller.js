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
    if(Input.modifier(Modifiers.LSHIFT) || Input.modifier(Modifiers.RSHIFT)) {
      console.log('SHIFT');
    }

    if(Input.modifier(Modifiers.LALT) || Input.modifier(Modifiers.RALT)) {
      console.log('ALT');
    }

    if(Input.modifier(Modifiers.LCONTROL) || Input.modifier(Modifiers.RCONTROL)) {
      console.log('CONTROL');
    }

    if(Input.modifier(Modifiers.LMETA) || Input.modifier(Modifiers.RMETA)) {
      console.log('META');
    }

    if(Input.keyDown('F1')) {
      console.log('Down F1');
    }

    if(Input.key(' ')) {
      console.log('Space');
    }

    if(Input.keyUp('F1')) {
      console.log('Up F1');
    }
  }
}
