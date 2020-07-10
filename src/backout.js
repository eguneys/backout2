import * as v from './vec2';
import { rect } from './dquad/geometry';
import { observable  } from './observable';
import Phy from './phy';
import Collt from './collt';
import { mergeManifold, aabbvsaabb } from './collt/detect';

import { WorldSize, TileSize, PlayerSize } from './butil';

import * as maker from './maker';

let [wX, wY] = WorldSize;

let slideOffset = v.cscale(PlayerSize, 0.2);
let slideOffsetPos = v.cscale(slideOffset, -1);


export default function Backout() {

  let player = this.aPlayer = new Player(this);
  let ground = this.aGround = new Ground();

  let userInput;

  this.userActionEvent = data => {
    userInput = data;
  };

  this.playerSlideGroundCollision = () => {
    let ctiles = ground.detectCollision(player.aabbSlide);

    let mergedM;

    ctiles.forEach(ctile => {
      let manifold = aabbvsaabb(ctile.aabb, player.aabbSlide);

      if (manifold) {
        ctile.slideManifold(manifold);

        if (mergedM) {
          mergedM = mergeManifold(mergedM, manifold);
        } else {
          mergedM = manifold;          
        }
      }
    });

    return mergedM;
  };

  this.manifoldPlayerGroundCollision = () => {
    let ctiles = ground.detectCollision(player.aabb);

    return ctiles.reduce((acc, ctile) => {
      let manifold = aabbvsaabb(ctile.aabb, player.aabb);

      if (!acc) {
        return manifold;
      }

      if (!manifold) {
        return acc;
      }

      return mergeManifold(acc, manifold);
    }, null);
  };

  this.update = (delta) => {
    player.userInput(userInput);
    player.update(delta);
    ground.update(delta);
  };
}

function Ground() {

  let bounds = rect(0, 0, wX, wY);
  let collt = new Collt(bounds);

  let tiles = this.aTiles = [];

  const addTile = tile => {
    tiles.push(tile);
    collt.addRectangle(tile, tile.aabb);
  };

  const clearTrails = () => {
    tiles.forEach(_ => _.clearTrails());
  };

  this.detectCollision = collt.detectCollision;

  let lines = maker.makeWorld();
  lines.forEach(t => addTile(new Tile(t.x, t.y)));

  this.update = delta => {
    clearTrails();
  };
}

function Tile(x, y) {

  this.pos = [x, y];

  this.aabb = rect(x, y, TileSize, TileSize);

  let trail = this.trail = {
    up: 0,
    left: 0,
    down: 0,
    right: 0
  };

  let trailLock = {};

  let dontClear = false;

  this.clearTrails = () => {
    if (!dontClear) {
      trailLock.left = 0;
      trailLock.right = 0;
      trailLock.up = 0;
      trailLock.down = 0;
    }
    dontClear = false;
  };

  this.slideManifold = (manifold) => {
    let { xOverlap, yOverlap, xNormal, yNormal } = manifold;

    if (xOverlap <= slideOffset[0] * 1.2) {
      if (yOverlap > slideOffset[1] * 1.2) {
        if (xNormal < 0) {
          if (!trailLock.left) {
            trailLock.left = trail.left++;
          }
        } else {
          if (!trailLock.right) {
            trailLock.right = trail.right++;
          }
        };
      }
    }

    if (yOverlap <= slideOffset[1] * 1.2) {
      if (xOverlap > slideOffset[0] * 1.2) {
        if (yNormal < 0) {
          if (!trailLock.up) {
            trailLock.up = trail.up++;
          }
        } else {
          if (!trailLock.down) {
            trailLock.down = trail.down++;
          }
        }
      }
    }
    dontClear = true;
  };

}

function Player(backout) {

  let oPhy = this.oPhy = observable(new Phy({ 
    pos: [wX * 0.5, wY * 0.5],
    tMax: 30,
    vMax: TileSize * 0.3,
    hMax: TileSize * 6,
    xSubH: TileSize * 13
  }));

  let oPenetration = this.oPenetration = observable([0, 0]);

  this.aabb = rect(0, 0, ...PlayerSize);
  this.aabbSlide = rect(...slideOffsetPos,
                        ...v.add(v.cadd(PlayerSize,
                                        slideOffset), 
                                 slideOffset));

  let userInput;
  
  this.userInput = (_userInput) => {
    userInput = _userInput;
  };

  let sliding;
  let grounded;

  let upUsed = false;

  const updateCollision = () => {
    let pos = oPhy.apply(_ => _.pos());
    this.aabb.move(...pos);

    this.aabbSlide.move(...v.cadd(pos, slideOffsetPos));
  };

  const updateInput = () => {
    if (!userInput) {
      return;
    }
    let { up, left, down, right } = userInput;

    oPhy.mutate(phy => {
      if (left) {
        phy.horizontal(-1);
      } else if (right) {
        phy.horizontal(1);
      } else {
        phy.horizontal(0);
      }

      if (up) {

        if (!upUsed) {
          if (sliding) {
            upUsed = true;
            phy.slidingBoost(sliding);
          } else if (grounded) {
            upUsed = true;
            phy.verticalBoost();
          }
        }

      } else {
        upUsed = false;
        if (sliding) {
        } else if (phy.jumping()) {
          phy.verticalBoostDrag();
        }
      }

      if (!grounded) {
        if (sliding) {
          phy.slide();
        } else if (phy.jumping()) {
          
        } else {
          phy.fall();
        }
      }

    }, true);      
  };


  /* 
   * Collision Resolution
   * https://gamedev.stackexchange.com/questions/69339/2d-aabbs-and-resolving-multiple-collisions
   */
  this.update = delta => {
    updateInput();

    oPhy.mutate(_ => {
      _.beginUpdate(delta / 16);

      if (_.peakOfTheJump()) {
        _.fallingVelocity();
      }

      let xPenetration,
          yPenetration;

      let manifold;
      _.updateX();
      updateCollision();
      manifold = backout.manifoldPlayerGroundCollision();
      _.resolveX(manifold);
      {
        sliding = manifold && manifold.xNormal;
        xPenetration = manifold && 
          manifold.xOverlap * manifold.xNormal;
      }

      _.updateY();
      updateCollision();
      manifold = backout.manifoldPlayerGroundCollision();
      _.resolveY(manifold);
      {
        grounded = manifold && manifold.yNormal < 0;

        yPenetration = manifold && 
          manifold.yOverlap * manifold.yNormal;
      }

      updateCollision();
      manifold = backout.playerSlideGroundCollision();

      {
        sliding = !yPenetration && manifold && 
          Math.abs(manifold.yOverlap) > slideOffset[1] * 1.2 &&
          manifold.xNormal;
      }

      oPenetration.mutate(_ => {
        _[0] = xPenetration;
        _[1] = yPenetration;
      });

    });

  };

}
