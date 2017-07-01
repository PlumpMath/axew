"use strict";
const THREE = require('three');
import Entity from './Entity';
import { hasProperty } from '../util/Utility'
// import KeyboardInputTracker from '../input/KeyboardInputTracker';
// import MouseInputTracker from '../input/MouseInputTracker';

const defaultOptions = {
  antialias: true,
  camera: {
    perspective: true,
    fov: 75,
    near: 0.1,
    far: 1000
  }
}

function initCamera(width, height, options) {
  const perspectiveCamera = hasProperty(options, 'perspective') ? options.perspective : defaultOptions.camera.perspective;
  const near = hasProperty(options, 'near') ? options.near : defaultOptions.camera.near;
  const far = hasProperty(options, 'far') ? options.far : defaultOptions.camera.far;
  if (perspectiveCamera) {
    const fov = hasProperty(options, 'fov') ? options.fov : defaultOptions.camera.fov;
    return new THREE.PerspectiveCamera(fov, width / height, near, far);
  } else {
    return new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, near, far);
  }
}

//Workaround for losing scope in requestAnimationFrame in render()
var self = null;

export default class Game {

  constructor(width, height, options) {
    options = (options === null || options === undefined) ? defaultOptions : options;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: hasProperty(options, 'antialias') ? options.antialias : defaultOptions.antialias
    });
    this.renderer.setSize(width, height);
    this.camera = initCamera(width, height, hasProperty(options, 'camera') ? options.camera : defaultOptions.camera);
    this.entities = [];
    this.entityMap = {};
    this.clock = new THREE.Clock();
    this.listeners = {};
    this.deadEntities = [];

    /*this.keyboardInputTracker = new KeyboardInputTracker();
    this.keyboardInputTracker.listenForEvents(this);

    this.mouseInputTracker = new MouseInputTracker();
    this.mouseInputTracker.listenForEvents(this); */

    /*this.registerEventListener('kbinput-action', actionKeyEvent => {
      console.log(`Action: ${actionKeyEvent.key}`);
    }, this);
    this.registerEventListener('kbinput-mod-down', actionKeyEvent => {
      console.log(`Modifier Down: ${actionKeyEvent.key}`);
    });
    this.registerEventListener('kbinput-mod-up', actionKeyEvent => {
      console.log(`Modifier Up: ${actionKeyEvent.key}`);
    });
    this.registerEventListener('kbinput-keypress', actionKeyEvent => {
      console.log(`Key Press: ${actionKeyEvent.key}`);
    });
    this.registerEventListener('kbinput-arrow-up', actionKeyEvent => {
      console.log(`Arrow Key Up: ${actionKeyEvent.key}`);
    });
    this.registerEventListener('kbinput-arrow-down', actionKeyEvent => {
      console.log(`Arrow Key Down: ${actionKeyEvent.key}`);
    });
    this.registerEventListener('mouseinput-enter', mouseMoveEvent => {
    });
    this.registerEventListener('mouseinput-exit', mouseMoveEvent => {
    });
    this.registerEventListener('mouseinput-move', mouseMoveEvent => {
    });*/
  }

  mainLoop() {
    /*
    This has to be called here before the first call to requestanimationframe
    to prevent self being assigned to window instead of the game because of how
    requestanimationframe is scoped
    */
    self = (self === null) ? this : self;
    requestAnimationFrame(self.mainLoop);
    const deltaTime = self.clock.getDelta();

    let entity;
    //Intentionally not using forEach to avoid creating a new function on every frame
    for (let entityIndex = 0; entityIndex < self.entities.length; entityIndex++) {
      entity = self.entities[entityIndex];

      if(!entity.isAlive) {
        //This entity was killed in the last frame, mark it for removal
        self.deadEntities.push(entity.name);
        continue;
      }

      if (entity.enabled) {
        entity.onUpdate(deltaTime);
      }
    }
    if(self.deadEntities.length > 0) {
      self.removeEntitiesByName(self.deadEntities);
      self.deadEntities.length = 0;
    }
    self.renderer.render(self.scene, self.camera);
  }

  resize(newWidth, newHeight) {
    this.renderer.setSize(newWidth, newHeight);
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = newWidth / newHeight;
    } else {
      this.camera.left = newWidth / -2;
      this.camera.right = newWidth / 2;
      this.camera.top = newHeight / 2;
      this.camera.bottom = newHeight / -2;
    }
    this.camera.updateProjectionMatrix();
  }

  addEntity(entity) {
    this.addEntities([entity]);
  }

  addEntities(entities) {
    entities.forEach(entity => {
      if (!(entity instanceof Entity)) {
        throw `Entity(${entity.name}) should be or extend Entity class!`;
      }

      if(!entity.isAlive) {
        throw `Entity ${entity.name} is dead!`
      }

      if (hasProperty(this.entityMap, entity.name)) {
        throw `Entity(${entity.name}) already exists! Remove it first or replace it instead!`;
      }

      entity.bindToGame(this);
      this.entities.push(entity);
      this.entityMap[entity.name] = entity;
      if (entity.object3D !== null) {
        this.scene.add(entity.object3D);
      }
    });
  }

  replaceEntity(entity) {
    this.removeEntityByName(entity.name);
    this.addEntity(entity);
  }

  findEntity(name) {
    const entity = this.entityMap[name];
    return entity === undefined ? null : entity;
  }

  removeEntity(entity) {
    this.removeEntityByName(entity.name);
  }

  removeEntities(entities) {
    this.removeEntitiesByName(entities.map(entity => {
      return entity.name;
    }));
  }

  removeEntityByName(entityNameToRemove) {
    this.removeEntitiesByName([entityNameToRemove]);
  }

  removeEntitiesByName(entityNamesToRemove) {
    this.entities = this.entities.filter(entity => {
      const allowed = !entityNamesToRemove.includes(entity.name);
      if (!allowed) {
        entity.unregisterEvents();
        if (entity.object3D !== null) {
          this.scene.remove(entity.object3D);
        }
      }
      return allowed;
    });

    entityNamesToRemove.forEach(entityName => {
      delete this.entityMap[entityName];
    });
  }

  registerEventListener(type, listener, scope) {
    if (!hasProperty(this.listeners, type)) {
      this.listeners[type] = [];
    }

    this.listeners[type].push({
      listener: listener,
      scope: scope
    });
  }

  unregisterEventListener(type, listener) {
    if (hasProperty(this.listeners, type)) {
      const stack = this.listeners[type];
      for (let stackIndex = 0; stackIndex < stack.length; stackIndex++) {
        if (listener === stack[stackIndex].listener) {
          stack.splice(stackIndex, 1);
          break;
        }
      }
    }
  }

  dispatchEvent(type, payload) {
    if (hasProperty(this.listeners, type)) {
      this.listeners[type].forEach(listener => {
        listener.listener.call(listener.scope, payload);
      });
    }
  }
};
