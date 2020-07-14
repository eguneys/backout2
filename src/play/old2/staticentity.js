import * as v from '../vec2';
import { TileSize, WorldSize } from '../butil';

export default function StaticEntity(aEntity, camera) {

  let { worldToScreen, oUpdateView } = camera;

  let tileSize = worldToScreen([TileSize, TileSize]);

  this.x = 0;
  this.y = 0;

  this.tileW = tileSize[0];
  this.tileH = tileSize[1];

  this.trail = aEntity.trail;

  const updateView = () => {
    let pos = worldToScreen(aEntity.pos, true);

    this.x = pos[0];
    this.y = pos[1];

    this.visible = camera.visible(pos);
  };

  oUpdateView.subscribe(updateView);
}
