import { objForeach } from '../util2';
import iPol from '../ipol';
import * as mu from 'mutilz';
import * as v from '../vec2';
import { WorldSize, TileSize } from '../butil';
import StaticEntity from './staticentity';

export default function Ground(play, ctx, bs) {
  
  let backout = play.backout;

  let cTiles = backout
      .aGround
      .aTiles.map(_ => {
        let entity = new StaticEntity(_, bs);
        
        return new Tile(this, ctx, {
          entity,
          ...bs
        });
      });

  const { g } = ctx;

  this.update = (delta) => {
    cTiles.forEach(_ => _.update(delta));
  };

  this.render = () => {
    cTiles.forEach(_ => _.render());
  };
  
}

function Tile(play, ctx, bs) {

  let { entity } = bs;

  let { tileW, tileH } = entity;

  const { g } = ctx;

  let cSplash = new Splash(this, ctx, bs);

  this.update = (delta) => {
    cSplash.update(delta);
  };

  let color = mu.rand(10, 12);

  this.render = () => {
    let { x, y } = entity;

    g.fr(x, y, tileW, tileH, color);

    cSplash.render();
  };
  
}

function Splash(play, ctx, bs) {

  let { entity } = bs;

  let { tileW, tileH } = entity;

  const { g } = ctx;

  let iss = {
    up: new iPol(0, 0, {}),
    down: new iPol(0, 0, {}),
    left: new iPol(0, 0, {}),
    right: new iPol(0, 0, {}),
  };

  this.update = (delta) => {
    let { trail } = entity;

    objForeach(iss, (key, _) => {
      _.update(delta / 500);

      let tT = _.target();

      if (trail[key] && tT === 0) {
        _.target(1);
      }
    });

  };

  this.render = () => {
    let { trail: { up, down, left, right } } = entity;

    if (up) {
      renderVertical('up');
    } 
    if (down) {
      renderVertical('down');
    }
    if (left) {
      renderHorizontal('left');
    }
    if (right) {
      renderHorizontal('right');
    }
  };

  let color = 5;

  const renderVertical = (vDir) => {
    let { x, y } = entity;

    let iVert = iss[vDir];

    let _vVert = iVert.value();

    let topOffset = vDir === 'up' ? 0 : tileH - tileH * 0.1;

    g.fr(x + (1.0 - _vVert) * tileW * 0.5, y + topOffset, tileW * _vVert, tileH * 0.1, color);
  };

  const renderHorizontal = (vDir) => {
    let { x, y } = entity;

    let iVert = iss[vDir];
    let _vVert = iVert.value();

    let rightOffset = vDir === 'left' ? 0 : (tileW - tileW * 0.1);

    g.fr(x + rightOffset,
         y + (1.0 - _vVert) * tileH * 0.5,
         tileW * 0.1,
         tileH * _vVert, color);
  };
  
}
