import * as v from '../vec2';
import { TileSize, WorldSize } from '../butil';

export default function StaticEntity(aEntity, bs) {

  let { screen } = bs;

  let ScreenSize = [screen.width, screen.height];

  this.x = 0;
  this.y = 0;

  const worldToScreen = (wPos) => {
    return v.cmapTo(wPos, WorldSize, ScreenSize);
  };

  let tileSize = worldToScreen([TileSize, TileSize]);
  let [x, y] = worldToScreen(aEntity.pos);
  this.x = x;
  this.y = y;

  this.tileW = tileSize[0];
  this.tileH = tileSize[1];

}
