import { rect } from './dquad/geometry';
import * as butil from './butil';

export default function Phy(backout, options = {}) {

  let { 
    tMax = 30,
    vMax = butil.TileSize * 0.5,
    hMax = butil.TileSize * 4,
    xSubH = butil.TileSize * 6
  } = options;

  let xFriction = 5 / tMax,
      hAccel = vMax * xFriction;

  let v0Jump = (2 * hMax) * vMax / xSubH,
      gJump = (2 * hMax * vMax * vMax) / (xSubH * xSubH);

  let hitbox = rect(0, 0, butil.TileSize, butil.TileSize);

  let remx = 0,
      remy = 0;

  let phy = this.phy = {
    jax: 0,
    jay: 0,
    dx: 0,
    dy: 0,
    x: 0,
    y: 0
  };

  let dt = 1;

  this.dt = (_dt) => dt = _dt;

  this.dragX = () => {
    phy.dx += -phy.dx * xFriction;
  };

  this.dragY = () => {
    phy.dy += -phy.dy * xFriction;
  };

  this.fallX = dirX => {
    //phy.ax *= dirX;
  };

  this.fallY = dirY => {
    // phy.ay *= dirY;
  };

  this.jumpX = (dir) => {
    phy.jax = -gJump * dir;
    phy.dx = v0Jump * dir;
  };

  this.jumpY = (dir) => {
    phy.jay = -gJump * dir;
    phy.dy = v0Jump * dir;
  };  

  this.cutJump = () => {
    phy.jax = 0;
    phy.jay = 0;
  };

  this.accelX = inputX => {
    let _hAccel = inputX * hAccel;

    phy.dx += _hAccel * dt;
  };

  this.accelY = inputY => {
    let _hAccel = inputY * hAccel;

    phy.dy += _hAccel * dt;
  };

  this.vel = () => {
    phy.dx += phy.jax * dt;
    phy.dy += phy.jay * dt;
  };

  this.move = () => {
    let amount;

    remx += phy.dx * dt + phy.jax * dt / 2;
    amount = Math.floor(remx);
    remx -= amount;
    moveX(amount);

    remy += phy.dy * dt + phy.jax * dt / 2;
    amount = Math.floor(remy);
    remy -= amount;
    moveY(amount);
  };

  const moveX = (amount) => {
    
    let step = Math.sign(amount);

    for (let i = 0; i < Math.abs(amount); i++) {
      if (!isSolid(step, 0)) {
        phy.x += step;
      } else {
        phy.dx = 0;
        break;
      }
    }

  };

  const moveY = (amount) => {
    
    let step = Math.sign(amount);

    for (let i = 0; i < Math.abs(amount); i++) {
      if (!isSolid(0, step)) {
        phy.y += step;
      } else {
        phy.dy = 0;
        break;
      }
    }

  };


  const isSolid = (ox, oy) => {

    let { x, y } = phy;

    return solidAt(x + ox + hitbox.x,
                   y + oy + hitbox.y,
                   hitbox.w,
                   hitbox.h);
  };

  const fSolid = _ => _.solid;

  const solidAt = (x, y, w, h) => {
    return tileFlagAt(x, y, w, h, fSolid);
  };

  const tileFlagAt = (x, y, w, h, fFlag) => {
    for (let i = Math.floor(x / butil.TileSize);
         i <= (x + w - 1) / butil.TileSize; 
         i++) {
      for (let j = Math.floor(y / butil.TileSize); 
           j <= Math.floor(y + h - 1) / butil.TileSize;
           j++) {
        if (backout.fGet(i, j, fFlag)) {
          return true;
        }
      }
    }
    return false;
  };

  this.isSolid = isSolid;

}
