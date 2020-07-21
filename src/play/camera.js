import * as butil from '../butil';
import * as v from '../vec2';

export default function Camera(bs) {
  
  let { screen } = bs;

  let ScreenSize = [screen.w, screen.h];

  let WorldGroundSize = butil.GroundSize;

  const worldToScreen = (pos) => {
    let r = v.cmapTo(pos,
                   butil.ViewSize, 
                   ScreenSize);

    return r;    
  };

  let ScreenGroundSize = worldToScreen(WorldGroundSize);

  this.ScreenGroundSize = ScreenGroundSize;
  this.worldToScreen = worldToScreen;

}
