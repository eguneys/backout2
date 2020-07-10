import * as v from '../vec2';
import { WorldSize, PlayerSize, TileSize } from '../butil';

export default function Entity(aEntity, bs) {

  let { screen } = bs;

  let ScreenSize = [screen.width, screen.height];

  const worldToScreen = (wPos) => {
    return v.cmapTo(wPos, WorldSize, ScreenSize);
  };

  this.playerSize = worldToScreen(PlayerSize);
  this.tileSize = worldToScreen([TileSize, TileSize]);

  this.x = 0;
  this.y = 0;

  this.vx = 0;
  this.vy = 0;

  this.ax = 0;
  this.ay = 0;

  this.penX = 0;
  this.penY = 0;
      
  aEntity.oPhy.subscribe(phy => {
    let pos = worldToScreen(phy.pos()),
        vel = worldToScreen(phy.vel()),
        acc = worldToScreen(phy._acceleration());

    this.x = Math.round(pos[0]);
    this.y = Math.round(pos[1]);

    this.vx = Math.round(vel[0]);
    this.vy = Math.round(vel[1]);

    this.ax = acc[0];
    this.ay = acc[1];

    this.facing = Math.sign(this.vx);
  });

  aEntity.oPenetration.subscribe((penetration) => {
    penetration = worldToScreen(penetration);

    this.penX = penetration[0];
    this.penY = penetration[1];
  });

}
