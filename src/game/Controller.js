"use strict";
import { Modifiers, Input } from '../engine/input/Input';
import Entity from '../engine/core/Entity';

export default class Controller extends Entity {
  constructor() {
    super('_controller');
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
  }
}
