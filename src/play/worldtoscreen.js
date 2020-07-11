import * as v from '../vec2';
import { WorldSize, ViewSize } from '../butil';

export default function WorldToScreen(screen) {

  let ScreenSize = [screen.width, screen.height];

  let vOrigin = [0, 0];

  const worldToScreen = (wPos) => {
    return v.cmapTo(wPos, WorldSize, ScreenSize);
  };

  this.origin = (x, y) => {
    
    v.set(vOrigin, x, y);
  };

  this.worldToScreen = worldToScreen;
}
