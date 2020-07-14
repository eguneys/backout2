import Pool from 'poolf';
import { rect } from '../dquad/geometry';
import Animation from './animation';

export default function Player(play, ctx, bs) {

  let { frames, g } = ctx;

  let mall = frames['all'];

  let { entity } = bs;

  let { playerSize } = entity;

  let [w, h] = playerSize;      

  let baseBounds = rect(0, 0, w, h);

  let cPenetration = new Penetration(this, ctx, bs);

  const animation = (key) => {
    let bounds = rect(baseBounds.x, baseBounds.y,
                      baseBounds.w, baseBounds.h);
    return new Animation(this, ctx, {
      textures: mall[key],
      bounds
    });
  };
  
  const reversed = (animation) => {
    animation.reversed();
    return animation;
  };

  const animations = {
    idle: animation('idle'),
    runleft: reversed(animation('running')),
    runright: animation('running'),
    slidingleft: animation('sliding'),
    slidingright: reversed(animation('sliding'))
  };

  let currentAnimationKey;

  let currentAnimation = () => {
    return animations[currentAnimationKey];
  };

  const getAnimationKey = () => {
    let { x, y, vx, vy, sliding } = entity;

    if (sliding) {
      return sliding < 0 ? 'slidingright' : 'slidingleft';
    } else if (vx === 0 && vy === 0) {
      return 'idle';
    } else if (vx < 0) {
      return 'runleft';
    } else if (vx > 0) {
      return 'runright';
    } else {
      return 'idle';
    }
  };

  const updateCurrentAnimation = () => {
    let animationKey = getAnimationKey();
    if (currentAnimationKey !== animationKey) {
      currentAnimationKey = animationKey;
      currentAnimation().play();
    }
  };

  this.update = (delta) => {
    entity.update(delta);

    updateCurrentAnimation();

    let anim = currentAnimation();
    anim.update(delta);

    let { x, y } = entity;
    anim.move(x, y);

    cPenetration.update(delta);
  };

  this.render = () => {
    let anim = currentAnimation();
    anim.render();
    cPenetration.render();
  };
  
}

function Penetration(play, ctx, bs) {

  const { g } = ctx;

  let { entity } = bs;

  let { tileSize: [tileW, tileH] } = entity;


  let vSplashes = new Pool(() => new VSplash(this, ctx, {
    entity,
    onRelease(_) {
      vSplashes.release(_);
    }
  }));

  let hSplashes = new Pool(() => new HSplash(this, ctx, {
    entity,
    onRelease(_) {
      hSplashes.release(_);
    }
  }));

  let runSplashCounter = 0;

  const updateSplashes = (delta) => {
    let { vx, penX, penY } = entity;

    let aPenY = Math.abs(penY),
        aPenX = Math.abs(penX);

    if (aPenY > tileH * 0.05) {
      vSplashes.acquire(_ => _.init());
    } else if (aPenY > 0) {
      if (!!vx) {
        runSplashCounter++;
      }
    }

    if (aPenX > tileW * 0.05) {
      hSplashes.acquire(_ => _.init());
    } else if (aPenX > 0) {

    }

    if (runSplashCounter > 7) {
      runSplashCounter = 0;
      vSplashes.acquire(_ => _.init());
    }
  };

  this.update = (delta) => {
    vSplashes.each(_ => _.update(delta));
    hSplashes.each(_ => _.update(delta));

    updateSplashes(delta);
  };

  this.render = () => {

    vSplashes.each(_ => _.render());
    hSplashes.each(_ => _.render());
  };
  
}

function HSplash(play, ctx, bs) {

  let self = this;

  const { frames, g } = ctx;

  const mall = frames['all'];

  let { entity } = bs;

  let { tileSize: [tileW, tileH] } = entity;

  let bounds = rect(0, 0, tileW, tileH);
  let cSplash = new Animation(this, ctx, {
    textures: mall['trail2'],
    bounds,
    onHide: () => {
      bs.onRelease(self);
    }
  });

  cSplash.rotate(Math.PI * 0.5);

  this.init = () => {
    let { x, y, penX, facing } = entity;

    if (penX < 0) {
      cSplash.reversed();
      bounds.move(x,
                  y);
    } else {
      cSplash.unreversed();
      bounds.move(x + tileW, y);
    }
    cSplash.once();    
  };

  this.update = (delta) => {
    cSplash.update(delta);
  };

  this.render = () => {
    cSplash.render();
  };
  
}

function VSplash(play, ctx, bs) {

  let self = this;

  const { frames, g } = ctx;

  const mall = frames['all'];

  let { entity } = bs;

  let { playerSize: [playerW, playerH], tileSize: [tileW, tileH] } = entity;

  let bounds = rect(0, 0, tileW, tileH);
  let cSplash = new Animation(this, ctx, {
    textures: mall['trail'],
    bounds,
    onHide: () => {
      bs.onRelease(self);
    }
  });

  this.init = () => {
    let { playerTileX: x, playerTileY: y, penY, facing } = entity;

    if (facing < 0) {
      cSplash.reversed();
      // I have no idea why * 2
      bounds.move(x + playerW * 1.5,
                  y);
    } else {
      cSplash.unreversed();
      bounds.move(x - playerW, y);
    }
    cSplash.once();    
  };

  this.update = (delta) => {
    cSplash.update(delta);
  };

  this.render = () => {
    cSplash.render();
  };
  
}
