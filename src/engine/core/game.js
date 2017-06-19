"use strict";
const THREE = require('three');
import Entity from './entity';

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
  const perspectiveCamera = options.hasOwnProperty('perspective') ? options.perspective : defaultOptions.camera.perspective;
  const near = options.hasOwnProperty('near') ? options.near : defaultOptions.camera.near;
  const far = options.hasOwnProperty('far') ? options.far : defaultOptions.camera.far;
  if (perspectiveCamera) {
    const fov = options.hasOwnProperty('fov') ? options.fov : defaultOptions.camera.fov;
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
      antialias: options.hasOwnProperty('antialias') ? options.antialias : defaultOptions.antialias
    });
    this.renderer.setSize(width, height);
    this.camera = initCamera(width, height, options.hasOwnProperty('camera') ? options.camera : defaultOptions.camera);
    this.entities = [];
    this.entityMap = {};
    this.clock = new THREE.Clock();
    this.listeners = {};
    this.deadEntities = [];
  }

  render() {
    /*
    This has to be called here before the first call to requestanimationframe
    to prevent self being assigned to window instead of the game because of how
    requestanimationframe is scoped
    */
    self = (self === null) ? this : self;
    requestAnimationFrame(self.render);
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

      if (this.entityMap.hasOwnProperty(entity.name)) {
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
    if (!this.listeners.hasOwnProperty(type)) {
      this.listeners[type] = [];
    }

    this.listeners[type].push({
      listener: listener,
      scope: scope
    });
  }

  unregisterEventListener(type, listener) {
    if (this.listeners.hasOwnProperty(type)) {
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
    if (this.listeners.hasOwnProperty(type)) {
      this.listeners[type].forEach(listener => {
        listener.listener.call(listener.scope, payload);
      });
    }
  }
};
