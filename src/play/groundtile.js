import { objForeach } from '../util2';
import iPol from '../ipol';
import * as mu from 'mutilz';
import * as v from '../vec2';
import { WorldSize, TileSize } from '../butil';

export default function Tile(play, ctx, bs) {

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

  let colours = [
    0,
    5,
    5,
    3,
    2,
    1,
    0
  ];

  let iss = {
    up: new iPol(0, 0, {}),
    down: new iPol(0, 0, {}),
    left: new iPol(0, 0, {}),
    right: new iPol(0, 0, {}),
  };

  let times = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
  };

  this.update = (delta) => {
    let { trail } = entity;

    objForeach(iss, (key, _) => {
      _.update(delta / 500);

      let tT = _.target();

      if (trail[key] != times[key]) {
        times[key] = trail[key];
        _.both(0, 1);
      }
    });

  };

  this.render = () => {
    let { trail: { up, down, left, right } } = entity;

    renderVertical('up', up);
    renderVertical('down', down);
    renderHorizontal('left', left);
    renderHorizontal('right', right);
  };

  const renderVertical = (vDir, times) => {
    if (!times) {
      return;
    }
    let color = colours[times % colours.length];
    let { x, y } = entity;

    let iVert = iss[vDir];

    let _vVert = iVert.value();

    let topOffset = vDir === 'up' ? 0 : tileH - tileH * 0.1;

    let preColor = times - 1;

    if (preColor !== 1) {
      preColor = colours[preColor % colours.length];
      g.fr(x, y + topOffset, tileW, tileH * 0.1, preColor);
    }

    g.fr(x + (1.0 - _vVert) * tileW * 0.5, y + topOffset, tileW * _vVert, tileH * 0.1, color);
  };

  const renderHorizontal = (vDir, times) => {
    if (!times) {
      return;
    }
    let color = colours[times % colours.length];
    let { x, y } = entity;

    let iVert = iss[vDir];
    let _vVert = iVert.value();

    let rightOffset = vDir === 'left' ? 0 : (tileW - tileW * 0.1);


    let preColor = times - 1;

    if (preColor !== 0) {
      preColor = colours[preColor % colours.length];
      g.fr(x + rightOffset, y, tileW * 0.1, tileH, preColor);
    }

    g.fr(x + rightOffset,
         y + (1.0 - _vVert) * tileH * 0.5,
         tileW * 0.1,
         tileH * _vVert, color);
  };
  
}
