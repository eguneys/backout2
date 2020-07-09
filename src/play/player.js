import * as v from '../vec2';
import iPol from '../ipol';
import { WorldSize, PlayerSize } from '../butil';

export default function Player(play, ctx, bs) {

  let { screen } = bs;

  let ScreenSize = [screen.width, screen.height];

  const worldToScreen = (wPos) => {
    return v.cmapTo(wPos, WorldSize, ScreenSize);
  };

  let playerSize = worldToScreen(PlayerSize);

  let { entity } = bs;

  const { g } = ctx;

  let iIdle = new iPol(0, 1, { yoyo: true });

  this.update = (delta) => {
    let { x, y } = entity;

    iIdle.update(delta / 300);
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
