"use strict";
// See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
const primaryKeyButtons = [1, 3, 5];
const secondaryKeyButtons = [2, 3, 6];
const middleKeyButtons = [4, 5, 6];

function createMouseEvent(event) {
  const buttons = event.buttons;
  const mouseEvent = {
    x: event.clientX,
    y: event.clientY,
    shift: event.shiftKey,
    control: event.ctrlKey,
    meta: event.metaKey,
    alt: event.altKey,
    btnPrimary: primaryKeyButtons.includes(buttons),
    btnSecondary: secondaryKeyButtons.includes(buttons),
    btnMiddle: middleKeyButtons.includes(buttons)
  }

  return mouseEvent;
}

export default class MouseInputTracker {

  constructor() {}

  listenForEvents(eventTarget) {
    this.eventTarget = eventTarget;
    document.addEventListener('mouseenter', mouseEvent => {
      eventTarget.dispatchEvent('mouseinput-enter', createMouseEvent(mouseEvent));
    }, false);
    document.addEventListener('mouseleave', mouseEvent => {
      eventTarget.dispatchEvent('mouseinput-exit', createMouseEvent(mouseEvent));
    });
    document.addEventListener('mousemove', mouseEvent => {
      eventTarget.dispatchEvent('mouseinput-move', createMouseEvent(mouseEvent));
    });
    document.addEventListener('wheel', wheelEvent => {
      console.log(`Wheel Event: ${wheelEvent.deltaX}, ${wheelEvent.deltaY}, ${wheelEvent.deltaZ}`);
    });
  }
}
