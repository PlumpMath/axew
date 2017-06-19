"use strict";

const actionKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
  'F10', 'F11', 'F12', 'Escape', 'Shift', 'Control', 'Meta',
  'Alt', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'
];
const modifierKeys = ['Shift', 'Control', 'Meta', 'Alt'];
const arrowKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

function createKeyEvent(event) {
  const locationLeft = (event.location === KeyboardEvent.DOM_KEY_LOCATION_STANDARD || event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT);
  const locationRight = (event.location === KeyboardEvent.DOM_KEY_LOCATION_STANDARD || event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT);
  const keyEvent = {
    key: event.key,
    lShift: event.shiftKey && locationLeft,
    rShift: event.shiftKey && locationRight,
    lControl: event.ctrlKey && locationLeft,
    rControl: event.ctrlKey && locationRight,
    lMeta: event.metaKey && locationLeft,
    rMeta: event.metaKey && locationRight,
    lAlt: event.altKey && locationLeft,
    rAlt: event.altKey && locationRight,
    get shift() {
      return this.lShift || this.rShift;
    },
    get control() {
      return this.lControl || this.rControl;
    },
    get meta() {
      return this.lMeta || this.rMeta;
    },
    get alt() {
      return this.lAlt || this.rAlt;
    }
  };
  return keyEvent;
}

export default class KeyboardInputTracker {

  constructor() {}

  listenForEvents(eventTarget) {
    this.eventTarget = eventTarget;
    document.addEventListener('keydown', event => {
      const key = event.key;
      if (modifierKeys.includes(key)) {
        this.eventTarget.dispatchEvent('kbinput-mod-down', createKeyEvent(event));
      } else if(arrowKeys.includes(key)) {
        this.eventTarget.dispatchEvent('kbinput-arrow-down', createKeyEvent(event));
      }
    });
    document.addEventListener('keyup', event => {
      const key = event.key;
      if (actionKeys.includes(key)) {
        this.eventTarget.dispatchEvent('kbinput-action', createKeyEvent(event));
      }
      if (modifierKeys.includes(key)) {
        this.eventTarget.dispatchEvent('kbinput-mod-up', createKeyEvent(event));
      } else if(arrowKeys.includes(key)) {
        this.eventTarget.dispatchEvent('kbinput-arrow-up', createKeyEvent(event));
      }
    });
    document.addEventListener('keypress', event => {
      const key = event.key;
      if (!actionKeys.includes(key) && !modifierKeys.includes(key)) {
        this.eventTarget.dispatchEvent('kbinput-keypress', createKeyEvent(event));
      }
    });
  }
}
