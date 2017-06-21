"use strict";

const ActionStates = Object.freeze({
  NONE: 'none',
  DOWN: 'down',
  UP: 'up',
  PRESSED: 'pressed'
});

const Modifiers = Object.freeze({
  LSHIFT: 'l_shift',
  RSHIFT: 'r_shift',
  LALT: 'l_alt',
  RALT: 'r_alt',
  LCONTROL: 'l_ctrl',
  RCONTROL: 'r_ctrl',
  LMETA: 'l_meta',
  RMETA: 'r_meta'
});

const Input = {
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
  }
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

function setup() {
  document.addEventListener('keydown', event => {
    const modifier = findModifierForEvent(event);
    if (modifier !== null) {
      Input.modifiers[modifier] = true;
    }
  });
  document.addEventListener('keyup', event => {
    const modifier = findModifierForEvent(event);
    if (modifier !== null) {
      Input.modifiers[modifier] = false;
    }
  });
}

setup();

const api = Object.freeze({
  modifier: function (code) {
    if (Input.modifiers.hasOwnProperty(code)) {
      return Input.modifiers[code];
    }

    return false;
  }
});

export {
  ActionStates,
  Modifiers,
  api as Input
};
