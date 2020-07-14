import * as mu from 'mutilz';
import Pool from 'poolf';
import * as v from '../vec2';
import iPol from '../ipol';
import Phy from '../phy';

export default function Player(play, ctx, bs) {

  let { entity } = bs;

  let { playerSize } = entity;

  const { g } = ctx;

  let iIdle = new iPol(0, 1, { yoyo: true });

  let cPenetration = new Penetration(this, ctx, bs);

  this.update = (delta) => {
    let { x, y } = entity;

    iIdle.update(delta / 300);

    cPenetration.update(delta);
  };

  this.render = () => {
    let { vx, vy, ax, ay } = entity;

    if (vx === 0 && vy === 0) {
      renderIdle();
    } else if (vx !== 0) {
      renderHorizontal();
    } else {
      renderVertical();
    }

    cPenetration.render();
  };

  let [pWidth, pHeight] = playerSize;
  let pWidthThird = pWidth / 3;
  let idleExtend = pHeight * 0.5;
  let idleExtendThird = idleExtend / 2;

  let pShieldW = pWidth * 0.8,
      pShieldH = pHeight * 0.8;

  const renderVertical = () => {
    let { x, y, vy } = entity;

    g.fr(x,
         y,
         pWidth,
         pHeight,
         43);


    // eyes
    g.fr(x + pWidth * 0.3,
         y + pHeight * 0.01,
         pShieldW,
         pShieldH,
         50);
  };

  const renderHorizontal = () => {
    let { x, y, vx } = entity;

    let left = vx < 0,
        vLeft = left ? -1: 1;

    g.fr(x,
         y,
         pWidthThird * 4, 
         pHeight,
         43);

    let eyeOffset = pWidth * 0.5 + vLeft * pWidth * 0.2;

    let vIdle = iIdle.value();
    let vExtend = idleExtend * vIdle;

    // shield
    g.fr(x + vExtend * vLeft + eyeOffset,
         y + pHeight * 0.01 + vExtend / 3,
         pShieldW * 0.3,
         pShieldH,
         50);
  };

  const renderIdle = () => {
    let { x, y } = entity;

    let vIdle = iIdle.value();

    let vExtend = idleExtend * vIdle,
        vExtendThird = idleExtendThird * vIdle;

    // torso
    g.fr(x,
         y + vExtendThird,
         pWidthThird, 
         pHeight - vExtendThird,
         44);
    g.fr(x + pWidthThird,
         y + vExtend, 
         pWidthThird, 
         pHeight - vExtend,
         44);
    g.fr(x + pWidthThird * 2,
         y + vExtendThird,
         pWidthThird,
         pHeight - vExtendThird,
         44);

    // shield
    g.fr(x + pWidth * 0.3,
         y + pHeight * 0.01,
         pShieldW,
         pShieldH,
         50);
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

    if (runSplashCounter > 5) {
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

  const { g } = ctx;

  let { entity } = bs;

  let { playerSize: [playerW, playerH],
        tileSize: [tileW, tileH] } = entity;

  let particles = new Pool(() => 
    new SplashParticle(this, ctx, {
      life: 150,
      entity,
      onRelease(_) {
        particles.release(_);
      }
    }));

  let splashing = false;

  this.init = () => {
    let { x, y, penX, facing } = entity;

    // if (penX < 0) {
    //   y += tileH;
    // }
    x += penX > 0 ? 0 : playerW * 0.5;

    for (let i = 0; i < 10; i++) {
      let radius = mu.rand(tileH * 0.1, tileH * 0.2);

      let vx = mu.rand(tileW * 0.1, tileW * 0.5) * Math.sign(penX),
          vy = mu.rand(tileH * 0.1, tileH * 0.5) * -1;

      // vx = (facing === 0)? vx : vx * facing * -1;
      // vy = vy * 0.5 + facing === 0 ? 0 : vy * 0.5;

      particles.acquire(_ => _.init({
        x, y, radius,
        vx, vy
      }));
    }
    splashing = true;
  };

  this.update = (delta) => {
    if (splashing && particles.alives() === 0) {
      splashing = false;
      bs.onRelease(this);
    }
    particles.each(_ => _.update(delta));
  };

  this.render = () => {
    particles.each(_ => _.render());
  };
  
}

function VSplash(play, ctx, bs) {

  const { g } = ctx;

  let { entity } = bs;

  let { playerSize: [playerW, playerH],
        tileSize: [tileW, tileH] } = entity;

  let particles = new Pool(() => 
    new SplashParticle(this, ctx, {
      life: 150,
      entity,
      onRelease(_) {
        particles.release(_);
      }
    }));

  let splashing = false;

  this.init = () => {
    let { x, y, penY, facing } = entity;

    if (penY < 0) {
      y += tileH;
    }
    x += facing < 0 ? playerW * 1.5 : -playerW * 0.5;

    for (let i = 0; i < 10; i++) {
      let radius = mu.rand(tileH * 0.1, tileH * 0.3);

      let vx = mu.rand(tileW * 0.2, tileW * 0.4),
          vy = mu.rand(tileH * 0.2, tileH * 0.4) * -1;

      vx = (facing === 0)? vx : vx * facing * -1;
      vy = vy * 0.5 + facing === 0 ? 0 : vy * 0.5;

      particles.acquire(_ => _.init({
        x, y, radius,
        vx, vy
      }));
    }
    splashing = true;
  };

  this.update = (delta) => {
    if (splashing && particles.alives() === 0) {
      splashing = false;
      bs.onRelease(this);
    }
    particles.each(_ => _.update(delta));
  };

  this.render = () => {
    particles.each(_ => _.render());
  };
  
}


function SplashParticle(play, ctx, bs) {

  const { g } = ctx;

  let { entity } = bs;

  let { life = 500 } = bs;

  let { tileSize: [tileW, tileH] } = entity;

  let color = 5;

  let iI = new iPol(0, 0, {});

  let phy = new Phy({
    pos: [0, 0],
    tMax: 30,
    vMax: tileW * 0.3,
    hMax: tileW * 10,
    xSubH: tileW * 13
  });

  let radius;

  this.init = (data) => {
    phy.pos(data.x, data.y);
    phy.vel(data.vx, data.vy);

    phy.fall();


    radius = data.radius;

    iI.both(0, 1);
  };

  this.update = (delta) => {
    iI.update(delta / life);

    if (iI.target() === 1 && iI.settled()) {
      bs.onRelease(this);
    }

    phy.update(delta / 16);
  };

  this.render = () => {
    let vSplash = iI.value();

    let [x, y] = phy.pos();

    let r = radius * vSplash;

    g.fillCircle(x, y, r, color);
  };
  
}
