import { rect } from '../dquad/geometry';
import { observable } from '../observable';
import * as v from '../vec2';
import { WorldSize, ViewSize } from '../butil';

export default function WorldToScreen(screen) {

  let ScreenSize = [screen.width, screen.height];

  let screenRect = rect(0, 0, ...ScreenSize);

  let halfScreen = v.cscale(ScreenSize, 0.5);

  let vOrigin = [0, 0];

  const screenToWorld = (sPos) => {
    let r = v.cmapTo(sPos, ScreenSize, ViewSize);
    return v.add(r, vOrigin);
  };

  const worldToScreen = (wPos, addOrigin) => {
    let r = addOrigin ? v.csub(wPos, vOrigin):v.copy(wPos);
    return v.mapTo(r, ViewSize, ScreenSize);
    return r;
  };

  this.visible = (sPos) => {
    return screenRect.containsPoint(...sPos);
  };

  this.screenToWorld = screenToWorld;
  this.worldToScreen = worldToScreen;
  let oUpdateView = this.oUpdateView = observable();

  this.origin = (x, y) => {
    v.set(vOrigin, x, y);
    oUpdateView.notify();
  };

}
