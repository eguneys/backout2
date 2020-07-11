import * as v from '../vec2';
import { TileSize, WorldSize } from '../butil';

export default function StaticEntity(aEntity, worldToScreen) {

  let tileSize = worldToScreen([TileSize, TileSize]);
  let [x, y] = worldToScreen(aEntity.pos);
  this.x = x;
  this.y = y;

  this.tileW = tileSize[0];
  this.tileH = tileSize[1];

  this.trail = aEntity.trail;
}
