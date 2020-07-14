import { objForeach } from '../util2';
import * as mu from 'mutilz';
import { rect } from '../dquad/geometry';
import Animation from './animation';

export default function GroundTile(play, ctx, bs) {

  const { frames } = ctx;
  const mall = frames['all'];

  let { entity } = bs;

  let { x, y, tileW, tileH } = entity;

  let bounds = rect(x, y, tileW, tileH);

  let cTile = new Animation(this, ctx, {
    textures: mall['tiles'],
    bounds
  });

  let cSplash = new Splash(this, ctx, bs);

  const nbFrames = 4;
  let frame = mu.randInt(0, nbFrames);
  
  cTile.stop(frame);

  let { g } = ctx;

  this.update = (delta) => {
    cTile.update(delta);
    cSplash.update(delta);
  };

  this.render = () => {
    let { x, y, visible } = entity;

    if (!visible) {
      return;
    }

    cTile.render();
    cSplash.render();
  };
  
}

function Splash(play, ctx, bs) {

  let { g, frames } = ctx;

  const mall = frames['all'];

  let { entity } = bs;

  let { tileW, tileH } = entity;

  let baseBounds = rect(0, 0, tileW, tileH);

  const animation = () => {
    let bounds = rect(baseBounds.x,
                      baseBounds.y,
                      baseBounds.w,
                      baseBounds.h);
    return new Animation(this, ctx, {
      bounds,
      textures: mall['trailtile']
    });
  };

  const down = (animation) => {
    animation.scale(1, -1);
    return animation;
  };

  const h = (animation, dir) => {
    animation.rotate(Math.PI * 0.5);
    if (dir === 'left') {
      animation.scale(-1);
    } else {
      animation.origin(tileW);
    }
    return animation;
  };

  let cAnims = {
    up: animation('up'),
    down: down(animation('down')),
    left: h(animation('left'), 'left'),
    right: h(animation('right'), 'right')
  };

  this.update = (delta) => {
    let { x, y, trail } = entity;

    objForeach(cAnims, (key, _) => {
      _.update(delta);

      if (trail[key] === 1) {
        _.move(x, y);
        _.once(false);
      }
    });
  };

  this.render = () => {
    objForeach(cAnims, (key, _) => _.render());
  };
  
}
