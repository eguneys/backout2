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
    cTiles.forEach(_ => _.update());
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

  this.update = (delta) => {};

  this.render = () => {
    //renderHorizontal(1);
    //renderVertical(-1);
  };

  let color = 5;

  const renderVertical = (vDir) => {
    let { x, y } = entity;

    let topOffset = vDir === -1 ? 0 : tileH - tileH * 0.1;

    g.fr(x, y + topOffset, tileW, tileH * 0.1, color);
  };

  const renderHorizontal = (vDir) => {
    let { x, y } = entity;

    let rightOffset = vDir === -1 ? 0 : (tileW - tileW * 0.1);

    g.fr(x + rightOffset,
         y,
         tileW * 0.1,
         tileH, color);
  };
  
}
