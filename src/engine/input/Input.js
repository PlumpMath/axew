"use strict";
import {
  hasProperty
} from '../util/Utility';
import Modifiers from './Modifiers';

const ActionStates = Object.freeze({
  DOWN: 'down',
  UP: 'up',
  PRESSED: 'pressed'
});

const State = {
  //Maintains a flag indicating which modifiers are pressed
  modifiers: {
    l_shift: false,
    r_shift: false,
    l_alt: false,
    r_alt: false,
    l_ctrl: false,
    r_ctrl: false,
    l_meta: false,
    r_meta: false
  },
  //Maintains a map of keys to action states
  keys: {},
  //Used for event based input
  listeners: {}
};

function findModifierForEvent(event) {
  const key = event.key;
  const locationLeft = (event.location === KeyboardEvent.DOM_KEY_LOCATION_STANDARD || event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT);
  const locationRight = (event.location === KeyboardEvent.DOM_KEY_LOCATION_STANDARD || event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT);

  switch (key) {

    case 'Shift':
      {
        return locationLeft ? Modifiers.LSHIFT : Modifiers.RSHIFT;
      }

    case 'Control':
      {
        return locationLeft ? Modifiers.LCONTROL : Modifiers.RCONTROL;
      }

    case 'Meta':
      {
        return locationLeft ? Modifiers.LMETA : Modifiers.RMETA;
      }

    case 'Alt':
      {
        return locationLeft ? Modifiers.LALT : Modifiers.RALT;
      }

    default:
      {
        return null;
      }
  }
}

function dispatchEvent(type, payload) {
  if (hasProperty(State.listeners, type)) {
    State.listeners[type].forEach(listener => {
      listener.listener.call(listener.scope, payload);
    });
  }
}

const api = Object.freeze({
  modifier: function (code) {
    if (hasProperty(State.modifiers, code)) {
      return State.modifiers[code];
    }

    return false;
  },
  keyDown: function (key) {
    if (hasProperty(State.keys, key)) {
      return State.keys[key] === ActionStates.DOWN;
    }

    return false;
  },
  keyUp: function (key) {
    if (hasProperty(State.keys, key)) {
      return State.keys[key] === ActionStates.UP;
    }

    return false;
  },
  key: function (key) {
    if (hasProperty(State.keys, key)) {
      return State.keys[key] === ActionStates.DOWN || State.keys[key] === ActionStates.PRESSED;
    }

    return false;
  },
  registerEventListener: function (type, listener, scope) {
    if (!hasProperty(State.listeners, type)) {
      State.listeners[type] = [];
    }

    State.listeners[type].push({
      listener: listener,
      scope: scope
    });
  },
  unregisterEventListener: function (type, listener) {
    if (hasProperty(State.listeners, type)) {
      const stack = State.listeners[type];
      for (let stackIndex = 0; stackIndex < stack.length; stackIndex++) {
        if (listener === stack[stackIndex].listener) {
          stack.splice(stackIndex, 1);
          break;
        }
      }
    }
  },
  //For internal use only
  onFrameEnd: function () {
    let actionState;
    for (let key in State.keys) {
      if (hasProperty(State.keys, key)) {
        actionState = State.keys[key];
        if (ActionStates.UP === actionState) {
          delete State.keys[key];
        } else if (ActionStates.DOWN === actionState) {
          State.keys[key] = ActionStates.PRESSED;
        }
      }
    }
  }
});

function createKeyEvent(key) {
  return {
    key: key,
    lShift: api.modifier(Modifiers.LSHIFT),
    rShift: api.modifier(Modifiers.RSHIFT),
    lControl: api.modifier(Modifiers.LCONTROL),
    rControl: api.modifier(Modifiers.RCONTROL),
    lAlt: api.modifier(Modifiers.LALT),
    rAlt: api.modifier(Modifiers.RALT),
    lMeta: api.modifier(Modifiers.LMETA),
    rMeta: api.modifier(Modifiers.RMETA),
    get shift() {
      return this.lShift || this.rShift;
    },
    get control() {
      return this.lControl || this.rControl;
    },
    get alt() {
      return this.lAlt || this.rAlt;
    },
    get meta() {
      return this.lMeta || this.rMeta;
    }
  }
}

function setup() {
  document.addEventListener('keydown', event => {
    //Update modifier state
    const modifier = findModifierForEvent(event);
    if (modifier !== null) {
      State.modifiers[modifier] = true;
    }

    const key = event.key;
    if (!hasProperty(State.keys, key)) {
      State.keys[key] = ActionStates.DOWN;
    }
  });
  document.addEventListener('keyup', event => {
    //Update modifier state
    const modifier = findModifierForEvent(event);
    if (modifier !== null) {
      State.modifiers[modifier] = false;
    }
    const key = event.key;
    if (hasProperty(State.keys, key)) {
      const actionState = State.keys[key];
      if (actionState === ActionStates.DOWN || actionState === ActionStates.PRESSED) {
        State.keys[key] = ActionStates.UP;
      }
    }

    dispatchEvent('key', createKeyEvent(key));
  });
}

setup();

export {
  ActionStates,
  Modifiers,
  api as Input
};
