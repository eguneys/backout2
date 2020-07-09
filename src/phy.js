import * as v from './vec2';

const { vec2 } = v;

/* 
 * Building a better jump: 
 * https://www.youtube.com/watch?v=hG9SzQxaCm8
 */
export default function Phy({
  pos = vec2(0),
  vel = vec2(0),
  acc = vec2(0),
  gravity = vec2(0),
  tMax = 40,
  vMax = 2,
  hMax = 40,
  xSubH = 50,
  tHMax = 20 // deprecated
}) {

  this.pos = v.makeAttribute(pos);
  this.vel = v.makeAttribute(vel);
  this.acc = v.makeAttribute(acc);
  this.gravity = v.makeAttribute(gravity);

  let friction = 5 / tMax;
  let hAcceleration = vMax * friction;

  let _hAcceleration = 0;

  let _vAcceleration = 0;

  let v0Jump = (2 * hMax) / tHMax;
  let gJump = -(2 * hMax) / (tHMax * tHMax);

  let v0JumpForXSubH = (2 * hMax) * vMax / xSubH;

  let gJumpForXSubH = - (2 * hMax * vMax * vMax) / (xSubH * xSubH);

  let _vFallAccel = 0;

  this.jumping = () => {
    return vel[1] < 0;
  };
  this.falling = () => {
    return vel[1] > 0;
  };

  this.horizontal = (vH) => {
    _hAcceleration = hAcceleration * vH;
  };

  // deprecated
  this.verticalTh = () => {
    _vAcceleration = -gJump;
    v.add(vel, [0, -v0Jump]);
  };

  this.verticalBoost = () => {
    _vAcceleration = -gJumpForXSubH;
    vel[1] = -v0JumpForXSubH;
  };

  this.verticalBoostDrag = () => {
    _vAcceleration = 0;
    _vFallAccel = -gJumpForXSubH * 10;
  };

  this.fallingVelocity = () => {
    _vAcceleration = 0;
    this.fall();
  };

  this.slidingBoost = (vH) => {
    _hAcceleration = gJumpForXSubH * vH ;
    vel[0] = 3 * v0JumpForXSubH * vH;

    _vAcceleration = -gJumpForXSubH;
    vel[1] = -v0JumpForXSubH;
  };

  let _vSlideDrag = 0;
  this.fall = () => {
    _vFallAccel = -gJumpForXSubH * 3;
    _vSlideDrag = 0;
  };

  this.slide = () => {
    _vSlideDrag = 1;
  };

  this._acceleration = () => {

    let _vAccel = _vAcceleration;

    if (_vAccel === 0) {
      _vAccel = _vFallAccel;
    }

    let _acceleration = [_hAcceleration,
                         _vAccel];

    return _acceleration;
  };

  this.resolveX = manifold => {
    if (!manifold) {
      return null;
    }

    let { xOverlap, xNormal } = manifold;

    pos[0] += xOverlap * xNormal;
    vel[0] = 0;
    _hAcceleration = 0;

    return xOverlap;
  };

  this.resolveY = manifold => {
    if (!manifold) {
      return null;
    }

    let { yOverlap, yNormal } = manifold;

    pos[1] += yOverlap * yNormal;
    vel[1] = 0;
    _vAcceleration = 0;

    // if (yNormal < 0) {
    //   _vFallAccel = 0;
    // } else {
    // }

    return yOverlap;
  };

  // https://stackoverflow.com/questions/667034/simple-physics-based-movement
  this.calculation = (delta, collisions = {}) => {
    const dt = delta;

    let newVel = vec2(0, 0),
        newPos = vec2(0);

    let _vAccel = _vAcceleration;

    if (_vAccel === 0) {
      _vAccel = _vFallAccel;
    }

    let _acceleration = [_hAcceleration,
                         _vAccel];

    let xSlideDrag = Math.sign(vel[1]) > 0 ? 1:0;

    v.add(newVel, vel);
    v.addScale(newVel, _acceleration, dt);
    v.addScale(newVel, [vel[0], 0], -friction * dt);

    v.addScale(newVel, [0, vel[1]],
               - friction  * _vSlideDrag * xSlideDrag * dt);

    v.add(newPos, pos);
    v.addScale(newPos, vel, dt);
    v.addScale(newPos, _acceleration, dt * dt * 0.5);


    let peakOfTheJump = newVel[1] > 0 && vel[1] < 0;

    return {
      vel: newVel,
      pos: newPos,
      peakOfTheJump
    };
  };

  let calculation;
  this.beginUpdate = (delta) => {
    calculation = this.calculation(delta);
  };

  this.peakOfTheJump = () => {
    return calculation.peakOfTheJump;
  };

  this.updateX = () => {
    let { pos: _pos, vel: _vel } = calculation;
    vel[0] = _vel[0];
    pos[0] = _pos[0];
  };

  this.updateY = () => {
    let { pos: _pos, vel: _vel } = calculation;
    vel[1] = _vel[1];
    pos[1] = _pos[1];    
  };
}
