import { rect } from '../dquad/geometry';
import * as v from '../vec2';
import iPol from '../ipol';
import { ViewSize } from '../butil';

function linear(p0, p1, t) {
  return (p1 - p0) * t + p0;
}

export default function FollowPlayer(aPlayer, camera) {

  let halfViewSize = v.cscale(ViewSize, 0.5);
  let followFrameSize = [ViewSize[0] * 0.01, ViewSize[1] * 0.01];
  let followFrame = rect(0, 0, ...followFrameSize);
  

  let iX = new iPol(0, 0, {}), 
      iY = new iPol(0, 0, {});

  let followDuration = 50;
  
  let { halfPlayerSize, wx, wy } = aPlayer;
  iX.both(wx, wx);
  iY.both(wy, wy);

  this.update = delta => {

    let { wx, vx, wy, vy } = aPlayer;

    let targetX,
        targetY;

    wx += halfPlayerSize[0];
    wy += halfPlayerSize[1];

    // wx += vx * 10;
    // wy += vy * 10;

    if (followFrame.overflowX(wx)) {

      followFrame.moveCenterX(wx);

      targetX = -halfViewSize[0] + followFrame.pos[0];

      iX.value(iX.value());
      iX.target(targetX);
    }

    if (followFrame.overflowY(wy)) {

      followFrame.moveCenterY(wy);

      targetY = -halfViewSize[1] + followFrame.pos[1];

      iY.value(iY.value());
      iY.target(targetY);
    }
    
    let vX = iX.value(),
        vY = iY.value();
    
    // vX = iX.target();
    // vY = iY.target();

    camera.origin(vX, vY);

    iX.update(delta / followDuration);
    iY.update(delta / followDuration);
  };
  
}
